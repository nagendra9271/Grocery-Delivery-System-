import { useState } from "react";
import axios from "axios";

const useApi = (baseURL) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, endpoint, data = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method,
        url: `${baseURL}${endpoint}`,
        data,
        ...config,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Something went wrong!";
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};

export default useApi;
