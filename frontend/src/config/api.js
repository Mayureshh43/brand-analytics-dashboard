// frontend/src/config/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint) => {
  // Handle both cases: with or without trailing slash in base URL
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${base}${path}`;
};