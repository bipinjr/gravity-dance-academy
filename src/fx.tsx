import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

/** Gold dust rising like the particles in the logo's dancer. Canvas, pauses off-screen. */
export function GoldDust({ density = 70 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const c = ref.current!;
    if (reduce) return;
    const ctx = c.getContext('2d')!;
    let w = 0, h = 0, raf = 0, visible = true;
    const dpr = Math.min(devicePixelRatio, 2);
    const resize = () => { w = c.offsetWidth; h = c.offsetHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const n = innerWidth < 640 ? density / 2 : density;
    const ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + .3, s: Math.random() * .5 + .15, d: Math.random() * Math.PI * 2, a: Math.random() * .6 + .2 }));
    const tick = () => {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        for (const p of ps) {
          p.y -= p.s; p.d += .012; p.x += Math.sin(p.d) * .35;
          if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
          ctx.globalAlpha = p.a * (0.5 + 0.5 * Math.sin(p.d * 2));
          ctx.fillStyle = p.r > 1.5 ? '#fff3c4' : '#e3b04b';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    addEventListener('resize', resize);
    tick();
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', resize); };
  }, [density, reduce]);
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}

/** Element that leans toward the pointer. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="inline-block"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/** Fade + rise on scroll into view. */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Headline that rises word by word from behind a mask. */
export function SplitWords({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotate: 6 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function CountUp({ to, decimals = 0, delay = 0 }: { to: number; decimals?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, delay, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, to, delay]);
  return <span ref={ref}>{v.toFixed(decimals)}</span>;
}

/** Opening curtain: logo flares, gold curtains part. Skipped for reduced motion. */
export function Intro() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (reduce) return setDone(true);
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => { setDone(true); document.documentElement.style.overflow = ''; }, 2100);
    return () => { clearTimeout(t); document.documentElement.style.overflow = ''; };
  }, [reduce]);
  if (done) return null;
  const ease = [0.76, 0, 0.24, 1] as const;
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" aria-hidden>
      {[0, 1].map((side) => (
        <motion.div
          key={side}
          className="absolute top-0 h-full w-1/2 bg-stage"
          style={{ left: side ? '50%' : 0, backgroundImage: 'repeating-linear-gradient(90deg, #120f0a 0 18px, #0a0907 18px 40px)' }}
          initial={{ x: 0 }}
          animate={{ x: side ? '100%' : '-100%' }}
          transition={{ delay: 1.35, duration: 0.8, ease }}
        >
          <div className={`absolute top-0 h-full w-[2px] bg-gold/70 ${side ? 'left-0' : 'right-0'}`} />
        </motion.div>
      ))}
      <motion.div
        className="absolute inset-0 grid place-items-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.2, duration: 0.3 }}
      >
        <motion.img
          src="/images/gravity/logo-320.webp"
          alt=""
          className="size-40 rounded-full shadow-[0_0_80px_rgb(227_176_75/0.5)]"
          initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </div>
  );
}

/** Gold ring that trails the mouse (desktop only). */
export function Cursor() {
  const x = useSpring(-100, { stiffness: 500, damping: 40 });
  const y = useSpring(-100, { stiffness: 500, damping: 40 });
  const [big, setBig] = useState(false);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return;
    setOn(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      setBig(!!(e.target as HTMLElement).closest('a,button,[data-cursor]'));
    };
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  }, [x, y]);
  if (!on) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-hi mix-blend-difference"
      style={{ x, y }}
      animate={{ width: big ? 56 : 18, height: big ? 56 : 18, backgroundColor: big ? 'rgba(247,217,139,.15)' : 'rgba(247,217,139,0)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    />
  );
}
