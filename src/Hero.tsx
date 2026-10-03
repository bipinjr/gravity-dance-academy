import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { GoldDust, Magnetic, CountUp } from './fx';
import { IMAGES, RATING, REVIEWS, TEL, TRIAL_MSG, waLink } from './data';

const ease = [0.16, 1, 0.3, 1] as const;
const up = (d: number) => ({ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: 2 + d, ease } });

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const wordX = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Spotlight follows the pointer; drifts on its own until the first move.
  const mx = useSpring(useMotionValue(60), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(35), { stiffness: 60, damping: 20 });
  const mask = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(10,9,7,0) 0px, rgba(10,9,7,.55) 260px, rgba(10,9,7,.92) 620px)`;

  return (
    <section
      ref={ref}
      id="top"
      className="grain relative flex min-h-[100svh] items-end overflow-hidden pb-28 pt-28 md:items-center md:pb-16"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      {/* [Hero video slot] Swap this <img> for: <video autoPlay muted loop playsInline preload="none" poster=...> with a Gravity performance clip */}
      <motion.img
        {...IMAGES.studio}
        sizes="100vw"
        alt="Inside the Gravity Dance Academy studio: mirrored walls, gold floor lights and a polished dance floor"
        className="absolute inset-0 h-[120%] w-full object-cover"
        style={{ y: bgY }}
        initial={{ scale: 1.25 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.8, ease }}
        fetchPriority="high"
      />
      <motion.div className="absolute inset-0" style={{ background: mask }} />
      <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/40 to-transparent" />
      <GoldDust />

      {/* giant outline wordmark drifting behind */}
      <motion.div
        aria-hidden
        style={{ x: wordX }}
        className="outline-text pointer-events-none absolute -left-4 top-[14%] whitespace-nowrap text-[28vw] font-extrabold leading-none tracking-tighter md:top-[8%] md:text-[22vw]"
      >
        GRAVITY GRAVITY
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.p {...up(0)} className="font-script text-3xl text-gold-hi md:text-4xl">
          We give you wings to fly
        </motion.p>

        <h1 className="mt-3 max-w-4xl text-[2.9rem] font-extrabold leading-[0.95] tracking-tight sm:text-6xl md:text-[5.6rem]">
          {['Dance classes', 'that build', 'confidence on stage.'].map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={`block ${i === 2 ? 'foil' : ''}`}
                initial={{ y: '105%', skewY: 6 }}
                animate={{ y: 0, skewY: 0 }}
                transition={{ duration: 1.1, delay: 1.7 + i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p {...up(0.3)} className="mt-5 max-w-xl text-lg text-chalk/80 md:text-xl">
          In Rajajinagar, right behind Mahakavi Kuvempu Road Metro Station. Kids, teens and adults welcome.
        </motion.p>

        <motion.div {...up(0.45)} className="mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <a
              href={waLink(TRIAL_MSG)}
              target="_blank"
              rel="noopener"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-7 py-4 text-base font-bold text-stage shadow-[0_10px_40px_-10px_rgb(227_176_75/0.8)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold-hi transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative">Book a trial class</span>
              <span className="relative transition-transform group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a href={TEL} className="inline-flex items-center gap-2 rounded-full border border-chalk/30 px-7 py-4 font-semibold backdrop-blur-sm transition-colors hover:border-gold hover:text-gold-hi">
              Call now
            </a>
          </Magnetic>
        </motion.div>

        <motion.a
          {...up(0.6)}
          href="#parents"
          className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-gold/25 bg-stage/60 px-4 py-3 backdrop-blur-md transition-colors hover:border-gold/60"
        >
          <span className="text-3xl font-extrabold text-gold-hi">
            <CountUp to={RATING} decimals={1} delay={2.4} />
          </span>
          <span className="leading-tight">
            <span className="block text-gold tracking-widest" aria-hidden>★★★★★</span>
            <span className="block text-sm text-chalk/75">{REVIEWS} Google reviews</span>
          </span>
        </motion.a>
      </motion.div>

      {/* scroll cue */}
      <motion.div {...up(0.9)} className="absolute bottom-6 right-6 hidden items-center gap-3 text-sm text-chalk/60 md:flex">
        <span>Scroll to the stage</span>
        <span className="relative h-10 w-[1px] overflow-hidden bg-chalk/20">
          <motion.span className="absolute left-0 top-0 h-1/2 w-full bg-gold" animate={{ y: ['-100%', '200%'] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
        </span>
      </motion.div>
    </section>
  );
}
