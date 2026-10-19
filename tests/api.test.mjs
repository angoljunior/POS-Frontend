import assert from 'node:assert/strict';
import { test, beforeEach } from 'node:test';
import { AxiosError } from 'axios';
import api, { authClient, refreshAccessToken, setSessionExpiredHandler } from '../src/api/axios.js';
import { tokenManager } from '../src/api/tokenManager.js';
import { authApi } from '../src/api/auth.api.js';
import { productsCatalogApi } from '../src/api/productsCatalog.api.js';

const storage = new Map();
globalThis.sessionStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
};
const ok = (config, data) => ({ config, data, status: 200, statusText: 'OK', headers: {} });
const fail = (config, status) => { throw new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, { config, status, data: {}, headers: {} }); };
beforeEach(() => {
  tokenManager.clearTokens();
  setSessionExpiredHandler(null);
  api.defaults.adapter = (config) => Promise.resolve(ok(config, {}));
  authClient.defaults.adapter = (config) => Promise.resolve(ok(config, {}));
});

test('login saves tokens and protected calls send Bearer authentication', async () => {
  authClient.defaults.adapter = async (config) => ok(config, { access: 'access', refresh: 'refresh', user: { username: 'cashier' } });
  await authApi.login('cashier', 'password');
  api.defaults.adapter = async (config) => {
    assert.equal(config.headers.Authorization, 'Bearer access');
    return ok(config, { username: 'cashier' });
  };
  assert.equal((await authApi.getCurrentUser()).username, 'cashier');
});

test('concurrent 401 responses share one refresh and retry successfully', async () => {
  tokenManager.setAccessToken('old');
  tokenManager.setRefreshToken('refresh');
  let refreshCount = 0;
  authClient.defaults.adapter = async (config) => {
    refreshCount++;
    await new Promise((resolve) => setTimeout(resolve, 10));
    return ok(config, { access: 'new', refresh: 'rotated' });
  };
  api.defaults.adapter = async (config) => {
    if (config.headers.Authorization === 'Bearer old') return fail(config, 401);
    assert.equal(config.headers.Authorization, 'Bearer new');
    return ok(config, []);
  };
  await Promise.all([api.get('products/'), api.get('inventory/'), api.get('brands/')]);
  assert.equal(refreshCount, 1);
  assert.equal(tokenManager.getRefreshToken(), 'rotated');
});

test('invalid refresh clears session; forbidden requests do not refresh', async () => {
  tokenManager.setRefreshToken('invalid');
  let expired = 0;
  setSessionExpiredHandler(() => expired++);
  authClient.defaults.adapter = async (config) => fail(config, 401);
  api.defaults.adapter = async (config) => fail(config, 401);
  await assert.rejects(api.get('products/'));
  assert.equal(tokenManager.getRefreshToken(), null);
  assert.equal(expired, 1);
  tokenManager.setRefreshToken('valid');
  api.defaults.adapter = async (config) => fail(config, 403);
  await assert.rejects(api.get('products/'));
  assert.equal(tokenManager.getRefreshToken(), 'valid');
});

test('temporary refresh network errors preserve session tokens', async () => {
  tokenManager.setRefreshToken('valid');
  authClient.defaults.adapter = async () => { throw new Error('Network Error'); };
  await assert.rejects(refreshAccessToken());
  assert.equal(tokenManager.getRefreshToken(), 'valid');
});

test('a refresh response cannot resurrect a cleared session', async () => {
  tokenManager.setRefreshToken('valid');
  let finish;
  authClient.defaults.adapter = (config) => new Promise((resolve) => { finish = () => resolve(ok(config, { access: 'new', refresh: 'new-refresh' })); });
  const pending = refreshAccessToken();
  await new Promise((resolve) => setTimeout(resolve, 0));
  tokenManager.clearTokens();
  finish();
  await assert.rejects(pending);
  assert.equal(tokenManager.getAccessToken(), null);
  assert.equal(tokenManager.getRefreshToken(), null);
});

test('logout revokes latest rotated refresh and clears local tokens', async () => {
  tokenManager.setRefreshToken('old-refresh');
  let revoked = false;
  authClient.defaults.adapter = async (config) => {
    if (config.url === 'auth/token/refresh/') return ok(config, { access: 'new-access', refresh: 'new-refresh' });
    assert.equal(config.url, 'auth/logout/');
    assert.equal(JSON.parse(config.data).refresh, 'new-refresh');
    assert.equal(config.headers.Authorization, 'Bearer new-access');
    revoked = true;
    return ok(config, {});
  };
  await authApi.logout();
  assert.equal(revoked, true);
  assert.equal(tokenManager.getRefreshToken(), null);
  assert.equal(tokenManager.getAccessToken(), null);
});

