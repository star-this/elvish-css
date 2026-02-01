/**
 * Elvish - All Primitives
 *
 * Import this file to register all custom elements:
 *
 * <script type="module" src="./elvish.js"></script>
 *
 * Or import specific primitives:
 *
 * import { HathLayout, BauLayout } from './elvish.js';
 *
 * Primitives use Elvish names from Tolkien's Sindarin language.
 */

// Core primitives (Sindarin names with English translations)
export { default as HathLayout } from "./primitives/hath/hath.js"; // Stack
export { default as BauLayout } from "./primitives/bau/bau.js"; // Box
export { default as EnedhLayout } from "./primitives/enedh/enedh.js"; // Center (horizontal)
export { default as TiniathLayout } from "./primitives/tiniath/tiniath.js"; // Cluster
export { default as GlanVelegLayout } from "./primitives/glan-veleg/glan-veleg.js"; // Sidebar
export { default as GwistindorLayout } from "./primitives/gwistindor/gwistindor.js"; // Switcher
export { default as EsgalLayout } from "./primitives/esgal/esgal.js"; // Cover (vertical center)
export { default as VircantieLayout } from "./primitives/vircantie/vircantie.js"; // Grid
export { default as GantThalaLayout } from "./primitives/gant-thala/gant-thala.js"; // Frame (aspect)
export { default as GlanThollLayout } from "./primitives/glan-tholl/glan-tholl.js"; // Reel (side-scrolling)
export { default as FanoLayout } from "./primitives/fano/fano.js"; // Imposter (overlay)
export { default as ThannLayout } from "./primitives/thann/thann.js"; // Icon
export { default as AdleithianLayout } from "./primitives/adleithian/adleithian.js"; // Container

// Extended primitives
export { default as HimLayout } from "./primitives/him/him.js"; // Sticky
export { default as MiriantLayout } from "./primitives/miriant/miriant.js"; // Grid-placed
export { default as GonathLayout } from "./primitives/gonath/gonath.js"; // Masonry

// Version info
export const VERSION = "2.0.0";

// Primitives reference (Sindarin → English)
export const PRIMITIVES = {
  // Core
  "i-hath": "Stacked",
  "i-bau": "Quad",
  "i-enedh": "Centered (horizontal)",
  "i-tiniath": "Clustered",
  "i-glan-veleg": "Sidebar",
  "i-gwistindor": "Switching",
  "i-esgal": "Covering (vertical center)",
  "i-vircantie": "Grid",
  "i-gant-thala": "Aspect (ratio)",
  "i-glan-tholl": "Side-Scrolling",
  "i-fano": "Overcast",
  "i-thann": "Icon",
  "i-adleithian": "Container",
  "i-him": "Sticky",
  "i-miriant": "Grid-placed",
  "i-gonath": "Masonry",
};

// Sindarin vocabulary reference
export const SINDARIN = {
  hath: "a row, rank, series",
  bau: "box, container",
  enedh: "middle, center",
  tiniath: "small things, cluster of sparks",
  "glan-veleg": "clear/open + mighty/great",
  gwistindor: "change-watcher",
  esgal: "screen, hiding, cover",
  vircantie: "jewel-pattern (grid)",
  "gant-thala": "harp-foot (ratio/proportion)",
  "glan-tholl": "clear/open + hollow (scrolling)",
  fano: "white phantom, cloud (overlay)",
  thann: "sign, token (icon)",
  adleithian: "releaser, liberator (container)",
  him: "steadfast, abiding (sticky)",
  miriant: "jewel-work (explicit placement)",
  gonath: "the stone collection (masonry)",
  // Attribute names (i-thann)
  echuiol: "awakening (active)",
  dhoren: "hidden, secret",
};
