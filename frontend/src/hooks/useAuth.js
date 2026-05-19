import { useMutation } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => api.post("/v1/auth/login", credentials),

    onSuccess: (response) => {
      const { accessToken, user } = response.data.data;
      setAuth(user, accessToken);
      navigate("/");
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => api.post("/v1/auth/register", data),

    onsuccess: (response) => {
      const { accessToken, user } = response.data.data;
      setAuth(user, accessToken);
      navigate("/");
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => api.post("/v1/auth/logout"),

    onSuccess: () => {
      logout();
      navigate("/");
    },

    onError: () => {
      logout();
      navigate("/");
    },
  });
};
