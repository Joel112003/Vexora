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
      // balance is updated optimistically above; no extra fetch needed
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
      queryClient.invalidateQueries({ queryKey: ['betHistory', user?.id] });
    },
  });
};

export const useMinesStart = () => {
  return useMutation({
    mutationFn: (data) => api.post('/v2/games/mines/start', data),
    onSuccess: (_response, variables) => {
      const { user, updateBalance } = useAuthStore.getState();
      if (user?.balance != null) {
        updateBalance(parseFloat((user.balance - variables.betAmount).toFixed(2)));
      }
    },
  });
};

export const useMinesReveal = () => {
  const queryClient             = useQueryClient();
  const { user, updateBalance } = useAuthStore();

  return useMutation({
    mutationFn: (data) => api.post('/v2/games/mines/reveal', data),
    onSuccess: (response) => {
      const body = response.data;
      if (body.data?.balance != null) {
        updateBalance(body.data.balance);
        // no balance invalidation — updateBalance() is sufficient per-reveal
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
      queryClient.invalidateQueries({ queryKey: ['betHistory', user?.id] });
    },
  });
};