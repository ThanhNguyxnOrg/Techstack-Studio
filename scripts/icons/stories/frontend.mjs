// Frontend category stories: 90 bespoke animations for UI frameworks, meta-frameworks,
// styling systems, bundlers, state managers, graphics, cross-platform, and testing tools.
// Every story lives strictly inside the 6%..72% window (T = 4.8s).

import {
  pulseRing,
  packet,
  spark,
  radar,
  waveLine,
  checkFlash,
  boltFlash,
  sheen,
  guides,
  telemetryBar,
  dropIn,
  riseIn,
  slideIn,
  popIn,
  sway,
  torque,
  steer,
  heartbeat,
  nod,
  flipX,
  breathe,
} from '../motifs.mjs';

export default {
  // ── Meta-Frameworks ────────────────────────────────────────────────────────

  nextdotjs: {
    story:
      'Next.js monochrome emblem traces its circular route boundary, sweeps a crisp edge-render sheen, and flashes a server-ready spark',
    tracks: [
      {
        on: 0,
        draw: [8, 34],
        fill: [24, 38],
        width: 0.7,
        keys: {
          10: { s: 0.94, e: 'out' },
          28: { s: 1.03, e: 'settle' },
          58: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<circle cx="12" cy="12" r="10.2"/>', 40, 64, 0.34),
      spark(17.6, 6.2, 2.0, -2.0, '#FFFFFF', 46, 64),
    ],
  },

  nuxt: {
    story:
      'Nuxt emerald mountain peaks rise cleanly into place while a subtle universal-SSR pulse ring expands from the summit',
    tracks: [
      {
        on: 0,
        origin: '50% 80%',
        draw: [8, 32],
        fill: [24, 36],
        width: 0.65,
        keys: {
          10: { y: 1.8, s: 0.92, e: 'out' },
          30: { y: -0.35, s: 1.03, e: 'settle' },
          56: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#00DC82', 30, 62, { sw: 0.55 }),
      spark(12, 4.4, 0, -2.2, '#6EE7B7', 36, 56),
    ],
  },

  astro: {
    story:
      'Astro rocket hull ignites its violet thruster flame, lifts off with a zero-JS island thrust burst, and touches back down smoothly',
    groups: {
      flame: [0, 1],
      hull: 2,
    },
    tracks: [
      {
        on: 'hull',
        origin: '50% 60%',
        keys: {
          10: { y: 0.9, s: 0.96, e: 'in' },
          26: { y: -2.6, s: 1.04, e: 'out' },
          44: { y: -1.8, s: 1.02, e: 'inout' },
          60: { y: 0.25, s: 0.99, e: 'settle' },
          68: { y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'flame',
        origin: '50% 10%',
        keys: {
          10: { sy: 0.5, y: 0.4, e: 'in' },
          24: { sy: 1.35, y: -1.6, e: 'out' },
          36: { sy: 0.85, y: -1.8, e: 'inout' },
          48: { sy: 1.25, y: -1.2, e: 'inout' },
          64: { sy: 1, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      spark(8.4, 20.6, -1.6, 1.8, '#FF5D01', 18, 42),
      spark(15.6, 20.6, 1.6, 1.8, '#BC52EE', 22, 46),
    ],
  },

  remix: {
    story:
      'Remix bold R monogram and baseline slice lock in with nested-route velocity while a request packet zips along the bottom rail',
    groups: {
      letter: 0,
      base: 1,
    },
    tracks: [
      {
        on: 'letter',
        draw: [8, 32],
        fill: [24, 36],
        width: 0.7,
        keys: {
          10: { x: -1.6, e: 'out' },
          28: { x: 0.25, e: 'settle' },
          52: { x: 0, e: 'out' },
        },
      },
      {
        on: 'base',
        keys: slideIn(22, -4.2, 0),
      },
    ],
    props: [packet(3.2, 21.3, 19.6, 21.3, '#38BDF8', 34, 62, 0.95)],
  },

  gatsby: {
    story:
      'Gatsby violet G ring traces its static-site build perimeter and sweeps a crisp GraphQL content sheen across the circle',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        draw: [8, 34],
        fill: [26, 38],
        width: 0.7,
        keys: {
          12: { r: -18, s: 0.93, e: 'out' },
          36: { r: 4, s: 1.03, e: 'settle' },
          60: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<circle cx="12" cy="12" r="10.2"/>', 40, 64, 0.3),
      pulseRing(12, 12, 10.2, '#A855F7', 34, 64, { sw: 0.55 }),
    ],
  },

  quasar: {
    story:
      'Quasar cosmic turbine blades spin around the central core, radiating cross-platform build waves to web, mobile, and desktop',
    groups: {
      core: 0,
      ring: 5,
      darkBlades: [1, 2, 3],
      cyanBlades: [6, 7, 8],
    },
    tracks: [
      {
        on: 'ring',
        keys: breathe(10, 0.05),
      },
      {
        on: 'darkBlades',
        origin: [12, 12],
        keys: {
          12: { r: -28, e: 'inout' },
          44: { r: 48, e: 'settle' },
          64: { r: 0, e: 'out' },
        },
      },
      {
        on: 'cyanBlades',
        origin: [12, 12],
        keys: {
          14: { r: 28, e: 'inout' },
          46: { r: -48, e: 'settle' },
          66: { r: 0, e: 'out' },
        },
      },
      {
        on: 'core',
        keys: heartbeat(18, 0.16),
      },
    ],
    props: [pulseRing(12, 12, 10.4, '#00B4FF', 26, 62, { sw: 0.55 })],
  },

  // ── UI Frameworks ──────────────────────────────────────────────────────────

  vuedotjs: {
    story:
      'Vue.js emerald outer V and dark navy inner V unfold symmetrically in reactive harmony with a progressive pulse ring',
    groups: {
      outer: 0,
      inner: 1,
    },
    tracks: [
      {
        on: 'outer',
        origin: '50% 85%',
        draw: [8, 30],
        fill: [22, 34],
        width: 0.65,
        keys: {
          10: { y: 1.4, s: 0.92, e: 'out' },
          28: { y: -0.3, s: 1.03, e: 'settle' },
          58: { y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'inner',
        origin: '50% 25%',
        keys: dropIn(18, 2.8),
      },
    ],
    props: [pulseRing(12, 11.5, 9.5, '#42B883', 30, 62, { sw: 0.55 })],
  },

  angular: {
    story:
      'Angular faceted shield wings converge around the central A apex, gleaming with a diagonal sheen and dependency-injection pulse',
    groups: {
      base: 0,
      right: 1,
      left: 2,
      apex: 3,
    },
    tracks: [
      {
        on: 'left',
        keys: slideIn(10, -2.4, -0.8),
      },
      {
        on: 'right',
        keys: slideIn(10, 2.4, -0.8),
      },
      {
        on: 'base',
        keys: riseIn(16, 2.6),
      },
      {
        on: 'apex',
        keys: popIn(22, 0.45),
      },
    ],
    props: [
      sheen('<polygon points="12,1.5 22,5.5 20,17.5 12,22.5 4,17.5 2,5.5"/>', 42, 66, 0.3),
      pulseRing(12, 12, 9.8, '#DD0031', 34, 62, { sw: 0.55 }),
    ],
  },

  svelte: {
    story:
      'Svelte fiery orange shell and white inner S trace swiftly into place, firing a crisp zero-runtime compiler spark',
    groups: {
      shell: 0,
      inner: 1,
    },
    tracks: [
      {
        on: 'shell',
        draw: [8, 30],
        fill: [22, 34],
        width: 0.65,
        keys: {
          10: { r: -6, s: 0.94, e: 'out' },
          28: { r: 3, s: 1.04, e: 'settle' },
          56: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'inner',
        draw: [16, 38],
        fill: [30, 42],
        width: 0.6,
      },
    ],
    props: [
      spark(18.5, 4.8, 2.1, -2.0, '#FF8A4C', 32, 54),
      spark(5.4, 19.2, -2.0, 2.0, '#FDE047', 38, 60),
    ],
  },

  solid: {
    story:
      'SolidJS layered blue ribbons slide together into a fine-grained reactive prism while a signal pulse ripples across the facets',
    groups: {
      top: [0, 1],
      mid: [2, 3],
      bot: [4, 5],
    },
    tracks: [
      {
        on: 'top',
        keys: slideIn(10, 2.6, -1.6),
      },
      {
        on: 'mid',
        keys: slideIn(18, -2.4, 0),
      },
      {
        on: 'bot',
        keys: slideIn(26, 2.4, 1.6),
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#76B3E1', 36, 66, { sw: 0.55 })],
  },

  qwik: {
    story:
      'Qwik resumable Q shell powers up as its white lightning bolt strikes straight through with zero-hydration speed',
    groups: {
      dark: 0,
      purple: 2,
      bolt: 3,
    },
    tracks: [
      {
        on: 'dark',
        keys: slideIn(10, -2.0, 1.0),
      },
      {
        on: 'purple',
        keys: slideIn(14, 2.0, -1.0),
      },
      {
        on: 'bolt',
        origin: '50% 50%',
        keys: {
          18: { y: -3.2, s: 0.65, o: 0, e: 'in' },
          28: { y: 0.4, s: 1.12, o: 1, e: 'settle' },
          40: { y: 0, s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      boltFlash(17.8, 4.2, '#FDE047', 26, 52),
      pulseRing(12, 12, 10.2, '#AC7EF4', 28, 58, { sw: 0.55 }),
    ],
  },

  preact: {
    story:
      'Preact compact hexagon traces its 3kB shell while the inner twin electron orbits spin crisply at lightweight speed',
    groups: {
      orbits: 0,
      hex: 1,
    },
    tracks: [
      {
        on: 'hex',
        draw: [8, 30],
        fill: [22, 34],
        width: 0.65,
      },
      {
        on: 'orbits',
        origin: [12, 12],
        end: { r: 180 },
        keys: {
          12: { r: 0, s: 0.88, e: 'inout' },
          36: { r: 95, s: 1.06, e: 'inout' },
          62: { r: 180, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.6, '#A78BFA', 26, 56, { sw: 0.5 })],
  },

  emberdotjs: {
    story:
      'Ember.js warm terracotta badge glows with a steady heartbeat as a bright ember spark rises from the script loop',
    groups: {
      badge: 0,
      loop: 1,
    },
    tracks: [
      {
        on: 'badge',
        keys: heartbeat(12, 0.08),
      },
      {
        on: 'loop',
        keys: {
          14: { s: 0.7, r: -10, e: 'inout' },
          34: { s: 1.15, r: 8, e: 'settle' },
          58: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      spark(15.2, 5.2, 1.4, -2.4, '#FB923C', 22, 46),
      spark(9.2, 4.8, -1.2, -2.2, '#FDE047', 32, 56),
    ],
  },

  backbonedotjs: {
    story:
      'Backbone.js interlocking structural columns and cross-braces snap into place, wiring models and views with classic stability',
    groups: {
      top: [0, 1],
      sides: [2, 3],
      joints: [4, 5],
    },
    tracks: [
      {
        on: 'top',
        each: true,
        stagger: 4,
        keys: dropIn(10, 2.6),
      },
      {
        on: 'sides',
        each: true,
        stagger: 4,
        keys: riseIn(18, 2.6),
      },
      {
        on: 'joints',
        each: true,
        stagger: 4,
        keys: popIn(28, 0.4),
      },
    ],
    props: [
      guides(
        [
          [12, 2, 12, 22],
          [4, 14, 20, 14],
        ],
        '#38BDF8',
        12,
        54
      ),
    ],
  },

  marko: {
    story:
      'Marko streaming HTML chevrons glide together from opposite sides while streamed chunk packets race across the tag',
    groups: {
      left: 0,
      right: 1,
    },
    tracks: [
      {
        on: 'left',
        keys: slideIn(10, -2.8, 0),
      },
      {
        on: 'right',
        keys: slideIn(16, 2.8, 0),
      },
    ],
    props: [
      packet(4.0, 12, 20.0, 12, '#38BDF8', 28, 56, 0.9),
      packet(4.0, 12, 20.0, 12, '#F472B6', 36, 64, 0.85),
    ],
  },

  // ── Hypermedia & Web Components ────────────────────────────────────────────

  htmx: {
    story:
      'htmx HTML brackets open to receive an out-of-band server fragment while the central slash flashes with a live swap packet',
    groups: {
      slash: 0,
      rightBracket: 2,
      leftBracket: 3,
    },
    tracks: [
      {
        on: 'leftBracket',
        keys: {
          10: { x: -2.6, e: 'inout' },
          36: { x: -2.2, e: 'inout' },
          56: { x: 0.25, e: 'settle' },
          66: { x: 0, e: 'out' },
        },
      },
      {
        on: 'rightBracket',
        keys: {
          10: { x: 2.6, e: 'inout' },
          36: { x: 2.2, e: 'inout' },
          56: { x: -0.25, e: 'settle' },
          66: { x: 0, e: 'out' },
        },
      },
      {
        on: 'slash',
        keys: {
          14: { r: -12, s: 0.9, e: 'inout' },
          34: { r: 8, s: 1.08, e: 'settle' },
          56: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [packet(3.8, 12, 20.2, 12, '#60A5FA', 18, 48, 0.95)],
  },

  alpinedotjs: {
    story:
      'Alpine.js twin mountain peaks rise briskly out of crisp HTML markup with a lightweight alpine breeze sweeping over the ridge',
    groups: {
      rightPeak: 0,
      leftPeak: 1,
    },
    tracks: [
      {
        on: 'leftPeak',
        origin: '50% 80%',
        keys: riseIn(10, 2.8),
      },
      {
        on: 'rightPeak',
        origin: '50% 80%',
        keys: riseIn(18, 2.8),
      },
    ],
    props: [waveLine(18.6, '#77C1D2', 26, 64)],
  },

  lit: {
    story:
      'Lit four vertical flame-facets ignite in a left-to-right staggered wave, radiating reactive Web Component heat',
    tracks: [
      {
        on: [0, 1, 2, 3],
        order: 'x',
        stagger: 5,
        each: true,
        origin: '50% 85%',
        keys: {
          10: { y: 2.8, sy: 0.72, o: 0.25, e: 'out' },
          26: { y: -0.5, sy: 1.08, o: 1, e: 'settle' },
          40: { y: 0, sy: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(10.0, 2.8, 0.6, -2.0, '#60A5FA', 28, 52),
      spark(14.6, 5.2, 1.0, -1.8, '#38BDF8', 36, 60),
    ],
  },

  stencil: {
    story:
      'Stencil three angled compiler bars glide in from alternating edges to stamp out a clean custom-element template',
    groups: {
      bottom: 0,
      middle: 1,
      top: 2,
    },
    tracks: [
      {
        on: 'top',
        keys: slideIn(10, 3.6, 0),
      },
      {
        on: 'middle',
        keys: slideIn(18, -3.6, 0),
      },
      {
        on: 'bottom',
        keys: slideIn(26, 3.6, 0),
      },
    ],
    props: [sheen('<rect x="0.5" y="3" width="23" height="18"/>', 44, 66, 0.28)],
  },

  polymerproject: {
    story:
      'Polymer faceted P-ribbon traces its custom-element geometry and gleams with a crisp web-components sheen',
    tracks: [
      {
        on: 0,
        draw: [8, 34],
        fill: [26, 38],
        width: 0.65,
        keys: {
          12: { s: 0.94, e: 'out' },
          34: { s: 1.04, e: 'settle' },
          58: { s: 1, e: 'out' },
        },
      },
    ],
    props: [sheen('<rect x="0.5" y="4" width="23" height="16"/>', 42, 66, 0.3)],
  },

  // ── Styling & Design Systems ───────────────────────────────────────────────

  tailwindcss: {
    story:
      'Tailwind CSS twin cyan wind ribbons undulate in smooth counter-phase while subtle breeze streams sweep across the canvas',
    groups: {
      upper: 0,
      lower: 1,
    },
    tracks: [
      {
        on: 'upper',
        keys: {
          10: { x: -1.4, y: -0.45, e: 'inout' },
          28: { x: 1.6, y: 0.35, e: 'inout' },
          46: { x: -0.6, y: -0.2, e: 'inout' },
          62: { x: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'lower',
        keys: {
          14: { x: 1.4, y: 0.45, e: 'inout' },
          32: { x: -1.6, y: -0.35, e: 'inout' },
          50: { x: 0.6, y: 0.2, e: 'inout' },
          66: { x: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [waveLine(5.0, '#67E8F9', 12, 58), waveLine(19.6, '#22D3EE', 18, 64)],
  },

  sass: {
    story:
      'Sass cursive script traces its nested stylesheet flourish while the lower loop snaps into place with a rose pulse',
    groups: {
      script: 0,
      curl: 1,
    },
    tracks: [
      {
        on: 'script',
        draw: [8, 36],
        fill: [28, 40],
        width: 0.6,
      },
      {
        on: 'curl',
        keys: popIn(24, 0.35),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#F472B6', 36, 66, { sw: 0.55 })],
  },

  shadcnui: {
    story:
      'shadcn/ui twin minimalist diagonal slashes draw crisply in sequence as clean component alignment guides flash behind them',
    groups: {
      shortSlash: 0,
      longSlash: 1,
    },
    tracks: [
      {
        on: 'longSlash',
        draw: [8, 28],
        fill: [20, 32],
        width: 0.8,
        keys: slideIn(10, -1.8, 1.8),
      },
      {
        on: 'shortSlash',
        draw: [18, 38],
        fill: [30, 42],
        width: 0.8,
        keys: slideIn(20, 1.8, -1.8),
      },
    ],
    props: [
      guides(
        [
          [2, 22, 22, 2],
          [7, 22, 22, 7],
        ],
        '#94A3B8',
        12,
        56
      ),
    ],
  },

  radixui: {
    story:
      'Radix UI unstyled geometric primitives—stem, square, and dot—snap cleanly onto precision accessibility guidelines',
    groups: {
      stem: 0,
      square: 1,
      dot: 2,
    },
    tracks: [
      {
        on: 'stem',
        keys: riseIn(10, 2.8),
      },
      {
        on: 'square',
        keys: dropIn(18, 2.8),
      },
      {
        on: 'dot',
        keys: popIn(26, 0.25),
      },
    ],
    props: [
      guides(
        [
          [12, 1, 12, 23],
          [4, 8.5, 20, 8.5],
        ],
        '#38BDF8',
        10,
        56
      ),
    ],
  },

  mui: {
    story:
      'MUI five isometric Material Design facets assemble in sequence, casting a crisp elevation sheen across the M',
    tracks: [
      {
        on: [0, 1, 2, 3, 4],
        order: 'x',
        stagger: 4.5,
        each: true,
        keys: {
          10: { y: -2.8, o: 0.15, e: 'out' },
          24: { y: 0.25, o: 1, e: 'settle' },
          36: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [sheen('<rect x="1" y="3" width="22" height="18"/>', 44, 66, 0.26)],
  },

  chakraui: {
    story:
      'Chakra UI teal circle pulses with accessible focus while the central white lightning bolt strikes cleanly into center',
    groups: {
      badge: 0,
      bolt: 1,
    },
    tracks: [
      {
        on: 'badge',
        keys: heartbeat(10, 0.06),
      },
      {
        on: 'bolt',
        keys: {
          14: { y: -3.2, s: 0.6, o: 0, e: 'in' },
          26: { y: 0.35, s: 1.12, o: 1, e: 'settle' },
          38: { y: 0, s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#5EEAD4', 24, 58, { sw: 0.6 })],
  },

  antdesign: {
    story:
      'Ant Design diamond frame traces its enterprise grid while the inner blue jewel pops into focus with a refined pulse',
    groups: {
      frame: [0, 2],
      rightEdge: 4,
      core: 6,
    },
    tracks: [
      {
        on: 'frame',
        keys: slideIn(10, -2.0, 0),
      },
      {
        on: 'rightEdge',
        keys: slideIn(18, 2.2, 0),
      },
      {
        on: 'core',
        keys: popIn(26, 0.3),
      },
    ],
    props: [pulseRing(12, 12, 10.0, '#38BDF8', 32, 62, { sw: 0.55 })],
  },

  bootstrap: {
    story:
      'Bootstrap violet rounded shield drops onto a responsive column grid as the bold B monogram pops in and catches a sheen',
    groups: {
      shield: 0,
      letter: 1,
    },
    tracks: [
      {
        on: 'shield',
        keys: {
          10: { s: 0.92, e: 'out' },
          26: { s: 1.04, e: 'settle' },
          54: { s: 1, e: 'out' },
        },
      },
      {
        on: 'letter',
        keys: popIn(18, 0.45),
      },
    ],
    props: [
      guides(
        [
          [6, 2, 6, 22],
          [12, 2, 12, 22],
          [18, 2, 18, 22],
        ],
        '#A78BFA',
        10,
        48
      ),
      sheen('<rect x="1" y="3" width="22" height="18" rx="3"/>', 42, 66, 0.26),
    ],
  },

  mantine: {
    story:
      'Mantine azure circular emblem traces its smooth geometric arcs and pulses with a crisp component-hook ripple',
    tracks: [
      {
        on: 0,
        draw: [8, 34],
        fill: [26, 38],
        width: 0.65,
        keys: breathe(12, 0.06),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#74C0FC', 30, 62, { sw: 0.55 })],
  },

  daisyui: {
    story:
      'daisyUI cheerful golden flower badge blooms outward while its smiling eyes give a playful theme-switching wink',
    groups: {
      petals: 0,
      leftEye: 1,
      rightEye: 2,
      smile: 3,
    },
    tracks: [
      {
        on: 'petals',
        keys: {
          10: { s: 0.9, r: -8, e: 'out' },
          28: { s: 1.05, r: 4, e: 'settle' },
          56: { s: 1, r: 0, e: 'out' },
        },
      },
      {
        on: 'rightEye',
        keys: {
          28: { sy: 1, e: 'in' },
          35: { sy: 0.14, e: 'out' },
          44: { sy: 1, e: 'out' },
        },
      },
      {
        on: 'smile',
        keys: {
          26: { s: 0.92, e: 'inout' },
          38: { s: 1.15, e: 'settle' },
          54: { s: 1, e: 'out' },
        },
      },
    ],
    props: [spark(18.8, 5.2, 1.8, -1.8, '#FDE047', 34, 58)],
  },

  headlessui: {
    story:
      'Headless UI outer cyan frame locks in while its floating inner accessible popover shape glides smoothly into alignment',
    groups: {
      inner: 0,
      outer: 1,
    },
    tracks: [
      {
        on: 'outer',
        draw: [8, 30],
        fill: [22, 34],
        width: 0.65,
      },
      {
        on: 'inner',
        keys: {
          14: { y: -2.6, s: 0.82, o: 0.2, e: 'inout' },
          32: { y: 0.3, s: 1.06, o: 1, e: 'settle' },
          48: { y: 0, s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      guides(
        [
          [12, 2, 12, 22],
          [2, 12, 22, 12],
        ],
        '#66E3FF',
        14,
        54
      ),
    ],
  },

  styledcomponents: {
    story:
      'styled-components painted nails shimmer in a staggered CSS-in-JS wave while a rosy polish spark flashes at the fingertip',
    tracks: [
      {
        on: 'all',
        origin: '35% 75%',
        keys: {
          10: { r: -7, y: 0.6, e: 'inout' },
          28: { r: 6, y: -0.5, e: 'inout' },
          46: { r: -3, y: 0.25, e: 'inout' },
          62: { r: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      spark(20.0, 3.6, 1.8, -1.6, '#F472B6', 22, 46),
      spark(16.4, 7.0, 1.6, -1.6, '#FDE047', 34, 58),
    ],
  },

  unocss: {
    story:
      'UnoCSS three atomic geometric tiles pop into formation on-demand as minimalist utility guides snap into view',
    tracks: [
      {
        on: [2, 1, 0],
        stagger: 6,
        each: true,
        keys: popIn(10, 0.3),
      },
    ],
    props: [
      guides(
        [
          [12, 2, 12, 22],
          [2, 12, 22, 12],
        ],
        '#94A3B8',
        10,
        54
      ),
    ],
  },

  postcss: {
    story:
      'PostCSS AST emblem spins gently like a plugin transformation wheel while an orange transform pulse rings outward',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          10: { r: -14, s: 0.94, e: 'inout' },
          32: { r: 16, s: 1.04, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      radar(12, 12, 10.6, '#FB923C', 14, 64, 90),
      pulseRing(12, 12, 9.2, '#DD3A0A', 28, 60, { sw: 0.55 }),
    ],
  },

  less: {
    story:
      'Less curly braces open wide while the inner stylesheet letters slide into place and compile cleanly inward',
    groups: {
      leftBrace: 0,
      rightBrace: 1,
      letters: [4, 2, 3],
    },
    tracks: [
      {
        on: 'leftBrace',
        keys: {
          10: { x: -2.2, e: 'inout' },
          40: { x: -1.4, e: 'inout' },
          58: { x: 0, e: 'settle' },
        },
      },
      {
        on: 'rightBrace',
        keys: {
          10: { x: 2.2, e: 'inout' },
          40: { x: 1.4, e: 'inout' },
          58: { x: 0, e: 'settle' },
        },
      },
      {
        on: 'letters',
        stagger: 5,
        each: true,
        keys: dropIn(14, 2.2),
      },
    ],
    props: [sheen('<rect x="1" y="6" width="22" height="12"/>', 46, 68, 0.25)],
  },

  primevue: {
    story:
      'PrimeVue eight faceted emerald shield shards converge symmetrically around the V-crest, sealing with a crisp UI gleam',
    groups: {
      top: 0,
      upperSides: [1, 2],
      midSides: [3, 4],
      core: 5,
      feet: [6, 7],
    },
    tracks: [
      {
        on: 'top',
        keys: dropIn(10, 2.4),
      },
      {
        on: 'upperSides',
        each: true,
        stagger: 3,
        keys: popIn(14, 0.45),
      },
      {
        on: 'midSides',
        each: true,
        stagger: 3,
        keys: popIn(20, 0.45),
      },
      {
        on: 'core',
        keys: riseIn(24, 2.4),
      },
      {
        on: 'feet',
        each: true,
        stagger: 3,
        keys: riseIn(30, 2.0),
      },
    ],
    props: [pulseRing(12, 12, 10.0, '#41B883', 38, 66, { sw: 0.55 })],
  },

  primereact: {
    story:
      'PrimeReact cyan shield traces its component-suite outline and flashes a brisk diagonal sheen across the crest',
    tracks: [
      {
        on: 0,
        draw: [8, 34],
        fill: [26, 38],
        width: 0.65,
        keys: breathe(12, 0.06),
      },
    ],
    props: [
      sheen('<rect x="2" y="1" width="20" height="22"/>', 40, 64, 0.3),
      pulseRing(12, 12, 9.8, '#03C4E8', 32, 62, { sw: 0.55 }),
    ],
  },

  vuetify: {
    story:
      'Vuetify four layered azure V-wings unfold smoothly from the center like Material Design cards fanning open',
    groups: {
      rightOuter: 0,
      leftOuter: 1,
      rightInner: 2,
      leftInner: 3,
    },
    tracks: [
      {
        on: 'leftOuter',
        keys: slideIn(10, -2.6, -1.2),
      },
      {
        on: 'rightOuter',
        keys: slideIn(10, 2.6, -1.2),
      },
      {
        on: 'leftInner',
        keys: dropIn(18, 2.6),
      },
      {
        on: 'rightInner',
        keys: dropIn(22, 2.6),
      },
    ],
    props: [sheen('<polygon points="2,2 22,2 12,22"/>', 42, 66, 0.28)],
  },

  bulma: {
    story:
      'Bulma turquoise isometric B ribbon traces its clean Flexbox geometry and settles with a crisp upward bounce',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        fill: [24, 36],
        width: 0.65,
        keys: {
          10: { y: 1.8, s: 0.94, e: 'out' },
          30: { y: -0.4, s: 1.04, e: 'settle' },
          54: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [sheen('<rect x="4" y="1" width="16" height="22"/>', 40, 64, 0.28)],
  },

  stylelint: {
    story:
      'Stylelint linter brackets frame the stylesheet as three vertical rule-check dots scan down the column and pass green',
    groups: {
      leftWing: [0, 2],
      rightWing: [1, 3],
      knot: 4,
      dots: [5, 6, 7],
    },
    tracks: [
      {
        on: 'leftWing',
        keys: slideIn(10, -1.8, 0),
      },
      {
        on: 'rightWing',
        keys: slideIn(10, 1.8, 0),
      },
      {
        on: 'knot',
        keys: popIn(16, 0.4),
      },
      {
        on: 'dots',
        order: 'y',
        stagger: 5,
        each: true,
        keys: {
          18: { s: 0.35, o: 0.2, e: 'in' },
          28: { s: 1.3, o: 1, e: 'settle' },
          38: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [checkFlash(16.8, 4.8, '#86EFAC', 42, 66)],
  },

  // ── Build & Bundlers ───────────────────────────────────────────────────────

  vite: {
    story:
      'Vite electric violet bolt strikes downward with instant dev-server startup while a hot-module-replacement ring flashes outward',
    tracks: [
      {
        on: 'all',
        origin: '50% 50%',
        keys: {
          10: { y: -2.2, s: 0.9, r: -6, e: 'in' },
          22: { y: 0.4, s: 1.08, r: 4, e: 'settle' },
          36: { y: -0.2, s: 0.98, r: -1, e: 'inout' },
          52: { y: 0, s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#A855F7', 20, 54, { sw: 0.65 }),
      boltFlash(17.8, 3.8, '#FDE047', 18, 46),
      spark(5.4, 18.4, -1.8, 1.6, '#38BDF8', 24, 48),
    ],
  },

  webpack: {
    story:
      'Webpack isometric bundle cube traces its outer shell while internal dependency seams draw in and module chunks pack into the core',
    groups: {
      cube: 0,
      seams: [1, 2, 3],
    },
    tracks: [
      {
        on: 'cube',
        draw: [8, 30],
        fill: [22, 34],
        width: 0.7,
        keys: {
          10: { s: 0.93, e: 'out' },
          30: { s: 1.04, e: 'settle' },
          56: { s: 1, e: 'out' },
        },
      },
      {
        on: 'seams',
        stagger: 4,
        each: true,
        keys: {
          16: { s: 0.4, o: 0, e: 'out' },
          28: { s: 1.06, o: 1, e: 'settle' },
          40: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(3.2, 6.8, 12, 12, '#38BDF8', 26, 52, 0.85),
      packet(20.8, 6.8, 12, 12, '#7DD3FC', 30, 56, 0.85),
    ],
  },

  esbuild: {
    story:
      'esbuild blazing yellow chevron rockets forward with Go-compiled bundling speed, leaving a brief golden speed spark',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        keys: {
          10: { x: -2.4, s: 0.92, e: 'in' },
          22: { x: 1.4, s: 1.07, e: 'settle' },
          36: { x: -0.3, s: 0.99, e: 'inout' },
          52: { x: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [boltFlash(18.2, 4.4, '#FDE047', 18, 46), spark(3.6, 12, -2.0, 0, '#FACC15', 16, 40)],
  },

  rollupdotjs: {
    story:
      'Rollup twin crimson spiral ribbons unfurl and tighten together like tree-shaken ES modules rolling into one lean bundle',
    groups: {
      upper: 0,
      lower: 1,
    },
    tracks: [
      {
        on: 'upper',
        origin: [12, 12],
        keys: {
          10: { r: -16, x: -1.4, y: -1.2, e: 'inout' },
          34: { r: 4, x: 0.2, y: 0.15, e: 'settle' },
          56: { r: 0, x: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'lower',
        origin: [12, 12],
        keys: {
          14: { r: 16, x: 1.4, y: 1.2, e: 'inout' },
          38: { r: -4, x: -0.2, y: -0.15, e: 'settle' },
          60: { r: 0, x: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.0, '#F87171', 34, 64, { sw: 0.55 })],
  },

  swc: {
    story:
      'SWC golden Rust-powered transpiler emblem dashes across the frame with a rapid sheen and compiler spark',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        fill: [22, 34],
        width: 0.65,
        keys: {
          10: { x: -2.2, e: 'in' },
          26: { x: 0.8, e: 'settle' },
          46: { x: 0, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="0.5" y="7" width="23" height="10"/>', 36, 62, 0.34),
      spark(20.6, 8.2, 1.8, -1.4, '#FDE047', 26, 48),
    ],
  },

  babel: {
    story:
      'Babel golden transpiler mark tilts as next-gen syntax enters on the left and exits transformed on the right',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          10: { s: 0.94, r: -4, e: 'inout' },
          30: { s: 1.04, r: 3, e: 'settle' },
          56: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(2.4, 12, 21.6, 12, '#FDE047', 16, 48, 0.95),
      sheen('<rect x="0.5" y="7" width="23" height="10"/>', 40, 66, 0.28),
    ],
  },

  turborepo: {
    story:
      'Turborepo crimson turbine arcs accelerate around the core in a high-speed monorepo cache hit, flashing a remote-cache ring',
    groups: {
      core: 0,
      arcs: [1, 2, 3],
    },
    tracks: [
      {
        on: 'arcs',
        origin: [12, 12],
        keys: {
          10: { r: -20, e: 'in' },
          38: { r: 165, e: 'out' },
          56: { r: 182, e: 'settle' },
          66: { r: 180, e: 'out' },
        },
        end: { r: 180 },
      },
      {
        on: 'core',
        keys: heartbeat(18, 0.12),
      },
    ],
    props: [
      pulseRing(12, 12, 10.6, '#FF1E56', 24, 58, { sw: 0.6 }),
      spark(18.6, 5.4, 1.8, -1.8, '#38BDF8', 32, 56),
    ],
  },

  // ── State & Data ───────────────────────────────────────────────────────────

  redux: {
    story:
      'Redux three interlocking state loops trace into place and rotate in predictable unison as a dispatched action packet cycles the store',
    tracks: [
      {
        on: [0, 1, 2],
        stagger: 5,
        draw: [8, 28],
        width: 0.65,
      },
      {
        on: [0, 1, 2],
        origin: [12, 12.6],
        end: { r: 120 },
        keys: {
          14: { r: 0, e: 'inout' },
          62: { r: 120, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12.6, 9.6, '#A78BFA', 26, 58, { sw: 0.55 })],
  },

  tanstack: {
    story:
      'TanStack Query palm-island emblem sways gently as background cache revalidation packets sync fresh server state',
    tracks: [
      {
        on: 0,
        origin: '50% 80%',
        keys: sway(10, 5.5, 0.45),
      },
    ],
    props: [
      radar(12, 12, 10.4, '#F59E0B', 14, 62, 110),
      packet(5.2, 6.4, 18.8, 6.4, '#38BDF8', 22, 52, 0.85),
    ],
  },

  apollographql: {
    story:
      'Apollo GraphQL orbital ring spins around the central A-star as federated subgraph query packets converge on the schema',
    groups: {
      star: 0,
      ring: 1,
    },
    tracks: [
      {
        on: 'ring',
        origin: [12, 12],
        draw: [8, 32],
        fill: [24, 36],
        width: 0.65,
      },
      {
        on: 'star',
        keys: heartbeat(18, 0.12),
      },
    ],
    props: [
      radar(12, 12, 10.6, '#A8A0CD', 16, 64, 120),
      packet(18.6, 5.6, 12, 11.5, '#C4B5FD', 24, 52, 0.9),
    ],
  },

  mobx: {
    story:
      'MobX orange state halves converge around the reactive X core, syncing observable derivations with a crisp pulse',
    groups: {
      rightHalf: [0, 2, 7],
      leftHalf: [1, 4, 6],
      coreX: 5,
    },
    tracks: [
      {
        on: 'leftHalf',
        keys: slideIn(10, -2.2, 0),
      },
      {
        on: 'rightHalf',
        keys: slideIn(10, 2.2, 0),
      },
      {
        on: 'coreX',
        keys: {
          18: { s: 0.5, r: -24, e: 'in' },
          34: { s: 1.15, r: 8, e: 'settle' },
          52: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#FF9955', 30, 62, { sw: 0.55 })],
  },

  reactivex: {
    story:
      'RxJS electric-eel spiral surges forward in a fluid reactive wave as observable stream packets flow along its curve',
    groups: {
      topArc: 0,
      lowerBody: 1,
      head: 2,
    },
    tracks: [
      {
        on: 'topArc',
        keys: slideIn(10, 2.2, -1.2),
      },
      {
        on: 'lowerBody',
        keys: slideIn(16, -2.0, 1.2),
      },
      {
        on: 'head',
        keys: nod(22, 7),
      },
    ],
    props: [
      packet(4.5, 16.5, 19.2, 7.5, '#F472B6', 24, 54, 0.95),
      pulseRing(12, 12, 10.0, '#E879F9', 34, 64, { sw: 0.5 }),
    ],
  },

  xstate: {
    story:
      'XState finite-state machine arrow transitions crisply across the X-graph, locking into the target state with a confirmation pulse',
    groups: {
      branch: 0,
      main: 1,
    },
    tracks: [
      {
        on: 'main',
        draw: [8, 32],
        fill: [24, 36],
        width: 0.65,
      },
      {
        on: 'branch',
        keys: {
          18: { x: 2.4, y: -2.4, o: 0.2, e: 'in' },
          34: { x: -0.2, y: 0.2, o: 1, e: 'settle' },
          48: { x: 0, y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(6.2, 18.4, 18.0, 5.8, '#38BDF8', 28, 56, 0.95),
      pulseRing(18.0, 5.8, 2.6, '#86EFAC', 48, 68, { sw: 0.6 }),
    ],
  },

  pinia: {
    story:
      'Pinia cheerful Vue pineapple store hops joyfully, ruffles its three crown leaves, and blinks as reactive state commits',
    groups: {
      leaves: [0, 1, 2],
      body: 3,
      eyes: [4, 5],
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 85%',
        keys: {
          10: { y: 0.8, sy: 0.92, sx: 1.06, e: 'in' },
          24: { y: -1.8, sy: 1.07, sx: 0.95, e: 'out' },
          40: { y: 0.3, sy: 0.96, sx: 1.03, e: 'settle' },
          56: { y: 0, sy: 1, sx: 1, e: 'out' },
        },
      },
      {
        on: 'leaves',
        stagger: 4,
        each: true,
        origin: '50% 100%',
        keys: {
          14: { r: -10, y: -1.2, e: 'inout' },
          30: { r: 8, y: -0.4, e: 'settle' },
          46: { r: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'eyes',
        each: true,
        keys: {
          38: { sy: 1, e: 'in' },
          44: { sy: 0.14, e: 'out' },
          52: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [spark(18.2, 6.2, 1.6, -1.6, '#42B883', 28, 52)],
  },

  swr: {
    story:
      'SWR three wave-letters pulse left-to-right to serve stale cache immediately while a fresh revalidation packet glides overhead',
    tracks: [
      {
        on: [0, 1, 2],
        order: 'x',
        stagger: 6,
        each: true,
        keys: {
          10: { y: -1.8, s: 0.9, e: 'inout' },
          24: { y: 0.35, s: 1.08, e: 'settle' },
          38: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      waveLine(17.5, '#94A3B8', 16, 62),
      packet(3.0, 7.6, 21.0, 7.6, '#38BDF8', 24, 56, 0.85),
    ],
  },

  trpc: {
    story:
      'tRPC blue badge pulses as its end-to-end typesafe bridge draws between client and server and confirms with a green type check',
    groups: {
      badge: 0,
      mark: 1,
    },
    tracks: [
      {
        on: 'badge',
        keys: breathe(10, 0.05),
      },
      {
        on: 'mark',
        draw: [12, 36],
        fill: [28, 40],
        width: 0.65,
      },
    ],
    props: [
      packet(6.5, 12, 17.5, 12, '#86EFAC', 32, 58, 0.9),
      checkFlash(16.6, 5.2, '#86EFAC', 44, 68),
    ],
  },

  relay: {
    story:
      'Relay orange GraphQL conduit traces its declarative data loop while query fragments stream cleanly across the span',
    tracks: [
      {
        on: 0,
        draw: [8, 34],
        fill: [26, 38],
        width: 0.65,
      },
    ],
    props: [
      packet(3.0, 12, 21.0, 12, '#FDBA74', 24, 54, 0.95),
      pulseRing(12, 12, 9.8, '#F26B00', 36, 66, { sw: 0.55 }),
    ],
  },

  recoil: {
    story:
      'Recoil central data-flow spine anchors while upper and lower reactive atoms bounce in opposing sync',
    groups: {
      spine: 0,
      lowerAtom: 1,
      upperAtom: 2,
    },
    tracks: [
      {
        on: 'spine',
        draw: [8, 30],
        fill: [22, 34],
        width: 0.65,
      },
      {
        on: 'upperAtom',
        keys: {
          14: { x: -1.8, y: -1.4, s: 0.75, e: 'inout' },
          34: { x: 0.3, y: 0.2, s: 1.15, e: 'settle' },
          56: { x: 0, y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'lowerAtom',
        keys: {
          18: { x: 1.8, y: 1.4, s: 0.75, e: 'inout' },
          38: { x: -0.3, y: -0.2, s: 1.15, e: 'settle' },
          60: { x: 0, y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.5, '#60A5FA', 32, 62, { sw: 0.5 })],
  },

  // ── Testing & QA ───────────────────────────────────────────────────────────

  playwright: {
    story:
      'Playwright crimson tragedy and emerald comedy theatre masks sway in playful cross-browser dialogue as an E2E pass check flashes',
    groups: {
      redMask: [0, 1, 2, 8, 10, 12, 13],
      greenMask: [3, 4, 5, 6, 7, 9, 11],
    },
    tracks: [
      {
        on: 'redMask',
        origin: '60% 70%',
        keys: {
          10: { r: -9, x: -0.8, y: 0.4, e: 'inout' },
          28: { r: 6, x: 0.3, y: -0.4, e: 'inout' },
          46: { r: -4, x: -0.2, y: 0.2, e: 'inout' },
          62: { r: 0, x: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'greenMask',
        origin: '40% 70%',
        keys: {
          12: { r: 8, x: 0.8, y: -0.5, e: 'inout' },
          30: { r: -7, x: -0.3, y: 0.4, e: 'inout' },
          48: { r: 4, x: 0.2, y: -0.2, e: 'inout' },
          64: { r: 0, x: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [checkFlash(16.8, 4.4, '#86EFAC', 38, 64)],
  },

  jest: {
    story:
      'Jest crimson jester cap does a lively spring bounce as unit test assertions snap green overhead',
    tracks: [
      {
        on: 0,
        origin: '50% 80%',
        keys: {
          10: { r: -8, y: 0.6, s: 0.94, e: 'in' },
          24: { r: 7, y: -1.4, s: 1.06, e: 'settle' },
          40: { r: -3, y: 0.2, s: 0.99, e: 'inout' },
          56: { r: 0, y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      checkFlash(16.6, 4.6, '#86EFAC', 28, 56),
      spark(5.4, 5.6, -1.6, -1.6, '#FCA5A5', 22, 44),
    ],
  },

  vitest: {
    story:
      'Vitest neon-green V-bolt fires through a Vite-powered test run with instant HMR speed and a crisp pass flash',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          10: { y: -2.0, s: 0.92, e: 'in' },
          22: { y: 0.4, s: 1.08, e: 'settle' },
          38: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      boltFlash(17.8, 3.8, '#FDE047', 16, 44),
      checkFlash(4.8, 5.2, '#86EFAC', 34, 62),
      pulseRing(12, 12, 10.0, '#00FF74', 22, 54, { sw: 0.55 }),
    ],
  },

  cypress: {
    story:
      'Cypress teal test-runner arcs sweep smoothly around the Cy monogram, validating live browser assertions with a green check',
    groups: {
      cyLetters: [0, 4],
      arcs: [1, 2, 3, 5],
    },
    tracks: [
      {
        on: 'arcs',
        origin: [12, 12],
        keys: {
          10: { r: -36, s: 0.94, e: 'inout' },
          36: { r: 12, s: 1.04, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'cyLetters',
        keys: heartbeat(18, 0.08),
      },
    ],
    props: [checkFlash(16.8, 4.6, '#69D3A7', 38, 64)],
  },

  testinglibrary: {
    story:
      'Testing Library red octopus mascot gives a friendly wiggle and blinks its eyes as user-centric DOM queries pass',
    groups: {
      body: 0,
      eyes: [1, 2],
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 65%',
        keys: sway(10, 6, 0.5),
      },
      {
        on: 'eyes',
        each: true,
        keys: {
          32: { sy: 1, e: 'in' },
          38: { sy: 0.12, e: 'out' },
          46: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [checkFlash(17.0, 4.4, '#86EFAC', 38, 64)],
  },

  puppeteer: {
    story:
      'Puppeteer teal marionette crossbar tilts back and forth, pulling invisible strings that drive the headless Chromium window below',
    groups: {
      crossbar: 2,
      browser: [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    },
    tracks: [
      {
        on: 'crossbar',
        origin: '50% 50%',
        keys: {
          10: { r: -10, y: -0.5, e: 'inout' },
          28: { r: 10, y: 0.4, e: 'inout' },
          46: { r: -5, y: -0.2, e: 'inout' },
          62: { r: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'browser',
        origin: '50% 60%',
        keys: {
          14: { y: 0.8, r: -2.5, e: 'inout' },
          32: { y: -0.6, r: 2.5, e: 'inout' },
          50: { y: 0.3, r: -1, e: 'settle' },
          64: { y: 0, r: 0, e: 'out' },
        },
      },
    ],
    props: [checkFlash(17.4, 14.8, '#00D8A2', 40, 66)],
  },

  selenium: {
    story:
      'Selenium WebDriver emblem traces its automation seal while the assertion checkmark pops crisply into place',
    groups: {
      check: 0,
      badge: 1,
    },
    tracks: [
      {
        on: 'badge',
        draw: [8, 32],
        fill: [24, 36],
        width: 0.65,
      },
      {
        on: 'check',
        keys: popIn(26, 0.3),
      },
    ],
    props: [checkFlash(16.6, 4.8, '#43B02A', 36, 62)],
  },

  webdriverio: {
    story:
      'WebdriverIO orange automation ring locks around its inner robot lens, rotating with a mechanical test-suite calibration',
    groups: {
      outer: 0,
      inner: 1,
    },
    tracks: [
      {
        on: 'outer',
        origin: [12, 12],
        keys: torque(10, 18, 36),
      },
      {
        on: 'inner',
        keys: heartbeat(18, 0.14),
      },
    ],
    props: [checkFlash(17.2, 4.6, '#86EFAC', 42, 66)],
  },

  mocha: {
    story:
      'Mocha warm coffee-cup test badge rises with gentle aromatic steam wisps as asynchronous specs brew and pass',
    groups: {
      steam: [2, 3],
      badge: [0, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    },
    tracks: [
      {
        on: 'badge',
        keys: breathe(10, 0.04),
      },
      {
        on: 'steam',
        each: true,
        stagger: 5,
        keys: {
          12: { y: 1.2, o: 0.2, e: 'out' },
          30: { y: -1.4, o: 1, e: 'inout' },
          48: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [checkFlash(16.8, 4.6, '#86EFAC', 38, 64)],
  },

  jasmine: {
    story:
      'Jasmine purple BDD blossom petals unfurl radially around the center as behavior specs bloom green',
    groups: {
      ring: 0,
      petals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    tracks: [
      {
        on: 'ring',
        keys: breathe(10, 0.05),
      },
      {
        on: 'petals',
        origin: [12, 12],
        keys: {
          12: { s: 0.72, r: -18, e: 'out' },
          34: { s: 1.06, r: 6, e: 'settle' },
          58: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.4, '#C084FC', 28, 60, { sw: 0.55 })],
  },

  // ── Graphics, 3D, Data Viz, Animation & Creative Coding ───────────────────

  threedotjs: {
    story:
      'Three.js wireframe triangle mesh traces its 3D geometric subdivisions and orbits smoothly in perspective space',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        draw: [8, 34],
        fill: [26, 38],
        width: 0.65,
        keys: {
          12: { r: -14, s: 0.94, e: 'inout' },
          38: { r: 10, s: 1.04, e: 'settle' },
          62: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [radar(12, 12, 10.6, '#CBD5E1', 14, 62, 95)],
  },

  webgl: {
    story:
      'WebGL hardware-accelerated mark flips through a GPU shader pass while crimson vertices flash across the viewport',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: flipX(12),
      },
    ],
    props: [
      sheen('<rect x="1" y="6" width="22" height="12"/>', 38, 64, 0.3),
      spark(18.8, 7.2, 1.8, -1.6, '#FB7185', 26, 48),
    ],
  },

  babylondotjs: {
    story:
      'Babylon.js crimson 3D hexagon frame traces its scene-graph bounds while the inner geometric prism rotates into focus',
    groups: {
      frame: 0,
      prism: 1,
    },
    tracks: [
      {
        on: 'frame',
        draw: [8, 32],
        fill: [24, 36],
        width: 0.65,
      },
      {
        on: 'prism',
        origin: [12, 12],
        keys: {
          14: { r: -60, s: 0.65, e: 'inout' },
          38: { r: 12, s: 1.12, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#F87171', 30, 62, { sw: 0.55 })],
  },

  aframe: {
    story:
      'A-Frame WebXR crimson portal frames a stereoscopic A-frame that lifts forward in VR depth',
    groups: {
      portal: 0,
      frameA: 1,
    },
    tracks: [
      {
        on: 'portal',
        keys: breathe(10, 0.05),
      },
      {
        on: 'frameA',
        origin: '50% 75%',
        keys: {
          12: { y: 1.6, s: 0.85, e: 'out' },
          30: { y: -0.6, s: 1.08, e: 'settle' },
          54: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#FB7185', 24, 58, { sw: 0.55 })],
  },

  d3: {
    story:
      'D3.js amber D and 3 curves trace smoothly while live data-driven telemetry bars rise beneath the visualization',
    groups: {
      dPart: 0,
      threePart: 1,
    },
    tracks: [
      {
        on: 'dPart',
        draw: [8, 30],
        fill: [22, 34],
        width: 0.65,
      },
      {
        on: 'threePart',
        draw: [14, 36],
        fill: [28, 40],
        width: 0.65,
      },
    ],
    props: [
      telemetryBar(4.2, 18.0, 1.5, 4.2, '#FBBF24', 24, 58),
      telemetryBar(6.8, 16.5, 1.5, 5.7, '#F97316', 28, 62),
      telemetryBar(9.4, 17.5, 1.5, 4.7, '#FDE047', 32, 66),
    ],
  },

  chartdotjs: {
    story:
      'Chart.js hexagonal canvas frames three layered pastel area-chart series rising sequentially from the baseline',
    groups: {
      hex: 0,
      series: [1, 2, 3],
    },
    tracks: [
      {
        on: 'hex',
        draw: [8, 28],
        fill: [20, 32],
        width: 0.65,
      },
      {
        on: 'series',
        stagger: 5,
        each: true,
        origin: '50% 100%',
        keys: {
          14: { sy: 0.2, o: 0.2, e: 'out' },
          30: { sy: 1.08, o: 1, e: 'settle' },
          44: { sy: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      telemetryBar(16.6, 4.2, 1.4, 3.6, '#38BDF8', 32, 60),
      telemetryBar(18.8, 3.0, 1.4, 4.8, '#FF6384', 36, 64),
    ],
  },

  greensock: {
    story:
      'GSAP lime-green superhero emblem launches with signature elastic squash-and-stretch overshoot and snappy timeline settle',
    tracks: [
      {
        on: 0,
        origin: '50% 80%',
        keys: {
          10: { sy: 0.82, sx: 1.16, y: 1.2, e: 'in' },
          22: { sy: 1.16, sx: 0.88, y: -2.4, r: -7, e: 'out' },
          36: { sy: 0.94, sx: 1.06, y: 0.4, r: 5, e: 'settle' },
          50: { sy: 1.03, sx: 0.98, y: -0.2, r: -1.5, e: 'settle' },
          62: { sy: 1, sx: 1, y: 0, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      spark(18.4, 5.0, 2.0, -2.0, '#A3E635', 22, 46),
      pulseRing(12, 12, 9.8, '#88CE02', 24, 56, { sw: 0.55 }),
    ],
  },

  framer: {
    story:
      'Framer three cobalt geometric slices spring sequentially onto precision motion guides with tactile physics overshoot',
    groups: {
      top: 0,
      mid: 1,
      bot: 2,
    },
    tracks: [
      {
        on: 'top',
        keys: slideIn(10, 3.0, -1.2),
      },
      {
        on: 'mid',
        keys: slideIn(18, -3.0, 0),
      },
      {
        on: 'bot',
        keys: riseIn(26, 2.8),
      },
    ],
    props: [
      guides(
        [
          [4.6, 2, 4.6, 22],
          [19.4, 2, 19.4, 22],
        ],
        '#60A5FA',
        10,
        54
      ),
    ],
  },

  p5dotjs: {
    story:
      'p5.js creative-coding characters dance playfully in a staggered generative wave with magenta canvas sparks',
    tracks: [
      {
        on: [0, 4, 3, 1, 2],
        stagger: 4.5,
        each: true,
        keys: {
          10: { y: -2.2, r: -10, s: 0.88, e: 'inout' },
          24: { y: 0.4, r: 8, s: 1.08, e: 'settle' },
          38: { y: 0, r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(4.6, 5.4, -1.6, -1.6, '#F472B6', 20, 44),
      spark(19.6, 6.2, 1.6, -1.6, '#FDE047', 30, 54),
    ],
  },

  // ── Cross-Platform, Mobile & Desktop ──────────────────────────────────────

  flutter: {
    story:
      'Flutter cyan and deep-blue ribbons glide diagonally from opposite corners, folding cleanly at the joint into a 60fps cross-platform lock',
    groups: {
      topRibbon: 0,
      midRibbon: 1,
      botRibbon: 2,
      joint: 3,
    },
    tracks: [
      {
        on: 'topRibbon',
        keys: slideIn(10, -2.6, -2.2),
      },
      {
        on: 'midRibbon',
        keys: slideIn(16, 2.6, -1.4),
      },
      {
        on: 'joint',
        keys: popIn(22, 0.4),
      },
      {
        on: 'botRibbon',
        keys: slideIn(24, 2.4, 2.2),
      },
    ],
    props: [sheen('<rect x="2" y="1" width="20" height="22"/>', 44, 66, 0.28)],
  },

  reactnative: {
    story:
      'React Native nucleus pulses with a native-bridge update as its three cyan electron orbits trace and spin in fluid mobile unison',
    groups: {
      nucleus: 0,
      orbits: [1, 2, 3],
    },
    tracks: [
      {
        on: 'nucleus',
        keys: heartbeat(12, 0.18),
      },
      {
        on: 'orbits',
        stagger: 4,
        draw: [10, 32],
        width: 0.9,
      },
      {
        on: 'orbits',
        origin: [12, 12],
        end: { r: 180 },
        keys: {
          12: { r: 0, e: 'inout' },
          64: { r: 180, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 3.2, '#E0F7FF', 18, 48, { layer: 'over', s0: 0.8, s1: 2.6, sw: 0.55 }),
    ],
  },

  expo: {
    story:
      'Expo sleek chevron lifts smoothly like an over-the-air mobile preview launch, trailing a crisp launch pulse',
    tracks: [
      {
        on: 0,
        origin: '50% 80%',
        draw: [8, 32],
        fill: [24, 36],
        width: 0.65,
        keys: {
          10: { y: 2.0, s: 0.92, e: 'out' },
          30: { y: -0.6, s: 1.05, e: 'settle' },
          56: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.0, '#CBD5E1', 28, 60, { sw: 0.55 })],
  },

  electron: {
    story:
      'Electron desktop atom spins its three outer electrons around the central Chromium-Node nucleus with steady IPC rhythm',
    groups: {
      orbits: [0, 1, 2, 3, 4, 5],
      electrons: [6, 7, 8],
      nucleus: 9,
    },
    tracks: [
      {
        on: 'nucleus',
        keys: heartbeat(12, 0.22),
      },
      {
        on: 'electrons',
        origin: [12, 12],
        keys: {
          10: { r: 0, e: 'inout' },
          62: { r: 120, e: 'out' },
        },
        end: { r: 120 },
      },
      {
        on: 'orbits',
        origin: [12, 12],
        keys: breathe(12, 0.05),
      },
    ],
    props: [pulseRing(12, 12, 10.4, '#67E8F9', 26, 58, { sw: 0.5 })],
  },

  tauri: {
    story:
      'Tauri gold Rust core and cyan WebView core orbit toward each other in tight native harmony, radiating a lightweight desktop pulse',
    groups: {
      goldCore: [0, 4, 5],
      cyanCore: [2, 7],
    },
    tracks: [
      {
        on: 'goldCore',
        origin: [12, 12],
        keys: {
          10: { x: 1.6, y: -1.6, r: -14, e: 'inout' },
          36: { x: -0.2, y: 0.2, r: 4, e: 'settle' },
          58: { x: 0, y: 0, r: 0, e: 'out' },
        },
      },
      {
        on: 'cyanCore',
        origin: [12, 12],
        keys: {
          10: { x: -1.6, y: 1.6, r: -14, e: 'inout' },
          36: { x: 0.2, y: -0.2, r: 4, e: 'settle' },
          58: { x: 0, y: 0, r: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.4, '#24C8D8', 30, 62, { sw: 0.55 })],
  },

  ionic: {
    story:
      'Ionic azure outer orbit spins around the pulsing inner mobile core, broadcasting cross-platform signals',
    groups: {
      core: 0,
      orbit: 1,
    },
    tracks: [
      {
        on: 'core',
        keys: heartbeat(12, 0.16),
      },
      {
        on: 'orbit',
        origin: [12, 12],
        keys: {
          10: { r: -35, e: 'inout' },
          44: { r: 25, e: 'settle' },
          64: { r: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.4, '#60A5FA', 24, 58, { sw: 0.55 })],
  },

  capacitor: {
    story:
      'Capacitor opposing blue native-bridge plates charge up and snap tightly together, firing a crisp electrical bridge spark',
    groups: {
      lowerPlate: [0, 2, 4],
      upperPlate: [6, 8, 10],
    },
    tracks: [
      {
        on: 'lowerPlate',
        keys: slideIn(10, -2.0, 2.0),
      },
      {
        on: 'upperPlate',
        keys: slideIn(10, 2.0, -2.0),
      },
    ],
    props: [
      boltFlash(12.6, 9.0, '#FDE047', 26, 52),
      pulseRing(12, 12, 10.2, '#53B9FF', 30, 62, { sw: 0.55 }),
    ],
  },

  apachecordova: {
    story:
      'Apache Cordova hybrid-app robot head gives a confident nod and blinks its dual optical eyes while syncing a device bridge pulse',
    groups: {
      head: 0,
      eyes: [1, 2],
    },
    tracks: [
      {
        on: 'head',
        origin: '50% 70%',
        keys: nod(12, 6),
      },
      {
        on: 'eyes',
        each: true,
        keys: {
          32: { sy: 1, e: 'in' },
          38: { sy: 0.14, e: 'out' },
          46: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#94A3B8', 28, 60, { sw: 0.55 })],
  },

  nativescript: {
    story:
      'NativeScript ribbon badge traces its direct-to-native N contour and flashes a sleek azure sheen across the shield',
    tracks: [
      {
        on: 0,
        draw: [8, 34],
        fill: [26, 38],
        width: 0.65,
        keys: breathe(12, 0.05),
      },
    ],
    props: [
      sheen('<rect x="1.5" y="1.5" width="21" height="21" rx="3"/>', 40, 64, 0.3),
      pulseRing(12, 12, 10.2, '#65ADF1', 30, 62, { sw: 0.55 }),
    ],
  },

  // ── Component Workshop, DOM & Web Standards ───────────────────────────────

  storybook: {
    story:
      'Storybook magenta workshop book tilts open like an interactive component story card while a bright bookmark spark and UI sheen sweep across',
    tracks: [
      {
        on: 0,
        origin: '25% 50%',
        draw: [8, 32],
        fill: [24, 36],
        width: 0.65,
        keys: {
          10: { r: -6, sx: 0.88, e: 'inout' },
          30: { r: 3, sx: 1.04, e: 'settle' },
          56: { r: 0, sx: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="3" y="1" width="18" height="22" rx="2"/>', 38, 64, 0.3),
      spark(16.8, 3.4, 1.4, -2.0, '#FDE047', 28, 52),
    ],
  },

  jquery: {
    story:
      'jQuery three nested blue crescents ripple outward in staggered sequence like a classic DOM selector wave',
    tracks: [
      {
        on: [2, 1, 0],
        stagger: 5,
        each: true,
        origin: '75% 25%',
        keys: {
          10: { s: 0.78, o: 0.25, e: 'out' },
          26: { s: 1.08, o: 1, e: 'settle' },
          42: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [waveLine(19.6, '#38BDF8', 24, 62)],
  },

  webrtc: {
    story:
      'WebRTC peer-to-peer emblem rotates smoothly while live media-stream packets exchange across the real-time connection',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        keys: steer(10, -28, 34),
      },
    ],
    props: [
      radar(12, 12, 10.6, '#38BDF8', 12, 62, 110),
      packet(4.5, 12, 19.5, 12, '#4ADE80', 22, 52, 0.9),
    ],
  },

  svg: {
    story:
      'SVG golden vector emblem traces its resolution-independent star paths cleanly and gleams with a crisp precision sheen',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        draw: [8, 34],
        fill: [26, 38],
        width: 0.65,
        keys: {
          10: { r: -18, s: 0.92, e: 'out' },
          34: { r: 6, s: 1.04, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<circle cx="12" cy="12" r="10.4"/>', 40, 64, 0.3),
      spark(18.6, 5.4, 1.8, -1.8, '#FDE047', 34, 58),
    ],
  },

  zod: {
    story:
      'Zod faceted diamond schema traces its type-safe outline, gleams with a diagonal prism sheen, and flashes a green runtime validation check',
    tracks: [
      {
        on: 0,
        draw: [8, 34],
        fill: [26, 38],
        width: 0.65,
        keys: breathe(14, 0.05),
      },
    ],
    props: [
      sheen('<rect x="0.7" y="2.7" width="22.6" height="18.6" rx="2"/>', 34, 60, 0.3),
      checkFlash(16.8, 5.2, '#4ADE80', 40, 66),
    ],
  },

  lucide: {
    story:
      'Lucide twin interlocking SVG rings trace crisply in sequence and counter-rotate slightly like precision open-source vector strokes locking into alignment',
    groups: {
      rightRing: 0,
      leftRing: 1,
    },
    tracks: [
      {
        on: 'leftRing',
        draw: [8, 30],
        fill: [22, 34],
        width: 0.6,
        keys: slideIn(10, -1.8, 0.8),
      },
      {
        on: 'rightRing',
        draw: [14, 36],
        fill: [28, 40],
        width: 0.6,
        keys: slideIn(16, 1.8, -0.8),
      },
    ],
    props: [spark(18.5, 5.2, 1.6, -1.6, '#FCA5A5', 38, 60)],
  },

  baseui: {
    story:
      'Base UI unstyled geometric pillars snap cleanly onto accessibility alignment smart-guides like composable React primitives locking into place',
    groups: {
      right: 0,
      left: 1,
    },
    tracks: [
      { on: 'left', keys: riseIn(10, 2.8) },
      { on: 'right', keys: dropIn(18, 2.8) },
    ],
    props: [
      guides(
        [
          [12.0, 1.5, 12.0, 22.5],
          [3.5, 12.0, 20.5, 12.0],
        ],
        '#94A3B8',
        10,
        54
      ),
      checkFlash(16.8, 4.4, '#86EFAC', 42, 66),
    ],
  },

  effect: {
    story:
      'Effect type-safe pipeline arch traces its functional composition path while the lower return bar slides cleanly underneath as typed fibers complete',
    groups: {
      arch: 0,
      base: 1,
    },
    tracks: [
      {
        on: 'arch',
        draw: [8, 34],
        fill: [26, 38],
        width: 0.65,
      },
      {
        on: 'base',
        keys: slideIn(22, -2.6, 0),
      },
    ],
    props: [
      packet(4.0, 19.2, 20.0, 19.2, '#38BDF8', 28, 56, 0.9),
      pulseRing(12, 11, 9.8, '#A5B4FC', 36, 64, { layer: 'under', sw: 0.5 }),
    ],
  },

  nanostores: {
    story:
      'Nano Stores twin lightweight state arcs glide together from opposite corners while a tiny reactive signal atom pulses between them',
    groups: {
      bottom: 0,
      top: 1,
    },
    tracks: [
      { on: 'top', keys: slideIn(10, 2.2, -1.8) },
      { on: 'bottom', keys: slideIn(14, -2.2, 1.8) },
    ],
    props: [
      pulseRing(12, 12, 7.6, '#38BDF8', 26, 56, { layer: 'under', sw: 0.55 }),
      packet(6.5, 16.5, 17.5, 7.5, '#FDE047', 30, 58, 0.85),
    ],
  },

  reactrouter: {
    story:
      'React Router chevron unfolds as three route nodes pop into place sequentially and a navigation packet hops from root across the active route',
    groups: {
      chevron: 0,
      nodes: [2, 1, 3],
    },
    tracks: [
      {
        on: 'chevron',
        draw: [8, 28],
        fill: [22, 32],
        width: 0.65,
      },
      {
        on: 'nodes',
        each: true,
        stagger: 5,
        keys: popIn(16, 0.3),
      },
    ],
    props: [
      packet(2.6, 16.2, 7.5, 12.0, '#FCA5A5', 28, 46, 0.9),
      packet(7.5, 12.0, 21.4, 16.2, '#FDE047', 44, 64, 0.9),
    ],
  },

  reacthookform: {
    story:
      'React Hook Form clipboard badge traces its frame as four form field lines slide in left-to-right and a crisp green validation check confirms',
    groups: {
      frame: 4,
      fields: [2, 3, 0, 1],
    },
    tracks: [
      {
        on: 'frame',
        draw: [8, 30],
        fill: [22, 34],
        width: 0.6,
      },
      {
        on: 'fields',
        each: true,
        stagger: 4.5,
        keys: slideIn(18, -2.0, 0),
      },
    ],
    props: [checkFlash(16.6, 5.2, '#4ADE80', 42, 66)],
  },

  formik: {
    story:
      'Formik fourteen isometric honeycomb tiles cascade smoothly from top-left to bottom-right like structured form state snapping into alignment',
    tracks: [
      {
        on: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        order: 'y',
        each: true,
        stagger: 1.8,
        keys: popIn(10, 0.45),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#60A5FA', 36, 66, { layer: 'under', sw: 0.55 })],
  },

  chromatic: {
    story:
      'Chromatic visual testing lens opens with an aperture bloom while a pixel-diff scanner sweeps cleanly across the emblem',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        draw: [8, 32],
        fill: [24, 36],
        width: 0.65,
        keys: popIn(12, 0.8),
      },
    ],
    props: [radar(12, 12, 10.4, '#FDBA74', 18, 62, 120), checkFlash(16.8, 5.2, '#4ADE80', 42, 66)],
  },

  oxc: {
    story:
      'Oxc Rust oxidation compiler spins up with high-torque velocity, firing an electric cyan parser bolt and twin AST compile sparks',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: torque(10, 24, 52),
      },
    ],
    props: [
      boltFlash(17.8, 4.2, '#67E8F9', 24, 52),
      spark(5.0, 19.0, -1.6, 1.6, '#22D3EE', 36, 58),
    ],
  },

  rolldown: {
    story:
      'Rolldown Rust-powered bundler rolls forward with kinetic momentum, compressing module chunks with a fiery orange shockwave and build spark',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          10: { r: -28, s: 0.9, e: 'inout' },
          36: { r: 24, s: 1.06, e: 'settle' },
          54: { r: -5, s: 1.01, e: 'settle' },
          66: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#FB923C', 22, 56, { layer: 'under', sw: 0.6 }),
      spark(18.8, 5.4, 1.8, -1.6, '#FDE047', 34, 58),
    ],
  },

  gulp: {
    story:
      'gulp streaming task runner sways playfully while its twin script ribbons glide in and a red-coral build stream flows smoothly across',
    groups: {
      left: 0,
      right: 1,
    },
    tracks: [
      { on: 'left', keys: slideIn(10, -2.2, 0.8) },
      { on: 'right', keys: slideIn(16, 2.2, -0.8) },
    ],
    props: [waveLine(20.6, '#F87171', 12, 62)],
  },

  grunt: {
    story:
      'Grunt armored boar mascot lowers its head with a determined nod while its tusks and eyes glint before charging through build tasks',
    groups: {
      head: 0,
      snout: 1,
      eyes: [2, 3],
      tusks: [4, 5],
    },
    tracks: [
      { on: 'head', origin: '50% 60%', keys: nod(12, 6.5) },
      { on: 'eyes', each: true, keys: popIn(22, 0.5) },
      { on: 'tusks', each: true, stagger: 4, keys: riseIn(26, 1.6) },
    ],
    props: [spark(18.4, 5.8, 1.6, -1.4, '#FDE047', 34, 58)],
  },

  fresh: {
    story:
      'Fresh lemon mark pops cleanly with zero-JS island energy as its inner citrus slice unfolds and a bright yellow hydration ring expands',
    groups: {
      outer: 0,
      inner: 1,
    },
    tracks: [
      { on: 'outer', keys: popIn(10, 0.78) },
      { on: 'inner', draw: [16, 38], fill: [30, 42], width: 0.6 },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#FEF08A', 24, 58, { layer: 'under', sw: 0.55 }),
      spark(18.6, 5.4, 1.6, -1.6, '#4ADE80', 36, 60),
    ],
  },

  redwoodjs: {
    story:
      'RedwoodJS nine pine-cone scales stack upward from trunk to crown like full-stack React, GraphQL, and Prisma layers growing in harmony',
    tracks: [
      {
        on: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        order: '-y',
        each: true,
        stagger: 2.8,
        keys: riseIn(10, 2.0),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#FDBA74', 36, 66, { layer: 'under', sw: 0.5 })],
  },

  nextra: {
    story:
      'Nextra documentation emblem traces its clean Markdown-powered frame and sweeps a crisp editorial gloss across its surface',
    tracks: [
      {
        on: 0,
        draw: [8, 34],
        fill: [26, 38],
        width: 0.65,
      },
    ],
    props: [
      sheen('<rect x="1.5" y="1.5" width="21" height="21" rx="2"/>', 34, 62, 0.28),
      spark(18.6, 5.2, 1.5, -1.5, '#38BDF8', 40, 62),
    ],
  },

  mintlify: {
    story:
      'Mintlify emerald leaf mark blooms gracefully with fresh documentation clarity, gleaming with a diagonal sheen and subtle mint pulse',
    tracks: [
      {
        on: 0,
        origin: '40% 70%',
        draw: [8, 32],
        fill: [24, 36],
        width: 0.65,
        keys: sway(14, 5, 0.6),
      },
    ],
    props: [
      sheen('<rect x="1.5" y="1.5" width="21" height="21" rx="3"/>', 34, 60, 0.3),
      pulseRing(12, 12, 10.0, '#6EE7B7', 26, 60, { layer: 'under', sw: 0.55 }),
    ],
  },

  readme: {
    story:
      'ReadMe open-book owl hub flips open smoothly like interactive API docs while live request packets glide across its pages',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        keys: flipX(12),
      },
    ],
    props: [
      packet(4.5, 12.0, 19.5, 12.0, '#7DD3FC', 28, 56, 0.9),
      pulseRing(12, 12, 10.2, '#38BDF8', 32, 64, { layer: 'under', sw: 0.5 }),
    ],
  },

  jetpackcompose: {
    story:
      'Jetpack Compose six layered declarative UI planes snap together in reactive recomposition stagger framed by layout smart-guides',
    tracks: [
      {
        on: [0, 1, 2, 3, 4, 5],
        stagger: 4,
        keys: popIn(10, 0.7),
      },
    ],
    props: [
      guides(
        [
          [12.0, 2.0, 12.0, 22.0],
          [2.0, 12.0, 22.0, 12.0],
        ],
        '#4285F4',
        12,
        52
      ),
      pulseRing(12, 12, 10.4, '#3DDB85', 34, 66, { layer: 'under', sw: 0.5 }),
    ],
  },

  bevy: {
    story:
      'Bevy three soaring ECS birds glide in staggered flight formation as an entity-system pulse radiates beneath',
    tracks: [
      { on: 0, keys: slideIn(10, -2.4, 1.2) },
      { on: 1, keys: slideIn(17, -2.0, 1.0) },
      { on: 2, keys: slideIn(24, -1.6, 0.8) },
    ],
    props: [
      pulseRing(12, 12, 10.4, '#94A3B8', 28, 62, { layer: 'under', sw: 0.5 }),
      spark(18.8, 5.4, 1.4, -1.4, '#E2E8F0', 36, 60),
    ],
  },

  playcanvas: {
    story:
      'PlayCanvas 3D WebGL play prism pivots smoothly along its axis while a viewport render spark flashes at its apex',
    tracks: [
      { on: 0, origin: [12, 12], keys: torque(10, 12, 12) },
      { on: 1, origin: [12, 12], keys: popIn(20, 0.72) },
    ],
    props: [
      spark(18.5, 5.5, 1.5, -1.5, '#F97316', 32, 58),
      pulseRing(12, 12, 10.2, '#FB923C', 28, 62, { layer: 'under', sw: 0.5 }),
    ],
  },

  raylib: {
    story:
      'raylib classic framed game-dev badge snaps its outer border and pixel-crisp letter tiles into place in arcade stagger',
    tracks: [
      {
        on: [0, 1, 2, 3, 4, 5, 6, 7],
        stagger: 3,
        keys: popIn(10, 0.75),
      },
    ],
    props: [
      sheen('<rect x="2" y="2" width="20" height="20" rx="1"/>', 38, 64, 0.28),
      spark(19.0, 5.0, 1.2, -1.2, '#F8FAFC', 42, 64),
    ],
  },

  rive: {
    story:
      'Rive expressive state-machine R emblem bends with elastic spring motion and emits a live interaction trigger spark',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        keys: sway(10, 7, 0.8),
      },
    ],
    props: [
      spark(18.4, 5.6, 1.5, -1.5, '#F472B6', 28, 54),
      pulseRing(12, 12, 10.3, '#E879F9', 30, 64, { layer: 'under', sw: 0.5 }),
    ],
  },

  lottiefiles: {
    story:
      'LottieFiles flowing vector-curve badge traces its keyframe bezier path and pulses with lightweight JSON playback energy',
    tracks: [
      {
        on: 0,
        draw: [10, 34],
        fill: [28, 40],
        width: 0.65,
        keys: breathe(18, 1.05),
      },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#00DDB3', 28, 62, { layer: 'under', sw: 0.55 }),
      spark(18.5, 5.5, 1.4, -1.4, '#5EEAD4', 36, 60),
    ],
  },

  penpot: {
    story:
      'Penpot open-source pen-nib emblem draws its SVG vector silhouette while precision design guides lock around it',
    tracks: [
      {
        on: 0,
        draw: [10, 34],
        fill: [28, 40],
        width: 0.65,
        keys: nod(16, -6),
      },
    ],
    props: [
      guides(
        [
          [12.0, 2.0, 12.0, 22.0],
          [2.0, 12.0, 22.0, 12.0],
        ],
        '#31EFB8',
        14,
        54
      ),
    ],
  },

  excalidraw: {
    story:
      'Excalidraw hand-drawn sketchbook frame and strokes sketch themselves in sequentially like a live whiteboard session',
    tracks: [
      { on: 0, draw: [10, 28], fill: [24, 34], width: 0.65 },
      { on: 1, draw: [18, 36], fill: [32, 42], width: 0.65 },
      { on: 2, draw: [26, 44], fill: [40, 50], width: 0.65 },
    ],
    props: [spark(18.6, 5.4, 1.3, -1.3, '#A5B4FC', 42, 64)],
  },

  tldraw: {
    story:
      'tldraw infinite-canvas mark tilts playfully as multiplayer cursor packets dart across the board',
    tracks: [{ on: 0, origin: [12, 12], keys: sway(12, 6, 0.7) }],
    props: [
      packet(4.0, 8.0, 19.5, 16.0, '#60A5FA', 22, 50, 0.85),
      packet(19.5, 8.0, 4.0, 16.0, '#F472B6', 32, 60, 0.85),
    ],
  },

  miro: {
    story:
      'Miro bold yellow M board emblem pops into workshop alignment while sticky-note collaboration sparks chime across its peaks',
    tracks: [{ on: 0, origin: [12, 12], keys: popIn(10, 0.82) }],
    props: [
      spark(6.0, 5.0, -1.2, -1.2, '#FDE047', 26, 50),
      spark(18.0, 5.0, 1.2, -1.2, '#FACC15', 34, 58),
      pulseRing(12, 12, 10.4, '#FFD02F', 30, 64, { layer: 'under', sw: 0.5 }),
    ],
  },

  mermaid: {
    story:
      'Mermaid flowchart emblem traces its diagram edges and sends a directed graph node packet from root to leaf',
    tracks: [
      {
        on: 0,
        draw: [10, 34],
        fill: [28, 40],
        width: 0.65,
        keys: breathe(18, 1.04),
      },
    ],
    props: [
      packet(4.5, 7.5, 19.5, 16.5, '#FF3670', 32, 60, 0.9),
      pulseRing(12, 12, 10.3, '#FB7185', 34, 66, { layer: 'under', sw: 0.5 }),
    ],
  },
};
