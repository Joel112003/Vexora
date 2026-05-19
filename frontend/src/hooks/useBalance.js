import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import api from "../api/axios";

export const useBalance = () => {
  const { user, updateBalance } = useAuthStore();

  return useQuery({
    queryKey: ["balance", user?.id],
    enabled: !!user,

    queryFn: async () => {
      const response = await api.get("/v3/user/balance");
      const balance = response.data.data.balance;

      updateBalance(balance);
      return balance;
    },
    refetchInterval: 10000,
  });
};
