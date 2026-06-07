import { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient }               from '@tanstack/react-query';
import { useAuthStore }                              from '../store/authStore';
import api                                           from '../api/axios';
import socket                                        from '../socket/socket';

export const useCrash = () => {
  const queryClient             = useQueryClient();
  const { user, updateBalance } = useAuthStore();

  // ─── Game state ───────────────────────────────────────────────
  const [phase,       setPhase]       = useState('waiting');
  const [multiplier,  setMultiplier]  = useState(1.00);
  const [crashPoint,  setCrashPoint]  = useState(null);
  const [countdown,   setCountdown]   = useState(5);
  const [connected,   setConnected]   = useState(false);
  const [myBet,       setMyBet]       = useState(null);   // { betAmount, autoCashout }
  const [cashedOut,   setCashedOut]   = useState(null);   // { multiplier, payout }
  const [history,     setHistory]     = useState([]);     // last 10 crash points
  const [message,     setMessage]     = useState('');

  // ref so socket handlers always see latest state without stale closures
  const phaseRef = useRef(phase);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // ─── Socket connection ────────────────────────────────────────
  useEffect(() => {
    // connect when component mounts
    socket.connect();

    socket.on('connect', () => {
      setConnected(true);
      setMessage('');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      setMessage('Disconnected — reconnecting...');
    });

    // sync state when we first connect or reconnect
    socket.on('crash:state', ({ phase, multiplier }) => {
      setPhase(phase);
      setMultiplier(multiplier);
    });

    // new round starting — countdown begins
    socket.on('crash:waiting', ({ countdown }) => {
      setPhase('waiting');
      setMultiplier(1.00);
      setCrashPoint(null);
      setMyBet(null);
      setCashedOut(null);
      setCountdown(countdown);
      setMessage('Place your bets!');
    });

    // round started — multiplier climbing
    socket.on('crash:start', () => {
      setPhase('running');
      setMessage('');
    });

    // multiplier update every 100ms
    socket.on('crash:tick', ({ multiplier }) => {
      setMultiplier(multiplier);
    });

    // game crashed
    socket.on('crash:crashed', ({ crashPoint }) => {
      setPhase('crashed');
      setCrashPoint(crashPoint);
      setMessage(`Crashed at ${crashPoint}x`);
      // add to history
      setHistory((prev) => [crashPoint, ...prev].slice(0, 10));
    });

    // auto cashout triggered for this user
    socket.on(`crash:autocashout:${user?.id}`, ({ multiplier, payout }) => {
      setCashedOut({ multiplier, payout });
      updateBalance(prev => prev + payout);
      queryClient.invalidateQueries({ queryKey: ['balance', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['betHistory', user?.id] });
    });

    // cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('crash:state');
      socket.off('crash:waiting');
      socket.off('crash:start');
      socket.off('crash:tick');
      socket.off('crash:crashed');
      socket.off(`crash:autocashout:${user?.id}`);
      socket.disconnect();
    };
  }, [user?.id]);

  // ─── Place bet ────────────────────────────────────────────────
  const {
    mutate:    placeBetMutate,
    isPending: placingBet,
  } = useMutation({
    mutationFn: (data) => api.post('/games/crash/bet', data),

    onSuccess: (_, variables) => {
      setMyBet(variables);
      setMessage('Bet placed! Good luck.');
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || 'Failed to place bet');
    },
  });

  // ─── Cashout ─────────────────────────────────────────────────
  const {
    mutate:    cashoutMutate,
    isPending: cashingOut,
  } = useMutation({
    mutationFn: () => api.post('/games/crash/cashout'),

    onSuccess: (res) => {
      const { multiplier, payout, balance } = res.data.data;
      setCashedOut({ multiplier, payout });
      updateBalance(balance);
      queryClient.invalidateQueries({ queryKey: ['balance', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['betHistory', user?.id] });
      setMessage(`Cashed out at ${multiplier}x — +${payout} coins!`);
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || 'Cashout failed');
    },
  });

  const placeBet = useCallback((data) => {
    if (phase !== 'waiting') return;
    placeBetMutate(data);
  }, [phase, placeBetMutate]);

  const cashout = useCallback(() => {
    if (phase !== 'running' || cashedOut) return;
    cashoutMutate();
  }, [phase, cashedOut, cashoutMutate]);

  return {
    phase,
    multiplier,
    crashPoint,
    countdown,
    connected,
    myBet,
    cashedOut,
    history,
    message,
    placeBet,
    cashout,
    placingBet,
    cashingOut,
  };
};