import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore }                from '../store/authStore';
import api                             from '../api/axios';

export const useDice = () => {
  const queryClient             = useQueryClient();
  const { user, updateBalance } = useAuthStore();

  return useMutation({
    mutationFn: (data) => api.post('/v2/games/dice', data),

    onSuccess: (response) => {
      const { balance } = response.data.data;
      updateBalance(balance);
      queryClient.invalidateQueries({ queryKey: ['balance', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['betHistory', user?.id] });
    },
  });
};

export const useCoinflip = () => {
  const queryClient             = useQueryClient();
  const { user, updateBalance } = useAuthStore();

  return useMutation({
    mutationFn: (data) => api.post('/v2/games/coinflip', data),

    onSuccess: (response) => {
      const { balance } = response.data.data;
      updateBalance(balance);
      queryClient.invalidateQueries({ queryKey: ['balance', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['betHistory', user?.id] });
    },
  });
};

export const useMinesStart = () => {
  return useMutation({
    mutationFn: (data) => api.post('/v2/games/mines/start', data),
  });
};

export const useMinesReveal = () => {
  const queryClient             = useQueryClient();
  const { user, updateBalance } = useAuthStore();

  return useMutation({
    mutationFn: (data) => api.post('/v2/games/mines/reveal', data),

    onSuccess: (response) => {
      // only update balance if game is over (mine hit)
      if (!response.data.success && response.data.data?.balance) {
        updateBalance(response.data.data.balance);
        queryClient.invalidateQueries({ queryKey: ['balance', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['betHistory', user?.id] });
      }
    },
  });
};

export const useMinesCashout = () => {
  const queryClient             = useQueryClient();
  const { user, updateBalance } = useAuthStore();

  return useMutation({
    mutationFn: () => api.post('/v2/games/mines/cashout'),

    onSuccess: (response) => {
      const { balance } = response.data.data;
      updateBalance(balance);
      queryClient.invalidateQueries({ queryKey: ['balance', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['betHistory', user?.id] });
    },
  });
};