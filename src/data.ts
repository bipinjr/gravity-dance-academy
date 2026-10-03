// Business facts — from PRD section 1 only. Anything in [brackets] is a placeholder to confirm with the owner.
export const PHONE_DISPLAY = '+91 88677 64826';
export const TEL = 'tel:+918867764826';
export const WA = 'https://wa.me/918867764826';
export const waLink = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;
export const TRIAL_MSG = 'Hello Gravity Dance Academy! I would like to book a trial class.';

export const RATING = 4.9;
export const REVIEWS = 312;

export const ADDRESS =
  'Ground Floor, 2930, 15, 2nd Cross Rd, near Mahakavi Kuvempu Road, D-Block, 2nd Stage, Rajajinagar, Bengaluru, Karnataka 560010';
export const LANDMARK = 'Behind Mahakavi Kuvempu Road Metro Station';
const MAP_Q = 'Gravity Dance Academy, 2nd Cross Rd, D-Block, 2nd Stage, Rajajinagar, Bengaluru 560010';
export const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAP_Q)}&output=embed`;
export const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_Q)}`;

const img = (name: string) => ({
  src: `/images/gravity/${name}-1280.webp`,
  srcSet: `/images/gravity/${name}-640.webp 640w, /images/gravity/${name}-1280.webp 1280w`,
});
export const IMAGES = {
  studio: img('studio'),
  family: img('inauguration'),
  storefront: img('storefront'),
  shekar: img('shekar'),
  stageShow: img('stage-show'),
  kgf: img('kgf-stage'),
  kids: img('kids-class'),
  hebbal: img('hebbal-opening'),
  solo: img('dkd-solo'),
  classroom: img('studio-class'),
  logo: '/images/gravity/logo-320.webp',
};

// From the academy's Instagram bio + studio signboard.
export const STYLES = [
  { name: 'Western dance', line: 'Hip-hop, freestyle and film-song routines.', who: 'Kids · Teens · Adults' },
  { name: 'Bharatanatyam', line: 'Classical grace, rhythm and expression.', who: 'Kids · Teens · Adults' },
  { name: 'Gymnastics', line: 'Flips, flexibility and strength.', who: 'Kids · Teens' },
  { name: 'Zumba fitness', line: 'Dance workouts that feel like a party.', who: 'Adults' },
  { name: 'Personal training', line: 'One-on-one coaching at your pace.', who: 'All ages' },
  { name: 'TV show prep', line: 'Routines and coaching for TV dance shows.', who: 'Teens · Adults' },
];

export const BATCHES = {
  Kids: { ages: '[Add age range]', rows: ['Weekday evenings', 'Saturday', 'Sunday'] },
  Teens: { ages: '[Add age range]', rows: ['Weekday evenings', 'Weekend'] },
  Adults: { ages: '[Add age range]', rows: ['Early morning', 'Late evening', 'Weekend'] },
} as const;

export const THEMES = [
  { title: 'Stage confidence', text: 'Parents say their children now perform on any stage without fear.' },
  { title: 'Choreography they love', text: 'Shekar Master and his team are named again and again for their teaching and routines.' },
  { title: 'Real chances to perform', text: 'Students get to perform at functions and shows — a real platform to show their talent.' },
];