test('catalog loads all pages and joins category, brand and stock', async () => {
  api.defaults.adapter = async (config) => {
    const payloads = {
      'products/': { results: [{ id: 1, name: 'Coffee', sku: 'C1', category: 7, brand: 8, selling_price: '3.50' }], next: 'http://127.0.0.1:8000/api/v1/products/?page=2' },
      'http://127.0.0.1:8000/api/v1/products/?page=2': { results: [{ id: 2, name: 'Tea', sku: 'T1', category: 7, selling_price: '2.00' }], next: null },
      'categories/': [{ id: 7, name: 'Drinks' }],
      'brands/': [{ id: 8, name: 'Test brand' }],
      'inventory/': [{ product: 1, quantity: 12 }],
    };
    assert.ok(config.url in payloads);
    return ok(config, payloads[config.url]);
  };
  const catalog = await productsCatalogApi.getAll();
  assert.equal(catalog.products.length, 2);
  assert.equal(catalog.products[0].category, 'Drinks');
  assert.equal(catalog.products[0].brand, 'Test brand');
  assert.equal(catalog.products[0].stock, 12);
  assert.equal(catalog.products[0].price, 3.5);
  assert.equal(catalog.products[1].stock, null);
});

const { loadInventory, loadCustomers, saveCustomer, requestError } = await import('../src/api/directories.api.js');

test('inventory joins paginated quantities to product and category records by ID', async () => {
  api.defaults.adapter = async (config) => {
    const pages = {
      'inventory/': { results: [{ id: 91, product: 2, quantity: 4 }], next: 'inventory/?page=2' },
      'inventory/?page=2': { results: [{ id: 92, product: 1, quantity: 0 }], next: null },
      'products/': { results: [{ id: 1, name: 'One', sku: 'ONE', category: 7, reorder_level: 5 }], next: 'products/?page=2' },
      'products/?page=2': { results: [{ id: 2, name: 'Two', sku: 'TWO', category: { id: 7 }, reorder_level: 3 }], next: null },
      'categories/': [{ id: 7, name: 'Drinks' }],
    };
    return ok(config, pages[config.url]);
  };
  const rows = await loadInventory();
  assert.deepEqual(rows.map(row => [row.id, row.name, row.onHand, row.reorderLevel]), [[91, 'Two', 4, 3], [92, 'One', 0, 5]]);
  assert.equal(rows[0].category, 'Drinks');
  assert.equal(rows[0].reserved, null);
});

test('customer directory loads all DRF pages without inventing unsupported fields', async () => {
  api.defaults.adapter = async (config) => ok(config, config.url === 'customers/'
    ? { results: [{ id: 1, first_name: 'One', loyalty_points: 5 }], next: 'customers/?page=2' }
    : { results: [{ id: 2, first_name: 'Two', loyalty_points: 0 }], next: null });
  const rows = await loadCustomers();
  assert.equal(rows.length, 2);
  assert.equal(rows[0].loyalty_points, 5);
  assert.equal(rows[0].store_credit, undefined);
  assert.equal(rows[0].purchases, undefined);
});

test('customer save uses POST for create and PATCH for existing Django ID', async () => {
  const requests = [];
  api.defaults.adapter = async (config) => {
    requests.push([config.method, config.url]);
    return ok(config, { id: 42, ...JSON.parse(config.data), loyalty_points: 0 });
  };
  const created = await saveCustomer(null, { first_name: 'Ada', last_name: 'Test' });
  const edited = await saveCustomer(created.id, { first_name: 'Updated' });
  assert.deepEqual(requests, [['post', 'customers/'], ['patch', 'customers/42/']]);
  assert.equal(edited.first_name, 'Updated');
});

test('directory failures reject rather than substitute sample or empty data', async () => {
  api.defaults.adapter = async (config) => fail(config, 403);
  await assert.rejects(loadCustomers(), error => error.response.status === 403);
  await assert.rejects(loadInventory(), error => error.response.status === 403);
  api.defaults.adapter = async (config) => ok(config, { unexpected: true });
  await assert.rejects(loadCustomers(), /Unexpected response/);
});

test('customer validation errors remain available for the save dialog', async () => {
  api.defaults.adapter = async (config) => { throw new AxiosError('Bad input', 'ERR_BAD_REQUEST', config, null, { status: 400, data: { email: ['Enter a valid email address.'] } }); };
  await assert.rejects(saveCustomer(null, { email: 'invalid' }), error => {
    assert.equal(requestError(error), 'email: Enter a valid email address.');
    return true;
  });
});

test('quantity updates use inventory ID, expected stock and audit reason', async () => {
  const { updateInventoryQuantity } = await import('../src/api/directories.api.js');
  api.defaults.adapter = async (config) => {
    assert.equal(config.method, 'patch');
    assert.equal(config.url, 'inventory/91/');
    assert.deepEqual(JSON.parse(config.data), { quantity: 0, expected_quantity: 12, notes: 'Physical count' });
    return ok(config, { id: 91, product: 2, quantity: 0 });
  };
  assert.equal((await updateInventoryQuantity(91, 0, 12, 'Physical count')).quantity, 0);
});
