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

    // No polling — balance is updated optimistically via updateBalance()
    // on every mutation's onSuccess, and invalidateQueries triggers a
    // single fresh fetch only when needed.
    staleTime:          30 * 1000,   // treat cached value as fresh for 30 s
    gcTime:             5  * 60 * 1000, // keep in cache for 5 min
    refetchOnWindowFocus: false,     // don't refetch when tab regains focus
    retry:              1,           // only 1 retry on failure (not 3)
  });
};
