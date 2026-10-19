import { useEffect, useState } from "react";
import { requestError } from "@/api/directories.api";

export function useRemoteData(load) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal).then((result) => {
      if (!controller.signal.aborted) setData(result);
    }).catch((failure) => {
      if (!controller.signal.aborted) setError(requestError(failure, "Unable to load data."));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [load, attempt]);

  function reload() {
    setLoading(true);
    setError("");
    setAttempt((value) => value + 1);
  }

  return { data, setData, loading, error, reload };
}
