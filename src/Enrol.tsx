import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { STYLES, waLink } from './data';
import { Reveal, SplitWords } from './fx';

const BATCH_OPTS = ['Morning', 'Evening', 'Weekend'] as const;
type F = { student: string; age: string; parent: string; phone: string; style: string; batch: string; note: string };
const empty: F = { student: '', age: '', parent: '', phone: '', style: '', batch: '', note: '' };

export function validate(f: F) {
  const e: Partial<Record<keyof F, string>> = {};
  const age = Number(f.age);
  if (!f.student.trim()) e.student = 'Please enter the student’s name.';
  if (!f.age || !Number.isInteger(age) || age < 3 || age > 80) e.age = 'Please enter an age between 3 and 80.';
  if (age < 18 && !f.parent.trim()) e.parent = 'Parent name is needed for students under 18.';
  if (!/^(\+?91)?[6-9]\d{9}$/.test(f.phone.replace(/[\s-]/g, ''))) e.phone = 'Please enter a valid 10-digit mobile number.';
  if (!f.style) e.style = 'Please pick a dance style.';
  if (!f.batch) e.batch = 'Please pick a batch.';
  return e;
}

export function buildMessage(f: F) {
  const lines = [
    `Student: ${f.student.trim()}`,
    `Age: ${f.age}`,
    f.parent.trim() && `Parent: ${f.parent.trim()}`,
    `Phone: ${f.phone.trim()}`,
    `Dance style: ${f.style}`,
    `Preferred batch: ${f.batch}`,
    f.note.trim() && `Note: ${f.note.trim()}`,
  ].filter(Boolean);
  return `Hello Gravity Dance Academy! I would like to book a trial class.\n\n${lines.join('\n')}`;
}

const field = 'peer w-full rounded-2xl border border-line bg-stage/60 px-4 pb-2.5 pt-6 text-base text-chalk outline-none transition-colors placeholder-transparent focus:border-gold aria-[invalid=true]:border-signal';
const label = 'pointer-events-none absolute left-4 top-2 text-xs font-semibold text-mute transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-gold-hi';

export default function Enrol() {
  const [f, setF] = useState<F>(empty);
  const [errs, setErrs] = useState<ReturnType<typeof validate>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof F) => (e: { target: { value: string } }) => { setF({ ...f, [k]: e.target.value }); setErrs({ ...errs, [k]: undefined }); };
  const adult = Number(f.age) >= 18;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = validate(f);
    setErrs(v);
    const first = Object.keys(v)[0];
    if (first) return document.getElementById(`f-${first}`)?.focus();
    window.open(waLink(buildMessage(f)), '_blank', 'noopener');
    setSent(true);
  };

  const Err = ({ k }: { k: keyof F }) => (
    <AnimatePresence>
      {errs[k] && (
        <motion.p id={`e-${k}`} role="alert" className="mt-1.5 pl-1 text-sm text-[#ff8a90]" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {errs[k]}
        </motion.p>
      )}
    </AnimatePresence>
  );
  const input = (k: keyof F, text: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <div className="relative">
        <input id={`f-${k}`} value={f[k]} onChange={set(k)} placeholder={text} aria-invalid={!!errs[k]} aria-describedby={errs[k] ? `e-${k}` : undefined} className={field} {...props} />
        <label htmlFor={`f-${k}`} className={label}>{text}</label>
      </div>
      <Err k={k} />
    </div>
  );

  return (
    <section id="enrol" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute -right-40 top-10 size-[520px] rounded-full bg-gold/10 blur-[120px]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-[1fr_1.1fr] md:px-8">
        <div>
          <p className="font-script text-3xl text-gold">Your first class</p>
          <h2 className="text-4xl font-extrabold leading-none tracking-tight md:text-6xl">
            <SplitWords text="Book a trial class." />
          </h2>
          <p className="mt-5 max-w-md text-lg text-chalk/75">Fill this in and we’ll open WhatsApp with your details ready. Just press send.</p>
          <ol className="mt-10 space-y-6">
            {['Send your details on WhatsApp', 'We reply with a batch and time that suits you', 'Come in for your trial class'].map((s, i) => (
              <Reveal key={s} delay={i * 0.1}>
                <li className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/40 font-bold text-gold-hi">{i + 1}</span>
                  <span className="text-lg">{s}</span>
                </li>
              </Reveal>
            ))}
          </ol>
          <p className="mt-6"><span className="placeholder-tag">[confirm trial class process and fee with owner]</span></p>
        </div>

        <Reveal>
          <form onSubmit={submit} noValidate className="relative rounded-[32px] border border-line bg-raised/80 p-5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] backdrop-blur md:p-8">
            <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
              {input('student', 'Student name', { autoComplete: 'name' })}
              {input('age', 'Age', { inputMode: 'numeric', type: 'number', min: 3, max: 80 })}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {input('parent', adult ? 'Parent name (optional)' : 'Parent name')}
              {input('phone', 'Phone / WhatsApp', { type: 'tel', inputMode: 'tel', autoComplete: 'tel' })}
            </div>

            <div className="mt-4">
              <div className="relative">
                <select id="f-style" value={f.style} onChange={set('style')} aria-invalid={!!errs.style} aria-describedby={errs.style ? 'e-style' : undefined} className={`${field} appearance-none ${f.style ? '' : 'text-mute'}`}>
                  <option value="" disabled>Choose a style</option>
                  {STYLES.map((s) => <option key={s.name}>{s.name}</option>)}
                  <option>Not sure yet</option>
                </select>
                <label htmlFor="f-style" className="pointer-events-none absolute left-4 top-2 text-xs font-semibold text-mute">Dance style</label>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gold" aria-hidden>▾</span>
              </div>
              <Err k="style" />
            </div>

            <fieldset className="mt-5" aria-describedby={errs.batch ? 'e-batch' : undefined}>
              <legend className="mb-2 pl-1 text-sm font-semibold text-mute">Preferred batch</legend>
              <div className="grid grid-cols-3 gap-2">
                {BATCH_OPTS.map((b) => (
                  <label key={b} className="relative cursor-pointer">
                    <input type="radio" name="batch" value={b} checked={f.batch === b} onChange={set('batch')} id={b === 'Morning' ? 'f-batch' : undefined} className="peer sr-only" />
                    <span className="block rounded-2xl border border-line py-3 text-center font-semibold transition-all peer-checked:border-gold peer-checked:bg-gold peer-checked:text-stage peer-focus-visible:outline-2 peer-focus-visible:outline-gold-hi">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
              <Err k="batch" />
            </fieldset>

            <div className="relative mt-4">
              <textarea id="f-note" rows={3} value={f.note} onChange={set('note')} placeholder="Anything we should know?" className={`${field} resize-none`} />
              <label htmlFor="f-note" className={label}>Anything we should know? (optional)</label>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gold py-4 text-lg font-bold text-stage">
              <span className="absolute inset-0 -translate-x-full bg-gold-hi transition-transform duration-500 group-hover:translate-x-0" />
              <WaIcon className="relative size-5" />
              <span className="relative">Send on WhatsApp</span>
            </motion.button>
            <AnimatePresence>
              {sent && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 text-center text-sm text-gold-hi" role="status">
                  WhatsApp opened with your details. Press send there, and we’ll reply soon.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function WaIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2C18.1 1.3 15.2.1 12 .1 5.5.1.1 5.4.1 12c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.6c1.7.9 3.7 1.4 5.7 1.4 6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.5-8.3z" />
    </svg>
  );
}
