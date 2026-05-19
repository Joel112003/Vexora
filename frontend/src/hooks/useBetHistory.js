import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";

export const useBetHistory = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["balance", user?.id],
    enabled: !!user,

    queryFn: async () => {
      const response = await api.get("/v3/user/bets");
      return response.data.data.bets;
    },
    staleTime: 30000,
  });
};
