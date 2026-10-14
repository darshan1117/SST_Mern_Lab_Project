const API_BASE =
  import.meta.env.VITE_API_URL || "https://shoppingkartbackend.vercel.app";

export const getApiUrl = (endpoint) => {
  if (!API_BASE) return endpoint;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE.replace(/\/$/, "")}${cleanEndpoint}`;
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const token = localStorage.getItem("shopkart_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: "include"
  };

  return fetch(url, config);
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("shopkart_token", token);
  } else {
    localStorage.removeItem("shopkart_token");
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("shopkart_token");
};
