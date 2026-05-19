import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";

export const useTopup = () => {
  const queryClient = useQueryClient();
  const { user, updateBalance } = useAuthStore();

  return useMutation({
    mutationFn: () => api.post("/v3/user/top-up"),
    onSuccess: (response) => {
      const { balance } = response.data.data;
      updateBalance(balance);

      queryClient.invalidateQueries({ queryKey: ["balance", user?.id] });
    },
  });
};
