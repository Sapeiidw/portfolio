import { projects, type PortfolioProject } from "./site";
export type RealmKind =
  | "gate"
  | "citadel"
  | "orbit"
  | "forest"
  | "forge"
  | "tide"
  | "sky"
  | "craft"
  | "return";
export interface Chapter {
  id: string;
  label: string;
  realm: string;
  kind: RealmKind;
  position: [number, number, number];
  camera: [number, number, number];
  color: string;
  project?: PortfolioProject;
}
export const journeyProjects: PortfolioProject[] = [
  ...projects,
  {
    id: "tidal",
    number: "05",
    title: "Tidal",
    category: "Ocean intelligence",
    status: "Demo concept",
    demo: true,
    image: "/images/tidal.svg",
    imageAlt:
      "Tidal ocean dashboard with a coastline map, wave readings, and a marine forecast.",
    description:
      "A clearer view of a world in motion. Ocean conditions, mapped into a calm, useful interface.",
    detail:
      "A fictional marine dashboard that explores live conditions, location discovery, and forecast visualisation. The interface uses sample readings; it is a portfolio concept, not a navigation or weather service.",
    screenLines: ["Read the water.", "Find your rhythm.", "Follow the tide."],
    tags: ["React", "Map interfaces", "Data visualisation"],
  },
  {
    id: "aether",
    number: "06",
    title: "Aether",
    category: "Knowledge & collaboration",
    status: "Demo concept",
    demo: true,
    image: "/images/aether.svg",
    imageAlt:
      "Aether knowledge workspace with a constellation of connected notes and an editorial reading panel.",
    description:
      "A home for wandering ideas. A connected workspace that turns scattered thoughts into shared understanding.",
    detail:
      "A fictional knowledge platform combining linked notes, a visual graph, and focused reading. It explores how a team might organise research and find connections. All workspaces, notes, and collaborators shown are sample content.",
    screenLines: [
      "Let ideas travel.",
      "Find the connection.",
      "Build understanding.",
    ],
    tags: ["TypeScript", "Knowledge graph", "Workspace design"],
  },
];
export const chapters: Chapter[] = [
  {
    id: "home",
    label: "The beginning",
    realm: "The threshold",
    kind: "gate",
    position: [0, 0, 0],
    camera: [7, 5.2, 15],
    color: "#eac88f",
  },
  {
    id: "navia",
    label: "Navia ERP",
    realm: "The clockwork citadel",
    kind: "citadel",
    position: [8, 1, -38],
    camera: [6, 4.8, 14],
    color: "#eac88f",
    project: journeyProjects[0],
  },
  {
    id: "orbit",
    label: "Orbit",
    realm: "The celestial observatory",
    kind: "orbit",
    position: [-7, 3, -76],
    camera: [-5.5, 5, 15],
    color: "#c2d3e5",
    project: journeyProjects[1],
  },
  {
    id: "verdant",
    label: "Verdant",
    realm: "The emerald sanctuary",
    kind: "forest",
    position: [5, -1, -114],
    camera: [6, 4.5, 14],
    color: "#afc797",
    project: journeyProjects[2],
  },
  {
    id: "forma",
    label: "Forma",
    realm: "The artisan’s forge",
    kind: "forge",
    position: [-6, 1, -152],
    camera: [-5, 4.5, 14],
    color: "#e6b68e",
    project: journeyProjects[3],
  },
  {
    id: "tidal",
    label: "Tidal",
    realm: "The wandering coast",
    kind: "tide",
    position: [7, -2, -190],
    camera: [6, 6, 15],
    color: "#9ecfce",
    project: journeyProjects[4],
  },
  {
    id: "aether",
    label: "Aether",
    realm: "The skybound archive",
    kind: "sky",
    position: [-5, 4, -228],
    camera: [-6, 5.5, 16],
    color: "#e4cba3",
    project: journeyProjects[5],
  },
  {
    id: "craft",
    label: "The craft",
    realm: "The maker’s refuge",
    kind: "craft",
    position: [3, 1, -266],
    camera: [5, 4.7, 14],
    color: "#eac88f",
  },
  {
    id: "contact",
    label: "The next chapter",
    realm: "An open horizon",
    kind: "return",
    position: [0, 3, -304],
    camera: [4, 4.5, 15],
    color: "#eac88f",
  },
];
export const projectNotes: Record<string, [string, string, string]> = {
  navia: [
    "Connected sales, purchasing, inventory, and finance.",
    "Typed contracts between a React interface and Elysia API.",
    "PostgreSQL data with clear ownership across modules.",
  ],
  orbit: [
    "A cinematic landscape with a scroll-led narrative.",
    "Spatial navigation and a responsive exploration interface.",
    "A study in light, scale, and deliberate interaction.",
  ],
  verdant: [
    "Editorial storytelling for a fictional forest retreat.",
    "A proposed stay-discovery and booking flow.",
    "Natural imagery, quiet typography, and generous space.",
  ],
  forma: [
    "A material-focused product presentation.",
    "A proposed product configurator and shopping flow.",
    "A visual identity built around considered sound.",
  ],
  tidal: [
    "Sample marine readings in a scannable dashboard.",
    "A proposed map, saved locations, and forecast timeline.",
    "Data visualisation that puts context before numbers.",
  ],
  aether: [
    "A proposed graph of linked notes and collections.",
    "Focused writing alongside connected research.",
    "Sample collaboration and workspace navigation.",
  ],
};
