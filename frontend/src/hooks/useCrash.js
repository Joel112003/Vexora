import { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient }               from '@tanstack/react-query';
import { useAuthStore }                              from '../store/authStore';
import api                                           from '../api/axios';
import { socket }                                    from '../socket/socket';


export const useCrash = () => {
  const queryClient             = useQueryClient();
  const { user, updateBalance } = useAuthStore();

  // ─── Game state ───────────────────────────────────────────────
  const [phase,      setPhase]      = useState('waiting');
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState(null);
  const [countdown,  setCountdown]  = useState(5);
  const [connected,  setConnected]  = useState(false);
  const [myBet,      setMyBet]      = useState(null);   // { betAmount, autoCashout }
  const [cashedOut,  setCashedOut]  = useState(null);   // { multiplier, payout }
  const [history,    setHistory]    = useState([]);     // last 10 crash points
  const [message,    setMessage]    = useState('');

  // Update ref inline during render — no extra useEffect needed
  // This means socket handlers always read the latest phase without stale closures
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // ─── Socket connection ────────────────────────────────────────
  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      setMessage('');
      // Always resync on connect/reconnect so phase is never stale
      socket.emit('crash:sync');
    };

    const onDisconnect = () => {
      setConnected(false);
      setMessage('Disconnected — reconnecting...');
    };

    // Sync state when we first connect or reconnect mid-round
    const onState = ({ phase: p, multiplier: m }) => {
      setPhase(p);
      setMultiplier(m);
    };

    // Server emits crash:waiting every second (5,4,3,2,1)
    // Only reset bet/result state on the FIRST tick of a new round
    const MAX_COUNTDOWN = 5;
    const onWaiting = ({ countdown: cd }) => {
      setPhase('waiting');
      setCountdown(cd);
      if (cd === MAX_COUNTDOWN) {
        setMultiplier(1.00);
        setCrashPoint(null);
        setMyBet(null);
        setCashedOut(null);
        setMessage('Place your bets!');
      }
    };

    const onStart = () => {
      setPhase('running');
      setCountdown(0);
      setMessage('');
    };

    const onTick = ({ multiplier: m }) => setMultiplier(m);

    const onCrashed = ({ crashPoint: cp }) => {
      setPhase('crashed');
      setCrashPoint(cp);
      setMessage(`Crashed at ${cp}x`);
      setHistory((prev) => [cp, ...prev].slice(0, 10));
    };

    const onAutoCashout = ({ multiplier: m, payout }) => {
      setCashedOut({ multiplier: m, payout });
      queryClient.invalidateQueries({ queryKey: ['balance', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['betHistory', user?.id] });
    };

    socket.on('connect',                          onConnect);
    socket.on('disconnect',                       onDisconnect);
    socket.on('crash:state',                      onState);
    socket.on('crash:waiting',                    onWaiting);
    socket.on('crash:start',                      onStart);
    socket.on('crash:tick',                       onTick);
    socket.on('crash:crashed',                    onCrashed);
    socket.on(`crash:autocashout:${user?.id}`,    onAutoCashout);

    // Connect AFTER listeners are registered so we never miss crash:state
    if (socket.connected) {
      // StrictMode remount: socket already open, manually resync
      onConnect();
      socket.emit('crash:sync');   // ask server to re-send current state
    } else {
      socket.connect();
    }

    // Cleanup: only remove listeners — never disconnect the shared singleton
    return () => {
      socket.off('connect',                       onConnect);
      socket.off('disconnect',                    onDisconnect);
      socket.off('crash:state',                   onState);
      socket.off('crash:waiting',                 onWaiting);
      socket.off('crash:start',                   onStart);
      socket.off('crash:tick',                    onTick);
      socket.off('crash:crashed',                 onCrashed);
      socket.off(`crash:autocashout:${user?.id}`, onAutoCashout);
    };
  }, [user?.id]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Place bet ────────────────────────────────────────────────
  const {
    mutate:    placeBetMutate,
    isPending: placingBet,
  } = useMutation({
    mutationFn: (data) => api.post('/v2/games/crash/bet', data),
    onSuccess: (res, variables) => {
      const newBalance = res.data?.data?.balance;
      setMyBet(variables);
      if (newBalance !== undefined) updateBalance(newBalance);
      queryClient.invalidateQueries({ queryKey: ['balance', user?.id] });
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
    mutationFn: () => api.post('/v2/games/crash/cashout'),
    onSuccess: (res) => {
      const { multiplier: m, payout, balance } = res.data.data;
      setCashedOut({ multiplier: m, payout });
      updateBalance(balance);
      queryClient.invalidateQueries({ queryKey: ['balance', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['betHistory', user?.id] });
      setMessage(`Cashed out at ${m}x — +${payout} coins!`);
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || 'Cashout failed');
    },
  });

  const placeBet = useCallback((data) => {
    if (phaseRef.current !== 'waiting') return;
    placeBetMutate(data);
  }, [placeBetMutate]);  // phaseRef is a ref — no need in deps

  const cashout = useCallback(() => {
    if (phaseRef.current !== 'running' || cashedOut) return;
    cashoutMutate();
  }, [cashedOut, cashoutMutate]);  // phaseRef is a ref — no need in deps

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