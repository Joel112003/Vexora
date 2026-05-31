import { useMutation } from "@tanstack/react-query";

import api from "../api/axios.js";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => api.post("/v1/auth/login", credentials),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data) => api.post("/v1/auth/register", data),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => api.post("/v1/auth/logout"),
  });
};
