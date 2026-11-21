// Story-driven SVG animation specs for all 58 icons in "Programming languages"
// (excluding typescript, python, and rust which live in pilot.mjs).
// Every keyframe stays strictly within 6%..72% (T = 4.8s), returning to the clean
// static logo at 0%..6% and 72%..100%.

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
  heartbeat,
  nod,
  flipX,
  breathe,
} from '../motifs.mjs';

export default {
  javascript: {
    story:
      'JavaScript gold badge outlines and snaps into focus while J and S execute in sequence, capped by a crisp sheen sweep and runtime lightning bolt',
    groups: {
      badge: [0, 3],
      j: 1,
      s: 2,
    },
    tracks: [
      {
        on: 'badge',
        keys: {
          10: { s: 0.94, e: 'out' },
          24: { s: 1.03, e: 'settle' },
          40: { s: 1, e: 'out' },
        },
      },
      {
        on: 'j',
        draw: [12, 28],
        fill: [22, 30],
        width: 0.65,
        keys: dropIn(12, 2.2),
      },
      {
        on: 's',
        draw: [18, 34],
        fill: [28, 36],
        width: 0.65,
        keys: riseIn(18, 2.2),
      },
    ],
    props: [
      sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5" rx="1.6"/>', 42, 66, 0.34),
      boltFlash(6.4, 3.6, '#111622', 26, 52),
    ],
  },

  html5: {
    story:
      'HTML5 semantic shield traces its armored contour, locks upright with a structural pulse, and flashes opening and closing tag brackets',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        fill: [24, 34],
        width: 0.65,
        keys: {
          10: { s: 0.92, y: 1.0, e: 'out' },
          28: { s: 1.04, y: -0.3, e: 'settle' },
          46: { s: 1, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      {
        layer: 'over',
        svg: '<path d="M5.2 9.4 L2.6 12 L5.2 14.6" fill="none" stroke="#FDBA74" stroke-width="0.85" stroke-linecap="round" stroke-linejoin="round"/>',
        keys: {
          30: { x: 1.4, o: 0, e: 'out' },
          40: { x: -0.4, o: 0.95, e: 'settle' },
          54: { x: -0.2, o: 0.85, e: 'out' },
          64: { x: -1.0, o: 0, e: 'out' },
        },
      },
      {
        layer: 'over',
        svg: '<path d="M18.8 9.4 L21.4 12 L18.8 14.6" fill="none" stroke="#FDBA74" stroke-width="0.85" stroke-linecap="round" stroke-linejoin="round"/>',
        keys: {
          30: { x: -1.4, o: 0, e: 'out' },
          40: { x: 0.4, o: 0.95, e: 'settle' },
          54: { x: 0.2, o: 0.85, e: 'out' },
          64: { x: 1.0, o: 0, e: 'out' },
        },
      },
    ],
  },

  css3: {
    story:
      'CSS Rebecca-purple stylesheet badge cascades through layout guides and settles with a polished specular sweep',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        fill: [22, 32],
        width: 0.65,
        keys: {
          12: { sx: 0.9, sy: 1.06, e: 'inout' },
          28: { sx: 1.04, sy: 0.96, e: 'settle' },
          44: { sx: 1, sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      guides(
        [
          [1.8, 7.5, 22.2, 7.5],
          [1.8, 16.5, 22.2, 16.5],
          [8.2, 1.8, 8.2, 22.2],
        ],
        '#C084FC',
        10,
        54
      ),
      sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5" rx="2"/>', 42, 66, 0.28),
    ],
  },

  gnubash: {
    story:
      'Bash POSIX terminal hexagon powers up with a blinking command cursor and fires an automated pipeline pulse',
    tracks: [
      {
        on: 0,
        draw: [8, 28],
        fill: [20, 30],
        width: 0.6,
        keys: {
          12: { s: 0.95, e: 'out' },
          28: { s: 1.03, e: 'settle' },
          46: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      {
        layer: 'over',
        svg: '<rect x="14.2" y="15.0" width="2.6" height="0.85" rx="0.2" fill="#86EFAC"/>',
        keys: {
          26: { o: 0, e: 'linear' },
          30: { o: 1, e: 'linear' },
          38: { o: 1, e: 'linear' },
          42: { o: 0.15, e: 'linear' },
          48: { o: 1, e: 'linear' },
          58: { o: 1, e: 'out' },
          64: { o: 0, e: 'out' },
        },
      },
      pulseRing(12, 12, 9.8, '#86EFAC', 32, 62, { sw: 0.55 }),
    ],
  },

  java: {
    story:
      'Java coffee cup settles firmly on its saucer while twin orange aroma wisps curl upward and warm JVM heat shimmers above',
    groups: {
      cup: [0, 1, 2, 3, 4, 5],
      steamTall: 6,
      steamShort: 7,
    },
    tracks: [
      {
        on: 'cup',
        order: '-y',
        stagger: 1.6,
        keys: {
          10: { y: 1.4, o: 0.4, e: 'out' },
          24: { y: -0.2, o: 1, e: 'settle' },
          36: { y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'steamTall',
        origin: '50% 100%',
        keys: {
          16: { y: 1.6, x: -0.4, r: -5, o: 0.25, e: 'inout' },
          34: { y: -1.1, x: 0.6, r: 4, o: 1, e: 'inout' },
          52: { y: -0.5, x: -0.3, r: -2, o: 1, e: 'inout' },
          66: { y: 0, x: 0, r: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'steamShort',
        origin: '50% 100%',
        keys: {
          20: { y: 1.4, x: 0.4, r: 5, o: 0.25, e: 'inout' },
          38: { y: -1.0, x: -0.5, r: -4, o: 1, e: 'inout' },
          56: { y: -0.4, x: 0.25, r: 2, o: 1, e: 'inout' },
          68: { y: 0, x: 0, r: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(11.6, 2.8, 0.3, -1.6, '#FDBA74', 28, 54),
      spark(14.8, 4.4, -0.3, -1.4, '#FDE047', 34, 60),
    ],
  },

  csharp: {
    story:
      'C# purple .NET hexagon locks in its C core while the four hash bars interlace crisply into a sharp symbol',
    groups: {
      hex: [0, 1],
      letter: 2,
      hBars: [3, 4],
      vBars: [5, 6],
    },
    tracks: [
      {
        on: 'hex',
        keys: {
          10: { s: 0.93, e: 'out' },
          26: { s: 1.03, e: 'settle' },
          44: { s: 1, e: 'out' },
        },
      },
      {
        on: 'letter',
        draw: [12, 30],
        fill: [24, 32],
        width: 0.6,
      },
      {
        on: 'hBars',
        order: 'y',
        stagger: 4,
        keys: slideIn(22, 3.2, 0),
      },
      {
        on: 'vBars',
        order: 'x',
        stagger: 4,
        keys: dropIn(28, 3.0),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#A78BFA', 38, 66, { sw: 0.55 })],
  },

  cpp: {
    story:
      'C++ tri-tone blue hexagon assembles its facets, reveals the C core, and increments twice as both plus signs punch into place',
    groups: {
      topFacet: [0, 1],
      rightFacet: [2, 3],
      bottomFacet: [4, 5],
      letter: 6,
      plus1: 7,
      plus2: 8,
    },
    tracks: [
      {
        on: 'topFacet',
        keys: slideIn(10, -1.6, -1.6),
      },
      {
        on: 'rightFacet',
        keys: slideIn(14, 1.8, 0),
      },
      {
        on: 'bottomFacet',
        keys: slideIn(18, 0, 1.8),
      },
      {
        on: 'letter',
        draw: [16, 34],
        fill: [28, 36],
        width: 0.6,
      },
      {
        on: 'plus1',
        keys: popIn(30, 0.25),
      },
      {
        on: 'plus2',
        keys: popIn(40, 0.25),
      },
    ],
    props: [
      spark(20.6, 8.8, 1.3, -1.3, '#93C5FD', 42, 62),
      spark(20.6, 15.2, 1.3, 1.3, '#60A5FA', 46, 66),
    ],
  },

  c: {
    story:
      'C foundational indigo hexagon traces its bare-metal shield while the white C core locks in with deterministic systems precision',
    groups: {
      shield: [0, 1],
      letter: 2,
    },
    tracks: [
      {
        on: 'shield',
        draw: [8, 28],
        fill: [20, 30],
        width: 0.6,
        keys: {
          10: { s: 0.94, e: 'out' },
          26: { s: 1.03, e: 'settle' },
          44: { s: 1, e: 'out' },
        },
      },
      {
        on: 'letter',
        draw: [18, 38],
        fill: [32, 40],
        width: 0.7,
      },
    ],
    props: [radar(12, 12, 10.6, '#9FA8DA', 24, 66, 90)],
  },

  go: {
    story:
      'Go wordmark launches forward at full speed while its three cyan motion streaks zip across and concurrent goroutine packets race through',
    groups: {
      streaks: [0, 1, 2],
      g: 3,
      o: 4,
    },
    tracks: [
      {
        on: 'streaks',
        order: 'y',
        stagger: 3.5,
        keys: {
          10: { x: -4.2, sx: 0.4, o: 0, e: 'out' },
          22: { x: 0.6, sx: 1.15, o: 1, e: 'settle' },
          36: { x: 0, sx: 1, o: 1, e: 'out' },
        },
      },
      {
        on: 'g',
        keys: {
          12: { x: -2.2, sx: 1.06, e: 'in' },
          28: { x: 0.9, sx: 0.96, e: 'settle' },
          46: { x: 0, sx: 1, e: 'out' },
        },
      },
      {
        on: 'o',
        keys: {
          16: { x: -2.2, sx: 1.06, e: 'in' },
          32: { x: 1.1, sx: 0.96, e: 'settle' },
          50: { x: 0, sx: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(2.5, 8.2, 21.5, 8.2, '#67E8F9', 20, 52, 0.85),
      packet(2.5, 16.0, 21.5, 16.0, '#38BDF8', 28, 60, 0.85),
    ],
  },

  php: {
    story:
      'PHP server-side oval traces its classic request badge while the symmetric P glyphs pop in and a response pulse travels across',
    groups: {
      oval: 1,
      leftP: 0,
      rightP: 2,
    },
    tracks: [
      {
        on: 'oval',
        draw: [8, 30],
        fill: [22, 32],
        width: 0.6,
        keys: breathe(12, 0.05),
      },
      {
        on: 'leftP',
        keys: popIn(18, 0.4),
      },
      {
        on: 'rightP',
        keys: popIn(26, 0.4),
      },
    ],
    props: [packet(3.2, 12, 20.8, 12, '#C4B5FD', 32, 64, 0.95)],
  },

  kotlin: {
    story:
      'Kotlin violet prism traces its crisp diagonal geometry, snaps into place with a bold diagonal sheen, and emits a cross-platform spark',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        fill: [22, 32],
        width: 0.65,
        keys: {
          12: { x: -1.4, y: 1.4, s: 0.9, e: 'out' },
          28: { x: 0.25, y: -0.25, s: 1.04, e: 'settle' },
          44: { x: 0, y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5"/>', 38, 64, 0.34),
      spark(18.5, 5.2, 1.8, -1.8, '#E879F9', 30, 52),
    ],
  },

  swift: {
    story:
      'Swift bird banks sharply and swoops diagonally upward across the frame, trailing twin aerodynamic speed arcs',
    tracks: [
      {
        on: 0,
        origin: '45% 55%',
        keys: {
          10: { x: -2.6, y: 2.0, r: -10, s: 0.9, e: 'in' },
          26: { x: 1.4, y: -1.5, r: 7, s: 1.06, e: 'settle' },
          44: { x: -0.3, y: 0.2, r: -2, s: 0.99, e: 'inout' },
          60: { x: 0, y: 0, r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      {
        layer: 'under',
        svg: '<path d="M2.2 18.6 Q8.5 16.5 14.5 11.2" fill="none" stroke="#FDBA74" stroke-width="0.7" stroke-linecap="round"/>',
        keys: {
          14: { x: -2.0, y: 1.6, o: 0, e: 'out' },
          26: { x: 0.4, y: -0.4, o: 0.85, e: 'out' },
          44: { x: 2.2, y: -1.8, o: 0, e: 'out' },
        },
      },
      spark(18.2, 5.8, 1.8, -1.4, '#FDE047', 24, 46),
    ],
  },

  dart: {
    story:
      'Dart feathered arrowhead converges from its teal and cobalt wing facets and launches smoothly toward the target',
    groups: {
      topFin: 7,
      leftFin: 3,
      rightFin: 6,
      bottomFin: [1, 2],
      core: [0, 4, 5],
    },
    tracks: [
      {
        on: 'core',
        keys: {
          10: { x: -1.8, y: -1.8, s: 0.92, e: 'out' },
          28: { x: 0.4, y: 0.4, s: 1.04, e: 'settle' },
          46: { x: 0, y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'topFin',
        keys: slideIn(14, 0, -2.4),
      },
      {
        on: 'leftFin',
        keys: slideIn(18, -2.4, 0),
      },
      {
        on: 'rightFin',
        keys: slideIn(22, 2.4, 0),
      },
      {
        on: 'bottomFin',
        keys: slideIn(26, 0, 2.4),
      },
    ],
    props: [
      spark(18.5, 18.5, 1.8, 1.8, '#22D3EE', 32, 56),
      pulseRing(12, 12, 10, '#38BDF8', 36, 66, { sw: 0.5 }),
    ],
  },

  ruby: {
    story:
      'Ruby faceted gemstone shimmers across all 18 cut planes in a cascading wave before catching a brilliant diagonal sparkle',
    groups: (parts) => ({
      facets: parts.map((p) => p.i),
    }),
    tracks: [
      {
        on: 'facets',
        order: 'x',
        stagger: 0.9,
        each: true,
        keys: {
          10: { s: 0.86, o: 0.55, e: 'out' },
          24: { s: 1.07, o: 1, e: 'settle' },
          38: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<circle cx="12" cy="12" r="10.2"/>', 38, 64, 0.35),
      spark(17.5, 5.2, 1.6, -1.6, '#FEF08A', 32, 54),
      spark(6.2, 18.2, -1.4, 1.4, '#FDA4AF', 40, 62),
    ],
  },

  r: {
    story:
      'R statistical ring orbits smoothly while the bold R glyph settles in and three live histogram bars rise to visualize a distribution',
    groups: {
      ring: 0,
      letter: [1, 2],
    },
    tracks: [
      {
        on: 'ring',
        draw: [8, 30],
        fill: [22, 32],
        width: 0.6,
        keys: {
          12: { sx: 0.92, e: 'inout' },
          28: { sx: 1.04, e: 'settle' },
          46: { sx: 1, e: 'out' },
        },
      },
      {
        on: 'letter',
        keys: riseIn(16, 2.4),
      },
    ],
    props: [
      telemetryBar(3.2, 16.5, 1.4, 4.2, '#60A5FA', 24, 58),
      telemetryBar(5.2, 14.5, 1.4, 6.2, '#93C5FD', 30, 62),
      telemetryBar(7.2, 17.5, 1.4, 3.2, '#38BDF8', 36, 66),
    ],
  },

  scala: {
    story:
      'Scala three crimson spiral ribbons climb upward like a functional staircase, each tier sliding into alignment over its dark backbone',
    groups: {
      back: 0,
      bottom: 1,
      mid: 2,
      top: 3,
    },
    tracks: [
      {
        on: 'back',
        keys: {
          10: { o: 0.45, s: 0.95, e: 'out' },
          26: { o: 1, s: 1.02, e: 'settle' },
          44: { o: 1, s: 1, e: 'out' },
        },
      },
      {
        on: 'bottom',
        keys: slideIn(12, -2.6, 0.8),
      },
      {
        on: 'mid',
        keys: slideIn(20, 2.6, 0.4),
      },
      {
        on: 'top',
        keys: slideIn(28, -2.6, -0.4),
      },
    ],
    props: [packet(7.5, 19.2, 16.5, 4.8, '#FCA5A5', 34, 64, 0.9)],
  },

  elixir: {
    story:
      'Elixir purple droplet shimmers with a liquid ripple, gently bobs in suspension, and emits a fault-tolerant BEAM supervisor ring',
    tracks: [
      {
        on: 0,
        origin: '50% 65%',
        draw: [8, 30],
        fill: [22, 32],
        width: 0.6,
        keys: {
          12: { sy: 1.08, sx: 0.92, y: -0.9, e: 'inout' },
          28: { sy: 0.94, sx: 1.06, y: 0.6, e: 'settle' },
          44: { sy: 1.03, sx: 0.98, y: -0.25, e: 'inout' },
          60: { sy: 1, sx: 1, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 14.5, 7.6, '#C084FC', 22, 58, { sw: 0.6 }),
      spark(15.2, 6.0, 1.2, -1.4, '#E9D5FF', 30, 52),
    ],
  },

  lua: {
    story:
      'Lua satellite moon completes a full orbital revolution around the indigo planet while the dotted celestial ring shimmers in place',
    groups: (parts) => ({
      moon: 0,
      planet: 1,
      crater: 2,
      letters: [3, 4, 5],
      orbit: parts.slice(6).map((p) => p.i),
    }),
    tracks: [
      {
        on: 'moon',
        origin: [12, 12],
        end: { r: 360 },
        keys: {
          10: { r: 0, e: 'inout' },
          66: { r: 360, e: 'out' },
        },
      },
      {
        on: 'planet',
        keys: breathe(12, 0.04),
      },
      {
        on: 'crater',
        keys: heartbeat(18, 0.1),
      },
      {
        on: 'letters',
        order: 'x',
        stagger: 3.5,
        each: true,
        keys: {
          16: { y: 0.9, o: 0.5, e: 'out' },
          28: { y: -0.2, o: 1, e: 'settle' },
          40: { y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'orbit',
        origin: [12, 12],
        keys: {
          14: { r: 0, o: 0.45, e: 'inout' },
          40: { r: 18, o: 1, e: 'inout' },
          64: { r: 0, o: 1, e: 'out' },
        },
      },
    ],
  },

  zig: {
    story:
      'Zig golden lightning-Z locks between its left and right systems brackets, snapping together with zero-overhead compile-time sparks',
    groups: {
      leftBracket: [0, 1, 2],
      coreZ: [3, 4, 5, 6, 7],
      rightBracket: [8, 9, 10],
    },
    tracks: [
      {
        on: 'leftBracket',
        keys: slideIn(10, -2.8, 0),
      },
      {
        on: 'rightBracket',
        keys: slideIn(10, 2.8, 0),
      },
      {
        on: 'coreZ',
        order: 'x',
        stagger: 2.2,
        keys: {
          16: { s: 0.85, o: 0.4, e: 'out' },
          30: { s: 1.06, o: 1, e: 'settle' },
          44: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [boltFlash(19.6, 3.2, '#FEF08A', 28, 54)],
  },

  haskell: {
    story:
      'Haskell bind chevron flows into the central lambda while the twin equality bars slide right to evaluate a pure expression',
    groups: {
      chevron: 0,
      lambda: 1,
      eqBottom: 2,
      eqTop: 3,
    },
    tracks: [
      {
        on: 'chevron',
        keys: slideIn(10, -2.8, 0),
      },
      {
        on: 'lambda',
        draw: [14, 34],
        fill: [28, 36],
        width: 0.65,
        keys: slideIn(14, -1.6, 0),
      },
      {
        on: 'eqTop',
        keys: slideIn(26, 2.8, 0),
      },
      {
        on: 'eqBottom',
        keys: slideIn(32, 2.8, 0),
      },
    ],
    props: [packet(4.5, 12, 20.5, 12, '#C084FC', 36, 66, 0.9)],
  },

  julia: {
    story:
      'Julia crimson, emerald, and violet spheres orbit inward in a three-body scientific harmony before locking into their equilateral triad',
    groups: {
      red: [0, 1],
      green: [2, 3],
      purple: [4, 5],
    },
    tracks: [
      {
        on: 'green',
        keys: {
          10: { y: -2.2, s: 0.78, e: 'inout' },
          28: { y: 0.35, s: 1.08, e: 'settle' },
          46: { y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'red',
        keys: {
          16: { x: -2.0, y: 1.5, s: 0.78, e: 'inout' },
          34: { x: 0.3, y: -0.25, s: 1.08, e: 'settle' },
          52: { x: 0, y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'purple',
        keys: {
          22: { x: 2.0, y: 1.5, s: 0.78, e: 'inout' },
          40: { x: -0.3, y: -0.25, s: 1.08, e: 'settle' },
          58: { x: 0, y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 13.4, 8.6, '#C4B5FD', 32, 66, { sw: 0.55 })],
  },

  clojure: {
    story:
      'Clojure green and blue immutable lambda halves spin in balanced harmony inside the circular JVM ring',
    groups: {
      backdrop: 0,
      green: [1, 2, 3],
      blue: [4, 5],
    },
    tracks: [
      {
        on: 'backdrop',
        keys: breathe(10, 0.04),
      },
      {
        on: 'green',
        origin: [12, 12],
        keys: {
          12: { r: -28, s: 0.92, e: 'inout' },
          36: { r: 8, s: 1.04, e: 'settle' },
          56: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'blue',
        origin: [12, 12],
        keys: {
          12: { r: 28, s: 0.92, e: 'inout' },
          36: { r: -8, s: 1.04, e: 'settle' },
          56: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [radar(12, 12, 10.8, '#93C5FD', 18, 62, 120)],
  },

  ocaml: {
    story:
      'OCaml desert camel strides forward with confident functional poise while its warm amber silhouette catches a sunlit sheen',
    groups: {
      body: [6, 7],
      accents: [4, 5, 8, 9],
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 70%',
        keys: {
          10: { x: -1.8, r: -4, e: 'inout' },
          28: { x: 0.8, r: 3, y: -0.5, e: 'inout' },
          46: { x: -0.2, r: -1.5, y: 0.2, e: 'settle' },
          62: { x: 0, r: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'accents',
        keys: slideIn(16, -2.0, 0.8),
      },
    ],
    props: [waveLine(21.4, '#FDBA74', 12, 62)],
  },

  erlang: {
    story:
      'Erlang telecom emblem broadcasts fault-tolerant actor signals outward as its left bar and central e lock into formation',
    groups: {
      leftBar: 0,
      body: 1,
      topLoop: 2,
    },
    tracks: [
      {
        on: 'leftBar',
        keys: slideIn(10, -2.4, 0),
      },
      {
        on: 'body',
        draw: [12, 34],
        fill: [26, 36],
        width: 0.65,
      },
      {
        on: 'topLoop',
        keys: popIn(22, 0.4),
      },
    ],
    props: [
      pulseRing(12, 12, 9.4, '#F472B6', 28, 60, { sw: 0.55 }),
      packet(3.8, 12, 20.2, 12, '#FBCFE8', 32, 64, 0.9),
    ],
  },

  fsharp: {
    story:
      'F# twin functional chevrons split open around the inner diamond core and pipe a value cleanly from left to right',
    groups: {
      left: 0,
      inner: 1,
      right: 2,
    },
    tracks: [
      {
        on: 'left',
        keys: slideIn(10, -2.8, 0),
      },
      {
        on: 'inner',
        keys: popIn(18, 0.35),
      },
      {
        on: 'right',
        keys: slideIn(14, 2.8, 0),
      },
    ],
    props: [packet(4.0, 12, 20.0, 12, '#7DD3FC', 28, 60, 0.95)],
  },

  fortran: {
    story:
      'Fortran purple array-computing block traces its crisp serif F and sweeps a vectorized computation line across its matrix',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        fill: [22, 32],
        width: 0.65,
        keys: {
          12: { s: 0.93, e: 'out' },
          28: { s: 1.03, e: 'settle' },
          46: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      guides(
        [
          [3, 8, 21, 8],
          [3, 12, 21, 12],
          [3, 16, 21, 16],
        ],
        '#C4B5FD',
        12,
        54
      ),
      sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5" rx="1.6"/>', 38, 64, 0.28),
    ],
  },

  solidity: {
    story:
      'Solidity upper and lower octahedron crystal halves hover apart to sign an EVM smart contract, then seal together with a verified spark',
    groups: {
      upper: [0, 1, 2],
      lower: [3, 4, 5],
    },
    tracks: [
      {
        on: 'upper',
        order: 'x',
        stagger: 2.5,
        keys: {
          10: { y: -2.0, o: 0.45, e: 'inout' },
          30: { y: 0.25, o: 1, e: 'settle' },
          46: { y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'lower',
        order: '-x',
        stagger: 2.5,
        keys: {
          14: { y: 2.0, o: 0.45, e: 'inout' },
          34: { y: -0.25, o: 1, e: 'settle' },
          50: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [checkFlash(16.2, 5.4, '#86EFAC', 42, 66)],
  },

  perl: {
    story:
      'Perl deep-blue emblem traces its circular shell while its inner detail pulses like a regex match scanning a text stream',
    groups: {
      inner: 0,
      badge: 1,
      accent: 2,
    },
    tracks: [
      {
        on: 'badge',
        draw: [8, 30],
        fill: [22, 32],
        width: 0.6,
      },
      {
        on: 'inner',
        keys: breathe(12, 0.05),
      },
      {
        on: 'accent',
        keys: nod(22, 7),
      },
    ],
    props: [radar(12, 12, 10.6, '#93C5FD', 20, 64, 110)],
  },

  apachegroovy: {
    story:
      'Groovy cyan star bursts into view with a lively spin-settle and twinkles across its inner facets like a dynamic Gradle DSL',
    groups: {
      star: 0,
      inner: [1, 2],
    },
    tracks: [
      {
        on: 'star',
        origin: [12, 12],
        keys: {
          10: { r: -14, s: 0.88, e: 'out' },
          28: { r: 6, s: 1.06, e: 'settle' },
          46: { r: -2, s: 0.99, e: 'inout' },
          60: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'inner',
        stagger: 4,
        keys: popIn(20, 0.4),
      },
    ],
    props: [
      spark(18.6, 6.2, 1.5, -1.5, '#7DD3FC', 28, 52),
      spark(5.4, 17.8, -1.5, 1.5, '#BAE6FD', 36, 60),
    ],
  },

  crystal: {
    story:
      'Crystal faceted polyhedron rotates smoothly through a crisp geometric flash, reflecting compiled-speed light across its planes',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        draw: [8, 30],
        fill: [22, 32],
        width: 0.6,
        keys: {
          12: { r: -18, s: 0.9, e: 'inout' },
          34: { r: 8, s: 1.05, e: 'settle' },
          54: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<circle cx="12" cy="12" r="10.2"/>', 36, 62, 0.34),
      spark(17.8, 5.4, 1.6, -1.6, '#E2E8F0', 30, 54),
    ],
  },

  nim: {
    story:
      'Nim golden crown lowers its regal top spires onto the sculpted base with a crisp metallic gleam',
    groups: {
      spire: 0,
      base: 1,
    },
    tracks: [
      {
        on: 'base',
        keys: riseIn(10, 2.0),
      },
      {
        on: 'spire',
        keys: dropIn(16, 2.6),
      },
    ],
    props: [
      spark(11.2, 3.0, -0.8, -1.4, '#FEF08A', 30, 54),
      spark(12.8, 3.0, 0.8, -1.4, '#FEF08A', 30, 54),
      spark(5.2, 5.2, -1.4, -1.2, '#FDE047', 34, 58),
      spark(18.8, 5.2, 1.4, -1.2, '#FDE047', 34, 58),
    ],
  },

  gleam: {
    story:
      'Gleam friendly pink star wiggles happily, blinks both eyes in sync, and radiates cheerful type-safe BEAM sparkles',
    groups: {
      star: [0, 1],
      eyes: [2, 3],
      smile: 4,
    },
    tracks: [
      {
        on: 'star',
        origin: [12, 12],
        keys: sway(10, 8, 0.6),
      },
      {
        on: 'eyes',
        each: true,
        keys: {
          30: { sy: 1, e: 'in' },
          36: { sy: 0.12, e: 'out' },
          44: { sy: 1, e: 'out' },
        },
      },
      {
        on: 'smile',
        keys: {
          26: { s: 0.9, e: 'inout' },
          38: { s: 1.18, e: 'settle' },
          52: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(18.6, 4.8, 1.5, -1.5, '#FFAFF3', 22, 46),
      spark(4.8, 18.6, -1.4, 1.4, '#FDE047', 34, 58),
    ],
  },

  v: {
    story:
      'V dual-tone steel-blue arms converge from opposite diagonals and snap into a razor-sharp compiled chevron',
    groups: {
      leftArm: 1,
      rightArm: 0,
    },
    tracks: [
      {
        on: 'leftArm',
        keys: slideIn(10, -2.6, -2.0),
      },
      {
        on: 'rightArm',
        keys: slideIn(14, 2.6, -2.0),
      },
    ],
    props: [
      spark(10.6, 20.6, -1.1, 1.2, '#93C5FD', 32, 56),
      spark(13.4, 20.6, 1.1, 1.2, '#93C5FD', 32, 56),
      pulseRing(12, 12, 10, '#60A5FA', 34, 64, { sw: 0.5 }),
    ],
  },

  assemblyscript: {
    story:
      'AssemblyScript cobalt badge outlines its TypeScript-to-Wasm bridge and compiles a fast binary packet across the module',
    groups: {
      badge: 0,
      detail: 1,
    },
    tracks: [
      {
        on: 'badge',
        draw: [8, 30],
        fill: [22, 32],
        width: 0.6,
        keys: {
          10: { s: 0.94, e: 'out' },
          26: { s: 1.03, e: 'settle' },
          44: { s: 1, e: 'out' },
        },
      },
      {
        on: 'detail',
        keys: popIn(22, 0.35),
      },
    ],
    props: [
      sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5" rx="1.6"/>', 40, 66, 0.28),
      packet(4.2, 6.2, 19.8, 6.2, '#7DD3FC', 28, 56, 0.85),
    ],
  },

  webassembly: {
    story:
      'WebAssembly notched purple module snaps down like a portable binary block, locking into the browser sandbox with an edge pulse',
    groups: {
      block: 0,
      inner: 1,
    },
    tracks: [
      {
        on: 'block',
        draw: [8, 28],
        fill: [20, 30],
        width: 0.65,
        keys: dropIn(10, 2.4),
      },
      {
        on: 'inner',
        keys: popIn(24, 0.35),
      },
    ],
    props: [
      sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5"/>', 38, 64, 0.3),
      pulseRing(12, 12, 10.6, '#A78BFA', 32, 62, { sw: 0.55 }),
    ],
  },

  rescript: {
    story:
      'ReScript crimson square traces its sound type boundary, flashes a fast compiler bolt, and finishes with a glossy diagonal sheen',
    tracks: [
      {
        on: 0,
        draw: [8, 28],
        fill: [20, 30],
        width: 0.65,
        keys: {
          10: { s: 0.93, e: 'out' },
          26: { s: 1.04, e: 'settle' },
          44: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      boltFlash(17.8, 4.2, '#FEF08A', 26, 52),
      sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5" rx="1.8"/>', 40, 66, 0.28),
    ],
  },

  elm: {
    story:
      'Elm seven colorful tangram pieces glide from the edges and lock seamlessly into a zero-runtime-exception geometric square',
    groups: {
      orangeTop: 0,
      greenTop: 1,
      greenRight: 2,
      cyanSquare: 3,
      slateLeft: 4,
      orangeBottom: 5,
      cyanBottom: 6,
    },
    tracks: [
      {
        on: 'slateLeft',
        keys: slideIn(10, -2.6, 0),
      },
      {
        on: 'greenTop',
        keys: slideIn(14, 0, -2.4),
      },
      {
        on: 'cyanSquare',
        keys: slideIn(18, 2.2, -2.2),
      },
      {
        on: 'orangeTop',
        keys: popIn(22, 0.4),
      },
      {
        on: 'greenRight',
        keys: slideIn(26, 2.6, 0),
      },
      {
        on: 'orangeBottom',
        keys: slideIn(30, 2.0, 2.0),
      },
      {
        on: 'cyanBottom',
        keys: slideIn(34, 0, 2.4),
      },
    ],
  },

  purescript: {
    story:
      'PureScript twin chevrons bracket three pure data bars that slide cleanly into horizontal alignment',
    groups: {
      bars: [0, 1, 2],
      leftChev: 3,
      rightChev: 4,
    },
    tracks: [
      {
        on: 'leftChev',
        keys: slideIn(10, -2.6, 0),
      },
      {
        on: 'rightChev',
        keys: slideIn(10, 2.6, 0),
      },
      {
        on: 'bars',
        order: 'y',
        stagger: 4.5,
        keys: {
          16: { sx: 0.25, o: 0.2, e: 'out' },
          30: { sx: 1.08, o: 1, e: 'settle' },
          42: { sx: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [packet(4.5, 12, 19.5, 12, '#E2E8F0', 36, 66, 0.8)],
  },

  coffeescript: {
    story:
      'CoffeeScript warm espresso cup sets down gently while its rim settles and aromatic curls drift above',
    groups: {
      lid: 0,
      cup: 1,
      rim: 2,
    },
    tracks: [
      {
        on: 'cup',
        keys: riseIn(10, 2.0),
      },
      {
        on: 'rim',
        keys: dropIn(16, 1.6),
      },
      {
        on: 'lid',
        keys: dropIn(22, 2.2),
      },
    ],
    props: [
      spark(10.0, 3.2, -0.4, -1.6, '#CBD5E1', 28, 56),
      spark(14.5, 3.2, 0.4, -1.6, '#E2E8F0', 34, 62),
    ],
  },

  d: {
    story:
      'D bold crimson systems letter grounds itself solidly while its orbiting red satellite loops briskly around the upper shoulder',
    groups: {
      moon: 0,
      letter: 1,
    },
    tracks: [
      {
        on: 'letter',
        draw: [8, 30],
        fill: [22, 32],
        width: 0.65,
        keys: {
          10: { s: 0.94, e: 'out' },
          26: { s: 1.04, e: 'settle' },
          44: { s: 1, e: 'out' },
        },
      },
      {
        on: 'moon',
        origin: [16.5, 10.5],
        keys: {
          12: { r: -35, s: 0.7, e: 'inout' },
          36: { r: 22, s: 1.15, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [spark(20.6, 3.6, 1.4, -1.2, '#FCA5A5', 30, 54)],
  },

  racket: {
    story:
      'Racket red and blue halves converge around the white central lambda, sealing the programmable language circle',
    groups: {
      circle: [0, 1],
      blue: [2, 3],
      redLeft: 4,
      redBottom: [5, 6],
    },
    tracks: [
      {
        on: 'circle',
        keys: breathe(10, 0.04),
      },
      {
        on: 'blue',
        keys: slideIn(12, 2.2, -1.4),
      },
      {
        on: 'redLeft',
        keys: slideIn(16, -2.2, 0),
      },
      {
        on: 'redBottom',
        keys: slideIn(20, 0, 2.2),
      },
    ],
    props: [pulseRing(12, 12, 10.6, '#93C5FD', 34, 64, { sw: 0.55 })],
  },

  commonlisp: {
    story:
      'Common Lisp circular emblem pulses like nested S-expressions while its inner motif tilts and settles inside balanced parentheses',
    groups: {
      outer: 0,
      inner: 1,
    },
    tracks: [
      {
        on: 'outer',
        draw: [8, 30],
        fill: [22, 32],
        width: 0.6,
      },
      {
        on: 'inner',
        keys: {
          14: { r: -10, s: 0.85, e: 'inout' },
          34: { r: 6, s: 1.08, e: 'settle' },
          54: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      {
        layer: 'over',
        svg: '<path d="M3.2 6.8 Q1.2 12 3.2 17.2" fill="none" stroke="#E2E8F0" stroke-width="0.7" stroke-linecap="round"/>',
        keys: {
          24: { x: 1.4, o: 0, e: 'out' },
          36: { x: -0.4, o: 0.9, e: 'settle' },
          54: { x: -0.2, o: 0.8, e: 'out' },
          64: { x: -1.0, o: 0, e: 'out' },
        },
      },
      {
        layer: 'over',
        svg: '<path d="M20.8 6.8 Q22.8 12 20.8 17.2" fill="none" stroke="#E2E8F0" stroke-width="0.7" stroke-linecap="round"/>',
        keys: {
          24: { x: -1.4, o: 0, e: 'out' },
          36: { x: 0.4, o: 0.9, e: 'settle' },
          54: { x: 0.2, o: 0.8, e: 'out' },
          64: { x: 1.0, o: 0, e: 'out' },
        },
      },
    ],
  },

  ada: {
    story:
      'Ada high-integrity avionics emblem traces its crisp letterforms and confirms safety-critical verification with a radar sweep and check',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        fill: [24, 34],
        width: 0.55,
        keys: {
          12: { s: 0.95, e: 'out' },
          30: { s: 1.03, e: 'settle' },
          48: { s: 1, e: 'out' },
        },
      },
    ],
    props: [radar(12, 12, 10.4, '#94A3B8', 16, 60, 100), checkFlash(17.2, 5.2, '#86EFAC', 40, 66)],
  },

  latex: {
    story:
      'LaTeX five typographic glyphs L-A-T-E-X drop onto their stepped mathematical baselines in sequence as a subtle ruling guide aligns them',
    groups: (parts) => ({
      letters: parts.map((p) => p.i),
    }),
    tracks: [
      {
        on: 'letters',
        order: 'x',
        stagger: 5,
        each: true,
        keys: {
          10: { y: -2.4, o: 0.15, e: 'in' },
          24: { y: 0.3, o: 1, e: 'settle' },
          36: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      guides(
        [
          [1.2, 14.2, 22.8, 14.2],
          [1.2, 8.0, 22.8, 8.0],
        ],
        '#2DD4BF',
        10,
        58
      ),
    ],
  },

  markdown: {
    story:
      'Markdown rounded frame draws its plain-text card, the M glyph pops in, and the downward arrow stamps into place',
    groups: {
      frame: [0, 3],
      m: 1,
      arrow: 2,
    },
    tracks: [
      {
        on: 'frame',
        draw: [8, 28],
        fill: [20, 30],
        width: 0.6,
      },
      {
        on: 'm',
        keys: popIn(16, 0.45),
      },
      {
        on: 'arrow',
        keys: {
          20: { y: -3.2, o: 0.1, e: 'in' },
          36: { y: 0.7, o: 1, e: 'settle' },
          48: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
  },

  yaml: {
    story:
      'YAML four structured letters Y-A-M-L cascade down by indentation level like clean key-value configuration blocks',
    groups: {
      y: 0,
      a: 1,
      m: 2,
      l: 3,
    },
    tracks: [
      {
        on: 'y',
        keys: slideIn(10, -2.4, 0),
      },
      {
        on: 'a',
        keys: slideIn(18, -2.4, 0),
      },
      {
        on: 'm',
        keys: slideIn(26, -2.4, 0),
      },
      {
        on: 'l',
        keys: slideIn(34, -2.4, 0),
      },
    ],
    props: [
      guides(
        [
          [2.0, 6.8, 22.0, 6.8],
          [2.0, 17.2, 22.0, 17.2],
        ],
        '#F87171',
        12,
        58
      ),
    ],
  },

  toml: {
    story:
      'TOML rust-brown square brackets clamp inward around the bold central T like a clean configuration table header',
    groups: {
      rightBracket: 0,
      leftBracket: 1,
      t: 2,
    },
    tracks: [
      {
        on: 'leftBracket',
        keys: slideIn(10, -3.0, 0),
      },
      {
        on: 'rightBracket',
        keys: slideIn(10, 3.0, 0),
      },
      {
        on: 't',
        keys: dropIn(18, 2.6),
      },
    ],
    props: [checkFlash(16.6, 4.4, '#FDBA74', 40, 66)],
  },

  json: {
    story:
      'JSON interlocking yin-yang data curls rotate smoothly into mutual serialization and emit a crisp payload pulse',
    groups: {
      leftCurl: 0,
      rightCurl: 1,
    },
    tracks: [
      {
        on: 'leftCurl',
        origin: [12, 12],
        keys: {
          10: { r: -32, s: 0.92, e: 'inout' },
          36: { r: 8, s: 1.04, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'rightCurl',
        origin: [12, 12],
        keys: {
          10: { r: 32, s: 0.92, e: 'inout' },
          36: { r: -8, s: 1.04, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.6, '#CBD5E1', 26, 60, { sw: 0.55 })],
  },

  xml: {
    story:
      'XML tag wordmark and closing chevron stream into place while its three colorful data nodes pop out in sequence',
    groups: {
      wordmark: [3, 5],
      chevron: 4,
      nodes: [0, 1, 2],
    },
    tracks: [
      {
        on: 'wordmark',
        keys: slideIn(10, -2.4, 0),
      },
      {
        on: 'chevron',
        keys: slideIn(16, 2.2, 0),
      },
      {
        on: 'nodes',
        order: 'y',
        stagger: 5,
        each: true,
        keys: popIn(22, 0.25),
      },
    ],
    props: [packet(3.0, 12, 19.2, 12, '#38BDF8', 30, 62, 0.85)],
  },

  typst: {
    story:
      'Typst teal serif t sketches its calligraphic stroke with instant-preview precision between clean typographic margin guides',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        fill: [24, 34],
        width: 0.65,
        keys: {
          12: { y: -1.4, r: -4, e: 'out' },
          30: { y: 0.2, r: 2, e: 'settle' },
          48: { y: 0, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      guides(
        [
          [5.0, 2.0, 5.0, 22.0],
          [19.0, 2.0, 19.0, 22.0],
        ],
        '#5EEAD4',
        10,
        56
      ),
      spark(16.6, 5.2, 1.4, -1.4, '#99F6E4', 34, 58),
    ],
  },

  reason: {
    story:
      'ReasonML vermilion badge snaps onto the OCaml-to-JS pipeline while its inner R cutout pulses and a diagonal sheen sweeps across',
    groups: {
      badge: 0,
      cutout: 1,
    },
    tracks: [
      {
        on: 'badge',
        draw: [8, 28],
        fill: [20, 30],
        width: 0.65,
        keys: {
          10: { s: 0.93, e: 'out' },
          26: { s: 1.04, e: 'settle' },
          44: { s: 1, e: 'out' },
        },
      },
      {
        on: 'cutout',
        keys: popIn(22, 0.35),
      },
    ],
    props: [sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5"/>', 38, 64, 0.3)],
  },

  haxe: {
    story:
      'Haxe central orange diamond pulses outward, fanning its four quadrant tiles and eight multi-target edge chevrons cleanly into place',
    groups: {
      core: 4,
      quadrants: [0, 1, 2, 3],
      edges: [5, 6, 7, 8, 9, 10, 11, 12],
    },
    tracks: [
      {
        on: 'core',
        origin: [12, 12],
        keys: {
          10: { r: -20, s: 0.82, e: 'out' },
          28: { r: 6, s: 1.08, e: 'settle' },
          46: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'quadrants',
        order: 'a',
        stagger: 3,
        each: true,
        keys: popIn(14, 0.6),
      },
      {
        on: 'edges',
        order: 'a',
        stagger: 2.2,
        each: true,
        keys: {
          20: { s: 0.4, o: 0.2, e: 'out' },
          34: { s: 1.12, o: 1, e: 'settle' },
          46: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
  },

  opengl: {
    story:
      'OpenGL GPU rendering pipeline sweeps across its steel-blue wordmark as depth-buffered drop shadows lock behind the foreground glyphs',
    groups: (parts) => ({
      shadow: [0, 1, 2, 3, 4, 5],
      foreground: [6, 7, 8, 9, 10, 11],
      reg: parts.slice(12).map((p) => p.i),
    }),
    tracks: [
      {
        on: 'shadow',
        keys: slideIn(10, 1.4, 1.0),
      },
      {
        on: 'foreground',
        order: 'x',
        stagger: 3,
        keys: {
          14: { y: -1.6, o: 0.35, e: 'out' },
          28: { y: 0.25, o: 1, e: 'settle' },
          40: { y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'reg',
        keys: popIn(34, 0.4),
      },
    ],
    props: [sheen('<rect x="0.5" y="6.5" width="23" height="11"/>', 42, 66, 0.3)],
  },

  webgpu: {
    story:
      'WebGPU five cobalt shader triangles tessellate into a parallel compute mesh, lighting up from the primary viewport triangle outward',
    groups: {
      primary: 0,
      midTris: [2, 4],
      tipTris: [1, 3],
    },
    tracks: [
      {
        on: 'primary',
        draw: [8, 28],
        fill: [20, 30],
        width: 0.65,
        keys: slideIn(10, -2.0, 0),
      },
      {
        on: 'midTris',
        order: 'y',
        stagger: 5,
        keys: slideIn(18, 2.2, 0),
      },
      {
        on: 'tipTris',
        order: 'y',
        stagger: 5,
        keys: popIn(28, 0.3),
      },
    ],
    props: [packet(5.5, 12, 21.5, 8.5, '#60A5FA', 36, 66, 0.85)],
  },

  scratch: {
    story:
      'Scratch playful purple S ribbon bounces energetically like a snapped visual code block and pops a creative spark',
    groups: {
      ribbon: 1,
      highlight: 0,
    },
    tracks: [
      {
        on: 'ribbon',
        origin: '50% 60%',
        keys: {
          10: { y: -2.4, r: -6, s: 0.92, e: 'in' },
          26: { y: 0.6, r: 5, s: 1.08, e: 'settle' },
          42: { y: -0.3, r: -2, s: 0.98, e: 'inout' },
          58: { y: 0, r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'highlight',
        keys: popIn(18, 0.45),
      },
    ],
    props: [
      spark(17.8, 5.2, 1.5, -1.5, '#FDE047', 26, 50),
      spark(5.8, 18.6, -1.5, 1.5, '#C084FC', 34, 58),
    ],
  },

  processingfoundation: {
    story:
      'Processing three creative-coding strokes sketch their intersecting cobalt arcs and diagonal slash onto the generative canvas',
    groups: {
      rightArc: [0, 1],
      slash: [2, 3],
      leftStroke: [4, 5],
    },
    tracks: [
      {
        on: 'leftStroke',
        draw: [10, 28],
        fill: [22, 30],
        width: 0.7,
        keys: slideIn(10, -2.0, 1.2),
      },
      {
        on: 'slash',
        draw: [16, 36],
        fill: [28, 38],
        width: 0.7,
        keys: dropIn(16, 2.0),
      },
      {
        on: 'rightArc',
        draw: [22, 42],
        fill: [34, 44],
        width: 0.7,
        keys: slideIn(22, 2.0, -1.0),
      },
    ],
    props: [pulseRing(12, 12, 10.4, '#60A5FA', 38, 66, { sw: 0.5 })],
  },

  labview: {
    story:
      'LabVIEW graphical dataflow feeds dual input signals into the yellow virtual-instrument triangle and drives a measured output pulse out the right pin',
    groups: {
      outPin: 0,
      inTop: 1,
      inBottom: 2,
      triangle: 3,
      coreIcon: 4,
    },
    tracks: [
      {
        on: 'triangle',
        keys: heartbeat(14, 0.06),
      },
      {
        on: 'coreIcon',
        keys: flipX(20),
      },
      {
        on: 'inTop',
        keys: slideIn(10, -2.0, 0),
      },
      {
        on: 'inBottom',
        keys: slideIn(14, -2.0, 0),
      },
      {
        on: 'outPin',
        keys: slideIn(30, -1.8, 0),
      },
    ],
    props: [
      packet(1.5, 8.8, 9.2, 11.4, '#38BDF8', 12, 38, 0.85),
      packet(1.5, 15.3, 9.2, 12.6, '#4ADE80', 16, 42, 0.85),
      packet(13.5, 12.0, 22.8, 12.0, '#FDE047', 36, 66, 0.9),
    ],
  },

  wolfram: {
    story:
      'Wolfram crimson spikey badge pulses with symbolic-computation precision as its inner white emblem snaps into focus',
    groups: {
      frame: 0,
      redBadge: 1,
      highlight: 2,
      wolf: 3,
    },
    tracks: [
      {
        on: 'frame',
        keys: {
          10: { s: 0.94, e: 'out' },
          26: { s: 1.03, e: 'settle' },
          44: { s: 1, e: 'out' },
        },
      },
      {
        on: 'redBadge',
        origin: [12, 12],
        keys: torque(12, 12, -8),
      },
      {
        on: 'wolf',
        keys: popIn(18, 0.55),
      },
      {
        on: 'highlight',
        keys: popIn(26, 0.4),
      },
    ],
    props: [
      spark(18.6, 5.2, 1.6, -1.6, '#FCA5A5', 30, 54),
      pulseRing(12, 12, 10.6, '#F87171', 34, 66, { sw: 0.5 }),
    ],
  },

  odin: {
    story:
      'Odin sleek circular emblem rotates into compiled alignment while its inner core pulses with data-oriented clarity',
    tracks: [
      { on: 0, origin: [12, 12], keys: torque(10, 14, 14) },
      { on: 1, origin: [12, 12], keys: heartbeat(24, 1.07) },
    ],
    props: [
      pulseRing(12, 12, 10.4, '#60A5FA', 26, 62, { layer: 'under', sw: 0.55 }),
      spark(18.5, 5.5, 1.4, -1.4, '#93C5FD', 34, 58),
    ],
  },

  vulkan: {
    story:
      'Vulkan multi-facet GPU wordmark and arc ignite in crisp shader-pipeline stagger, crowned by a crimson compute sheen',
    tracks: [
      {
        on: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        stagger: 2,
        keys: popIn(10, 0.74),
      },
    ],
    props: [
      sheen('<rect x="1" y="4" width="22" height="16" rx="2"/>', 36, 62, 0.3),
      boltFlash(19.2, 6.0, '#F87171', 42, 66),
    ],
  },

  solana: {
    story:
      'Solana three slanted ledger bars slide in from alternating sides in parallel consensus as a proof-of-history packet streaks across',
    tracks: [
      { on: 0, keys: slideIn(10, -2.6, 0) },
      { on: 1, keys: slideIn(16, 2.6, 0) },
      { on: 2, keys: slideIn(22, -2.6, 0) },
    ],
    props: [
      packet(3.0, 12.0, 21.0, 12.0, '#9945FF', 28, 56, 0.9),
      pulseRing(12, 12, 10.4, '#14F195', 34, 66, { layer: 'under', sw: 0.5 }),
    ],
  },

  ethereum: {
    story:
      'Ethereum upper and lower octahedral crystal halves levitate slightly then snap into smart-contract consensus with a violet pulse ring',
    tracks: [
      { on: 0, keys: dropIn(10, -2.0) },
      { on: 1, keys: riseIn(16, 2.0) },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#A78BFA', 28, 62, { layer: 'under', sw: 0.55 }),
      spark(12.0, 3.0, 0, -1.5, '#C4B5FD', 34, 58),
    ],
  },

  polygon: {
    story:
      'Polygon interlocking infinity hexagon traces its L2 zk-rollup perimeter and fires dual cross-chain bridge packets',
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
      packet(4.5, 12.0, 19.5, 12.0, '#A855F7', 34, 58, 0.85),
      pulseRing(12, 12, 10.4, '#C084FC', 36, 66, { layer: 'under', sw: 0.5 }),
    ],
  },

  optimism: {
    story:
      'Optimism bold red OP emblem pops into optimistic-rollup readiness while its letterforms settle with a verification check flash',
    tracks: [
      { on: 0, origin: [12, 12], keys: popIn(10, 0.84) },
      { on: 1, origin: [12, 12], keys: slideIn(18, -1.8, 0) },
      { on: 2, origin: [12, 12], keys: slideIn(22, 1.8, 0) },
    ],
    props: [
      checkFlash(18.0, 5.5, '#FCA5A5', 36, 62),
      pulseRing(12, 12, 10.5, '#FF0420', 30, 64, { layer: 'under', sw: 0.5 }),
    ],
  },

  wagmi: {
    story:
      'wagmi twin React-Web3 chevrons sync with wallet-connect packets and a crisp hook-ready spark',
    tracks: [
      { on: 0, keys: slideIn(10, -2.2, 0) },
      { on: 1, keys: slideIn(18, 2.2, 0) },
    ],
    props: [
      packet(4.5, 12.0, 19.5, 12.0, '#38BDF8', 28, 54, 0.85),
      spark(18.6, 5.4, 1.4, -1.4, '#E2E8F0', 36, 60),
    ],
  },

  ethers: {
    story:
      'Ethers.js geometric wing emblem draws its lightweight provider contour and sweeps a clean JSON-RPC sheen',
    tracks: [
      {
        on: 0,
        draw: [10, 34],
        fill: [28, 40],
        width: 0.65,
        keys: sway(16, 4, 0.5),
      },
    ],
    props: [
      sheen('<rect x="2" y="2" width="20" height="20" rx="3"/>', 34, 62, 0.3),
      pulseRing(12, 12, 10.2, '#60A5FA', 28, 62, { layer: 'under', sw: 0.5 }),
    ],
  },
};
