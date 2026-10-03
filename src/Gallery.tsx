import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from 'motion/react';
import { IMAGES } from './data';
import { SplitWords } from './fx';

type Item = { kind: 'photo'; img: { src: string; srcSet: string }; alt: string; caption: string; w: string }
  | { kind: 'slot'; label: string; video?: boolean; videoSrc?: string; w: string };

// Real academy photos first; slots are placeholders for performance photos/videos.
const ITEMS: Item[] = [
  { kind: 'photo', img: IMAGES.stageShow, alt: 'Gravity students performing on a big stage under orange spotlights', caption: 'Bangle Bangari, live on stage at Lulu Mall', w: 'md:w-[48vw]' },
  { kind: 'photo', img: IMAGES.solo, alt: 'A Gravity dancer holding a graceful low pose in the studio', caption: 'Dance Karnataka Dance — Round 2', w: 'md:w-[22vw]' },
  { kind: 'photo', img: IMAGES.kgf, alt: 'Gravity dancers in the KGF stage act with red lights and smoke', caption: 'KGF stage act, choreographed by Shekar Master', w: 'md:w-[44vw]' },
  { kind: 'photo', img: IMAGES.kids, alt: 'Kids in yellow T-shirts dancing together in the studio', caption: 'Kids batch in full swing', w: 'md:w-[40vw]' },
  { kind: 'photo', img: IMAGES.hebbal, alt: 'Students cheering with Shekar Master at the Hebbal branch opening', caption: 'Opening day at our Hebbal branch', w: 'md:w-[40vw]' },
  { kind: 'photo', img: IMAGES.family, alt: 'Gravity students, families and teachers together at the studio opening pooja, with gold and black balloons', caption: 'The Gravity family at our studio opening', w: 'md:w-[44vw]' },
  { kind: 'photo', img: IMAGES.classroom, alt: 'A Gravity class rehearsing a routine in the studio', caption: 'Every routine starts in class', w: 'md:w-[38vw]' },
];

/** Video that only fetches once it scrolls near view. */
function LazyVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const near = useInView(ref, { once: true, margin: '300px' });
  return <video ref={ref} src={near ? src : undefined} preload="none" controls playsInline className="h-full w-full object-cover" />;
}

function Card({ item, i, open }: { item: Item; i: number; open: (i: number) => void }) {
  const tall = i % 2 === 0;
  const base = `group relative shrink-0 snap-center overflow-hidden rounded-[28px] border border-line bg-raised w-[82vw] ${item.w} ${tall ? 'h-[62vh] md:h-[54vh]' : 'h-[52vh] md:h-[44vh] md:self-end'}`;
  if (item.kind === 'photo') {
    return (
      <motion.button layoutId={`g-${i}`} onClick={() => open(i)} className={base} data-cursor aria-label={`Open photo: ${item.caption}`}>
        <img {...item.img} sizes="(min-width:768px) 46vw, 82vw" alt={item.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-stage/90 via-transparent to-transparent" />
        <p className="absolute bottom-5 left-5 right-5 translate-y-2 text-left text-lg font-semibold opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {item.caption}
        </p>
      </motion.button>
    );
  }
  return (
    <div className={base}>
      {item.videoSrc ? <LazyVideo src={item.videoSrc} /> : (
        <>
          {/* spotlight cone */}
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_-10%,transparent_160deg,rgb(247_217_139/0.22)_180deg,transparent_200deg)] transition-opacity duration-700 group-hover:opacity-100 md:opacity-60" />
          <div className="absolute bottom-0 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-[50%] bg-gold/15 blur-2xl" />
          <div className="relative flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="grid size-16 place-items-center rounded-full border border-gold/50 text-gold-hi transition-transform duration-500 group-hover:scale-110">
              {item.video ? '▶' : '✦'}
            </span>
            <p className="text-xl font-bold">{item.label}</p>
            <span className="placeholder-tag">[replace with Gravity performance {item.video ? 'videos' : 'photos'}]</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function Gallery() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [desk, setDesk] = useState(false);
  const [openI, setOpenI] = useState<number | null>(null);

  useLayoutEffect(() => {
    const mq = matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const measure = () => {
      setDesk(mq.matches);
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - innerWidth));
    };
    measure();
    addEventListener('resize', measure);
    mq.addEventListener('change', measure);
    return () => { removeEventListener('resize', measure); mq.removeEventListener('change', measure); };
  }, []);

  useEffect(() => {
    if (openI === null) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpenI(null);
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [openI]);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -dist]), { stiffness: 120, damping: 30, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opened = openI !== null ? ITEMS[openI] : null;

  return (
    <section id="performances" ref={wrap} className="relative" style={desk ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className={desk ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden' : 'py-24'}>
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-6 px-4 md:mb-10 md:px-8">
          <div>
            <p className="font-script text-3xl text-gold">Performances</p>
            <h2 className="text-4xl font-extrabold leading-none tracking-tight md:text-6xl">
              <SplitWords text="The stage is where" /> <br className="hidden md:block" />
              <SplitWords text="they grow." className="foil" delay={0.3} />
            </h2>
          </div>
          <p className="hidden max-w-xs text-mute md:block">
            Malls, functions, big stages and TV shows. Every student gets a chance to perform.
          </p>
        </div>

        <motion.div
          ref={track}
          style={desk ? { x } : undefined}
          className={`flex gap-5 px-4 md:gap-8 md:px-8 ${desk ? '' : 'no-scrollbar snap-x snap-mandatory overflow-x-auto pb-4'}`}
        >
          {ITEMS.map((it, i) => <Card key={i} item={it} i={i} open={setOpenI} />)}
          <div className="flex w-[70vw] shrink-0 items-center md:w-[30vw]">
            <a href="#enrol" className="group text-3xl font-extrabold leading-tight md:text-5xl">
              Your child <br />could be <span className="foil">next.</span>
              <span className="mt-4 block text-base font-semibold text-gold-hi transition-transform group-hover:translate-x-2">Book a trial class →</span>
            </a>
          </div>
        </motion.div>

        {desk && (
          <div className="mx-auto mt-10 h-[2px] w-full max-w-7xl px-8">
            <div className="h-full bg-line"><motion.div className="h-full bg-gold" style={{ width: bar }} /></div>
          </div>
        )}
        {!desk && <p className="mt-2 px-4 text-sm text-mute">Swipe to see more →</p>}
      </div>

      <AnimatePresence>
        {opened?.kind === 'photo' && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-stage/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpenI(null)}
            role="dialog" aria-modal="true" aria-label={opened.caption}
          >
            <motion.img layoutId={`g-${openI}`} src={opened.img.src} alt={opened.alt} className="max-h-[85vh] max-w-full rounded-3xl object-contain" />
            <button autoFocus className="absolute right-5 top-5 rounded-full border border-chalk/30 px-4 py-2 text-sm" onClick={() => setOpenI(null)}>Close ✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
