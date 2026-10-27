export const site = {
  name: 'Sakti Pujo Edi',
  shortName: 'Sakti',
  role: 'Full-stack developer',
  description: 'Sakti Pujo Edi is a full-stack developer building thoughtful web experiences and practical business software. Explore Navia ERP and get in touch.',
  github: 'https://github.com/Sapeiidw',
  githubHandle: '@Sapeiidw',
  // Add a public email here to enable the email contact button.
  email: '',
  // Set to your final HTTPS domain before deploying for canonical/social URLs.
  url: '',
};

export const project = {
  title: 'Navia ERP',
  category: 'Business software',
  status: 'In development',
  description: 'Bringing sales, purchasing, inventory, and finance into one connected workflow.',
  detail: 'An enterprise resource planning system built around a clear flow: business transactions feed inventory, and inventory feeds finance. The aim is to make complex operations easier to follow, with consistent data across modules.',
  stack: ['React', 'TypeScript', 'Elysia', 'PostgreSQL'],
  areas: [
    { title: 'Connected workflows', description: 'Sales and purchasing connect to inventory and finance, keeping each part of the business in context.' },
    { title: 'Type-safe foundations', description: 'A React frontend and Elysia backend share typed API contracts through Eden Treaty.' },
    { title: 'Clear data ownership', description: 'Inventory tracks quantities, finance tracks value, and role-based access controls who can do what.' },
  ],
};

export interface PortfolioProject {
  id: string;
  number: string;
  title: string;
  category: string;
  status: string;
  demo: boolean;
  image: string;
  imageAlt: string;
  description: string;
  detail: string;
  screenLines: string[];
  tags: string[];
}

export const projects: PortfolioProject[] = [
  {
    id: 'navia', number: '01', title: 'Navia ERP', category: 'Business software', status: 'In development', demo: false,
    image: '/images/navia.svg', imageAlt: 'An illustrative Navia interface study with connected business modules.',
    description: project.description, detail: project.detail,
    screenLines: ['Connected operations.', 'Clearer decisions.', 'One thoughtful workspace.'], tags: project.stack,
  },
  {
    id: 'orbit', number: '02', title: 'Orbit', category: 'Interactive experience', status: 'Demo concept', demo: true,
    image: '/images/orbit.webp', imageAlt: 'A glowing ring between rock monoliths above a still mountain lake.',
    description: 'A small exploration of impossible landscapes, quiet motion, and a sense of discovery.',
    detail: 'A fictional portfolio study for an immersive digital world. The concept pairs cinematic landscapes with restrained typography and a scroll-led journey. Created as a visual direction, with no client or commercial launch attached.',
    screenLines: ['A world worth exploring.', 'Light, landscape,', 'and a little imagination.'], tags: ['Art direction', 'Spatial design', 'Motion concept'],
  },
  {
    id: 'verdant', number: '03', title: 'Verdant', category: 'Architecture & hospitality', status: 'Demo concept', demo: true,
    image: '/images/verdant.webp', imageAlt: 'A warm timber cabin tucked into a misty green forest.',
    description: 'An unhurried digital escape for a fictional collection of forest hideaways.',
    detail: 'A fictional retreat website concept built around atmosphere and a calm browsing rhythm. Architecture, landscape, and generous editorial space set the direction. This is a demonstration project, not a real booking service or commissioned client project.',
    screenLines: ['A little closer to nature.', 'Spaces to slow down.', 'Room to breathe.'], tags: ['Editorial design', 'Travel concept', 'Visual storytelling'],
  },
  {
    id: 'forma', number: '04', title: 'Forma', category: 'Product & commerce', status: 'Demo concept', demo: true,
    image: '/images/forma.webp', imageAlt: 'Cream and cognac headphones on a travertine plinth in warm sunlight.',
    description: 'A tactile product story for a fictional audio brand, made to feel as good as it sounds.',
    detail: 'A fictional commerce concept exploring how material, light, and product detail can shape a digital shopping experience. The artwork and brand are portfolio demonstrations. No products are offered for sale.',
    screenLines: ['Sound, beautifully made.', 'Considered materials.', 'Every detail matters.'], tags: ['Product storytelling', 'Commerce concept', 'Art direction'],
  },
];
