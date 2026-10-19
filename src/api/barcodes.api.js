import api from "./axios";
import ENDPOINTS from "./endpoints";

export const barcodesApi = {
  getProductBarcode: async (productId) => {
    const response = await api.get(
      ENDPOINTS.BARCODES.PRODUCT(productId),
      {
        responseType: "blob",
      }
    );

    return response.data;
  },

  downloadProductBarcode: async (productId) => {
    const response = await api.get(
      ENDPOINTS.BARCODES.PRODUCT(productId),
      {
        responseType: "blob",
      }
    );

    const url = URL.createObjectURL(response.data);

    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = `barcode-${productId}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      URL.revokeObjectURL(url);
    }
  },
};