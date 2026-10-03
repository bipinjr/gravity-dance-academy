import { useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import Hero from './Hero';
import Gallery from './Gallery';
import Enrol, { WaIcon } from './Enrol';
import { Cursor, CountUp, Intro, Reveal, SplitWords } from './fx';
import { ADDRESS, BATCHES, DIRECTIONS, IMAGES, LANDMARK, MAP_EMBED, PHONE_DISPLAY, RATING, REVIEWS, STYLES, TEL, THEMES, TRIAL_MSG, waLink } from './data';

const NAV = [['Styles', '#styles'], ['Batches', '#batches'], ['Performances', '#performances'], ['Masters', '#masters'], ['Visit', '#visit']];

function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setSolid(v > 40));
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.header
      initial={{ y: -80 }} animate={{ y: 0 }} transition={{ delay: 2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? 'border-b border-line bg-stage/75 backdrop-blur-xl' : ''}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8" aria-label="Main">
        <a href="#top" className="flex items-center gap-3">
          <img src={IMAGES.logo} alt="Gravity Dance Academy logo" width={44} height={44} className="size-11 rounded-full ring-1 ring-gold/40" />
          <span className="leading-none">
            <span className="block text-lg font-extrabold tracking-tight">Gravity</span>
            <span className="block font-script text-base text-gold-hi">Dance Academy</span>
          </span>
        </a>
        <ul className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {NAV.map(([l, h]) => (
            <li key={h}><a href={h} className="group relative py-1 text-chalk/80 hover:text-chalk">{l}<span className="absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" /></a></li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href={TEL} className="hidden rounded-full border border-chalk/25 px-4 py-2 text-sm font-semibold hover:border-gold sm:inline-block">Call now</a>
          <a href="#enrol" className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-stage transition-colors hover:bg-gold-hi">Book a trial class</a>
        </div>
      </nav>
      <motion.div className="h-[2px] origin-left bg-gradient-to-r from-gold-lo via-gold-hi to-gold" style={{ scaleX: progress }} />
    </motion.header>
  );
}

function Marquee() {
  const words = [...STYLES.map((s) => s.name), 'Stage shows', 'Annual day'];
  const row = (cls: string) => (
    <div className={`flex w-max ${cls}`}>
      {[0, 1].map((k) => (
        <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
          {words.map((w) => (
            <span key={w} className={`flex items-center gap-8 px-4 text-4xl font-extrabold tracking-tight md:text-6xl`}>
              {w}<span className="text-2xl text-gold">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-line bg-gold py-5 text-stage md:-my-4 md:rotate-[-2deg] md:scale-105">
      {row('marquee')}
    </div>
  );
}

function Styles() {
  return (
    <section id="styles" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-script text-3xl text-gold">Dance styles</p>
          <h2 className="text-4xl font-extrabold leading-none tracking-tight md:text-6xl"><SplitWords text="Find your rhythm." /></h2>
        </div>
      </div>
      <ul className="border-t border-line">
        {STYLES.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.05}>
            <li>
              <a href="#enrol" className="group relative grid grid-cols-[2.5rem_1fr] items-center gap-x-4 overflow-hidden border-b border-line py-6 md:grid-cols-[4rem_1.2fr_1fr_10rem_2rem] md:py-8">
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
                <span className="relative text-sm font-semibold text-gold transition-colors group-hover:text-stage">0{i + 1}</span>
                <span className="relative text-3xl font-extrabold tracking-tight transition-all duration-500 group-hover:translate-x-3 group-hover:text-stage md:text-5xl">{s.name}</span>
                <span className="relative col-start-2 mt-1 text-chalk/70 transition-colors group-hover:text-stage md:col-start-auto md:mt-0">{s.line}</span>
                <span className="relative col-start-2 text-sm text-mute transition-colors group-hover:text-stage/80 md:col-start-auto">{s.who}</span>
                <span className="relative hidden text-2xl transition-all duration-500 group-hover:-rotate-45 group-hover:text-stage md:block">→</span>
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

function Batches() {
  const groups = Object.keys(BATCHES) as (keyof typeof BATCHES)[];
  const [tab, setTab] = useState<(typeof groups)[number]>('Kids');
  const g = BATCHES[tab];
  return (
    <section id="batches" className="bg-raised py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-[1fr_1.4fr] md:px-8">
        <div>
          <p className="font-script text-3xl text-gold">Batches</p>
          <h2 className="text-4xl font-extrabold leading-none tracking-tight md:text-6xl"><SplitWords text="A class for every age." /></h2>
          <p className="mt-5 max-w-sm text-lg text-chalk/70">Pick a group to see its timings. Not sure which fits? Ask us on WhatsApp.</p>
        </div>
        <div>
          <div role="tablist" aria-label="Age groups" className="inline-flex rounded-full border border-line bg-stage p-1.5">
            {groups.map((k) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`relative rounded-full px-6 py-2.5 font-semibold transition-colors ${tab === k ? 'text-stage' : 'text-chalk/70 hover:text-chalk'}`}>
                {tab === k && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="relative">{k}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} role="tabpanel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="mt-6">
              <p className="mb-3 text-sm text-mute">Ages: <span className="placeholder-tag">{g.ages}</span></p>
              <ul className="divide-y divide-line rounded-3xl border border-line bg-stage/50">
                {g.rows.map((r) => (
                  <li key={r} className="flex flex-wrap items-center justify-between gap-2 px-5 py-5">
                    <span className="text-lg font-semibold">{r}</span>
                    <span className="placeholder-tag">[Add batch timings]</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Masters() {
  const team = ['Team member', 'Team member', 'Team member'];
  return (
    <section id="masters" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <p className="font-script text-3xl text-gold">Meet the masters</p>
      <h2 className="mb-12 text-4xl font-extrabold leading-none tracking-tight md:text-6xl"><SplitWords text="The people behind the moves." /></h2>
      <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <article className="group relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-[32px] border border-gold/30 bg-raised p-7">
            <img {...IMAGES.shekar} sizes="(min-width:768px) 55vw, 92vw" loading="lazy" alt="Shekar Master, founder and choreographer of Gravity Dance Academy" className="absolute inset-0 h-full w-full object-cover object-[65%_30%] transition-transform duration-[1.2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/50 to-transparent" />
            <div className="relative">
              <h3 className="text-4xl font-extrabold">Shekar Master</h3>
              <p className="text-gold-hi">Founder & choreographer</p>
              <p className="mt-3 max-w-md text-chalk/70">Parents name Shekar Master and his team again and again in their reviews. <span className="placeholder-tag">[add bio]</span></p>
            </div>
          </article>
        </Reveal>
        <div className="grid gap-5">
          {team.map((t, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <article className="flex items-center gap-5 rounded-[28px] border border-line bg-raised p-5 transition-colors hover:border-gold/50">
                <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-stage text-2xl text-gold" aria-hidden>✦</div>
                <div>
                  <h3 className="text-xl font-bold">{t} <span className="placeholder-tag">[add name]</span></h3>
                  <p className="mt-1 text-sm text-mute">Style & bio <span className="placeholder-tag">[add bio]</span></p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Parents() {
  return (
    <section id="parents" className="relative overflow-hidden bg-raised py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="font-script text-3xl text-gold">What parents say</p>
          <div className="mt-2 flex items-end gap-4">
            <span className="foil text-8xl font-extrabold leading-none md:text-9xl"><CountUp to={RATING} decimals={1} /></span>
            <span className="pb-3">
              <span className="flex text-2xl text-gold" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}>★</motion.span>
                ))}
              </span>
              <span className="text-mute">from {REVIEWS} Google reviews</span>
            </span>
          </div>
          <p className="mt-6"><span className="placeholder-tag">[replace with real testimonials, with permission]</span></p>
        </div>
        <div className="space-y-5">
          {THEMES.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.1}>
              <figure className="relative rounded-[28px] border border-line bg-stage p-7 md:p-9">
                <span className="absolute -top-5 left-7 font-script text-7xl leading-none text-gold" aria-hidden>“</span>
                <figcaption className="text-sm font-semibold text-gold-hi">{t.title}</figcaption>
                <blockquote className="mt-2 text-2xl font-semibold leading-snug md:text-3xl">{t.text}</blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section id="visit" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <p className="font-script text-3xl text-gold">Visit us</p>
      <h2 className="text-4xl font-extrabold leading-none tracking-tight md:text-6xl"><SplitWords text="Right behind the metro." /></h2>
      <div className="mt-12 grid gap-5 md:grid-cols-[1fr_1.2fr]">
        <Reveal className="flex flex-col gap-5">
          <div className="rounded-[28px] border border-gold/40 bg-gold/10 p-6">
            <p className="flex items-center gap-3 text-xl font-bold text-gold-hi"><span className="grid size-9 place-items-center rounded-full bg-gold text-sm text-stage" aria-hidden>M</span>{LANDMARK}</p>
            <p className="mt-3 text-chalk/80">{ADDRESS}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={DIRECTIONS} target="_blank" rel="noopener" className="rounded-full bg-gold px-5 py-3 font-bold text-stage hover:bg-gold-hi">Get directions</a>
              <a href={TEL} className="rounded-full border border-chalk/30 px-5 py-3 font-semibold hover:border-gold">Call {PHONE_DISPLAY}</a>
            </div>
          </div>
          <figure className="relative overflow-hidden rounded-[28px] border border-line">
            <img {...IMAGES.storefront} sizes="(min-width:768px) 40vw, 92vw" loading="lazy" alt="Gravity dance studio signboard and entrance on 2nd Cross Road, Rajajinagar" className="aspect-[4/3] w-full object-cover object-[50%_35%]" />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-stage/80 px-3 py-1 text-sm backdrop-blur">Look for this signboard</figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.15}>
          <iframe
            title="Map showing Gravity Dance Academy, Rajajinagar"
            src={MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[420px] w-full rounded-[28px] border border-line md:h-full md:min-h-[560px] [filter:grayscale(1)_invert(.92)_contrast(.9)_sepia(.25)]"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pb-28 pt-16 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="foil text-[19vw] font-extrabold leading-[0.85] tracking-tighter md:text-[12rem]">Gravity</p>
        <p className="font-script text-3xl text-gold-hi">We give you wings to fly</p>
        <div className="mt-10 grid gap-6 text-chalk/75 md:grid-cols-3">
          <div><p className="font-bold text-chalk">Gravity Dance Academy</p><p className="mt-1 text-sm">{ADDRESS}</p></div>
          <div><p className="font-bold text-chalk">Call or WhatsApp</p><a href={TEL} className="mt-1 block hover:text-gold-hi">{PHONE_DISPLAY}</a></div>
          <div><p className="font-bold text-chalk">Branches</p><p className="mt-1 text-sm">Branch 1: Rajajinagar · Branch 2: Hebbal</p></div>
        </div>
        <p className="mt-12 border-t border-line pt-6 text-xs text-mute">Demo preview prepared by Bipin.</p>
      </div>
    </footer>
  );
}

function MobileBar() {
  return (
    <motion.div
      initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 2.4, type: 'spring', stiffness: 200, damping: 24 }}
      className="fixed inset-x-3 bottom-3 z-50 flex gap-2 rounded-full border border-line bg-stage/85 p-1.5 shadow-2xl backdrop-blur-xl md:hidden"
    >
      <a href={waLink(TRIAL_MSG)} target="_blank" rel="noopener" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold py-3 font-bold text-stage">
        <WaIcon className="size-5" /> Book trial on WhatsApp
      </a>
      <a href={TEL} className="flex items-center gap-1.5 rounded-full border border-chalk/25 px-5 font-semibold">
        <span className="pulse-dot size-2 rounded-full bg-signal" aria-hidden /> Call
      </a>
    </motion.div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-stage">Skip to content</a>
      <Intro />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Styles />
        <Batches />
        <Gallery />
        <Masters />
        <Parents />
        <Enrol />
        <Visit />
      </main>
      <Footer />
      <MobileBar />
    </MotionConfig>
  );
}
