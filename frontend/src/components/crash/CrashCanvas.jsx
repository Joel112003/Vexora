import { useRef, useEffect, useCallback } from 'react';

/**
 * CrashCanvas
 * Draws the exponential crash curve on a <canvas>.
 * The plane SVG rides along the tip of the curve.
 *
 * Props:
 *   phase      — 'waiting' | 'running' | 'crashed'
 *   multiplier — current live multiplier (float)
 *   crashPoint — final crash value (float | null)
 */

// Map a multiplier value to a 0→1 progress along the curve
const multToProgress = (mult) => {
  // logarithmic scale so low values spread out, high values compress
  const capped = Math.min(mult, 50);
  return Math.log(capped) / Math.log(50);
};

// Given progress [0,1] and canvas dims, return {x, y} pixel position
const curvePoint = (progress, W, H) => {
  const PAD_L = 52;
  const PAD_B = 44;
  const PAD_T = 32;
  const PAD_R = 24;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const x = PAD_L + progress * plotW;
  // exponential lift — starts shallow, rises steeply
  const y = (PAD_T + plotH) - Math.pow(progress, 1.6) * plotH;
  return { x, y };
};

// Derivative angle of curve at progress point (for plane rotation)
const curveAngle = (progress, W, H) => {
  const eps = 0.005;
  const p1 = curvePoint(Math.max(0, progress - eps), W, H);
  const p2 = curvePoint(Math.min(1, progress + eps), W, H);
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
};

const GRID_COLOR   = 'rgba(255,255,255,0.035)';
const AXIS_COLOR   = 'rgba(255,255,255,0.08)';
const CURVE_COLOR  = '#10b981';
const CRASH_COLOR  = '#ef4444';
const GLOW_COLOR   = 'rgba(16,185,129,0.25)';
const CRASH_GLOW   = 'rgba(239,68,68,0.25)';

const CrashCanvas = ({ phase, multiplier, crashPoint }) => {
  const canvasRef = useRef(null);
  const planeRef  = useRef(null);
  const rafRef    = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // ── Grid lines ──────────────────────────────────────────────────────
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    const cols = 8, rows = 5;
    for (let i = 0; i <= cols; i++) {
      const x = (i / cols) * W;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let i = 0; i <= rows; i++) {
      const y = (i / rows) * H;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // ── Axis labels ─────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    const PAD_L = 52, PAD_B = 44;
    const mults = [1, 2, 5, 10, 25, 50];
    mults.forEach(m => {
      const p = multToProgress(m);
      const pt = curvePoint(p, W, H);
      ctx.fillText(`${m}×`, PAD_L - 6, pt.y + 3);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.beginPath(); ctx.moveTo(PAD_L, pt.y); ctx.lineTo(W - 24, pt.y); ctx.stroke();
      ctx.setLineDash([]);
    });

    if (phase === 'waiting') {
      // Just show the axis, no curve
      const planeEl = planeRef.current;
      if (planeEl) planeEl.style.opacity = '0';
      return;
    }

    const isCrashed  = phase === 'crashed';
    const curMult    = isCrashed ? (crashPoint ?? multiplier) : multiplier;
    const progress   = multToProgress(Math.max(1, curMult));
    const curveColor = isCrashed ? CRASH_COLOR : CURVE_COLOR;
    const glowColor  = isCrashed ? CRASH_GLOW  : GLOW_COLOR;

    // ── Draw filled area under curve ─────────────────────────────────────
    const startPt = curvePoint(0, W, H);
    ctx.beginPath();
    ctx.moveTo(startPt.x, startPt.y);

    const steps = 80;
    for (let i = 1; i <= steps; i++) {
      const t = (i / steps) * progress;
      const pt = curvePoint(t, W, H);
      ctx.lineTo(pt.x, pt.y);
    }

    const endPt = curvePoint(progress, W, H);
    ctx.lineTo(endPt.x, H - PAD_B);
    ctx.lineTo(startPt.x, H - PAD_B);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,   isCrashed ? 'rgba(239,68,68,0.18)'  : 'rgba(16,185,129,0.18)');
    grad.addColorStop(0.6, isCrashed ? 'rgba(239,68,68,0.06)'  : 'rgba(16,185,129,0.06)');
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // ── Draw curve line with glow ─────────────────────────────────────────
    ctx.shadowColor  = glowColor;
    ctx.shadowBlur   = 18;
    ctx.strokeStyle  = curveColor;
    ctx.lineWidth    = 2.5;
    ctx.lineCap      = 'round';
    ctx.lineJoin     = 'round';
    ctx.beginPath();
    ctx.moveTo(startPt.x, startPt.y);
    for (let i = 1; i <= steps; i++) {
      const t = (i / steps) * progress;
      const pt = curvePoint(t, W, H);
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // ── Plane position ────────────────────────────────────────────────────
    const planePt  = curvePoint(progress, W, H);
    const angle    = curveAngle(progress, W, H);
    const planeEl  = planeRef.current;
    if (planeEl) {
      planeEl.style.opacity    = '1';
      planeEl.style.left       = `${planePt.x}px`;
      planeEl.style.top        = `${planePt.y}px`;
      planeEl.style.transform  = `translate(-50%, -50%) rotate(${angle}deg)`;
      planeEl.style.filter     = isCrashed
        ? 'drop-shadow(0 0 12px rgba(239,68,68,0.9))'
        : 'drop-shadow(0 0 12px rgba(16,185,129,0.8))';
    }
  }, [phase, multiplier, crashPoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width  = rect.width;
      canvas.height = rect.height;
      draw();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (phase === 'running') {
      const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
      rafRef.current = requestAnimationFrame(loop);
    } else {
      draw();
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, multiplier, crashPoint, draw]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Plane SVG — absolutely positioned over canvas */}
      <div
        ref={planeRef}
        className="absolute pointer-events-none z-10 transition-[filter] duration-300"
        style={{ opacity: 0, transition: 'opacity 0.3s, filter 0.3s' }}
      >
        {phase === 'crashed' ? (
          /* Explosion on crash */
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <text x="0" y="40" fontSize="40">💥</text>
          </svg>
        ) : (
          /* Plane SVG */
          <svg width="52" height="28" viewBox="0 0 52 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Fuselage */}
            <path d="M2 14 L38 7 L50 14 L38 21 Z" fill="#e4e4e7" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
            {/* Wing */}
            <path d="M16 14 L28 4 L34 8 L22 14 Z" fill="#a1a1aa" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <path d="M16 14 L28 24 L34 20 L22 14 Z" fill="#a1a1aa" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            {/* Tail */}
            <path d="M4 14 L10 9 L13 11 L10 14 Z" fill="#71717a"/>
            <path d="M4 14 L10 19 L13 17 L10 14 Z" fill="#71717a"/>
            {/* Window strip */}
            <ellipse cx="36" cy="12" rx="4" ry="2" fill="rgba(16,185,129,0.7)"/>
            {/* Engine glow trail */}
            <path d="M2 14 L-8 12 L-16 14 L-8 16 Z" fill="url(#thrustGrad)" opacity="0.8"/>
            <defs>
              <linearGradient id="thrustGrad" x1="-16" y1="14" x2="2" y2="14" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(16,185,129,0)" />
                <stop offset="60%" stopColor="rgba(16,185,129,0.5)" />
                <stop offset="100%" stopColor="rgba(251,191,36,0.8)" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
    </div>
  );
};

export default CrashCanvas;