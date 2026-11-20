// Developer Tools stories: all 92 non-pilot icons in the Developer tools category.
// Every story lives strictly inside the 6%..72% window (T = 4.8s), returning to
// the clean, authentic logo at 0%..6% and 72%..100%.

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
  // ── Version Control & Forges ───────────────────────────────────────────────

  github: {
    story:
      'GitHub Octocat gives a welcoming nod as a pull-request merge packet arcs into the repo and confirms with a crisp green check',
    tracks: [
      {
        on: 'all',
        origin: '50% 70%',
        keys: {
          12: { r: -4.5, y: 0.4, e: 'inout' },
          28: { r: 3.5, y: -0.45, e: 'inout' },
          44: { r: -1.5, y: 0.15, e: 'settle' },
          60: { r: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(4.5, 6.0, 12.0, 8.2, '#A78BFA', 14, 42, 0.95),
      pulseRing(12, 12, 9.6, '#94A3B8', 24, 56, { sw: 0.55 }),
      checkFlash(16.8, 5.2, '#4ADE80', 40, 66),
    ],
  },

  gitlab: {
    story:
      'GitLab Tanuki fox facets interlock from left, right, and chin as a DevSecOps pipeline pulse sweeps across the badge',
    groups: {
      base: [0, 1],
      leftCheek: 2,
      rightCheek: 3,
      chin: 4,
    },
    tracks: [
      {
        on: 'base',
        keys: {
          10: { s: 0.95, e: 'inout' },
          30: { s: 1.03, e: 'settle' },
          58: { s: 1, e: 'out' },
        },
      },
      { on: 'leftCheek', keys: slideIn(14, -2.4, -0.6) },
      { on: 'rightCheek', keys: slideIn(18, 2.4, -0.6) },
      { on: 'chin', keys: riseIn(22, 2.2) },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#FCA326', 28, 58, { sw: 0.6 }),
      spark(18.5, 5.2, 1.8, -1.6, '#FDE047', 38, 60),
    ],
  },

  bitbucket: {
    story:
      'Bitbucket vessel tilts slightly to catch a blue commit droplet as enterprise CI/CD sync ripples beneath',
    groups: {
      bucket: 0,
      inner: 2,
    },
    tracks: [
      {
        on: 'bucket',
        origin: '50% 60%',
        keys: {
          12: { r: -4, y: 0.3, e: 'inout' },
          30: { r: 3.5, y: -0.3, e: 'inout' },
          48: { r: -1, y: 0.1, e: 'settle' },
          62: { r: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'inner',
        keys: {
          20: { s: 0.88, y: -0.6, e: 'in' },
          36: { s: 1.06, y: 0.2, e: 'settle' },
          54: { s: 1, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(12.0, 3.2, 12.0, 12.2, '#60A5FA', 12, 38, 1.0),
      pulseRing(12, 12, 9.4, '#38BDF8', 32, 62, { sw: 0.55 }),
    ],
  },

  gitea: {
    story:
      'Gitea teacup rocks warmly as curling commit steam rises above the brim and a self-hosted repo pulse settles',
    tracks: [
      {
        on: 'all',
        origin: '50% 70%',
        keys: sway(12, 5, 0.45),
      },
    ],
    props: [
      {
        layer: 'over',
        svg: '<path d="M9.6 7.2 Q8.8 5.4 9.8 3.8 M13.4 7.0 Q12.6 5.2 13.6 3.6" fill="none" stroke="#86EFAC" stroke-width="0.65" stroke-linecap="round"/>',
        keys: {
          14: { y: 1.4, o: 0, e: 'out' },
          28: { y: 0, o: 0.9, e: 'inout' },
          48: { y: -1.2, o: 0.75, e: 'out' },
          62: { y: -2.0, o: 0, e: 'out' },
        },
      },
      pulseRing(12, 13, 9.2, '#86EFAC', 26, 58, { sw: 0.5 }),
    ],
  },

  codeberg: {
    story:
      'Codeberg iceberg peak rises steadily from the waterline as its shadowed facet aligns and a summit glint sparkles',
    groups: {
      peak: 1,
      shadow: 0,
    },
    tracks: [
      { on: 'peak', keys: riseIn(10, 2.6) },
      { on: 'shadow', keys: slideIn(18, 2.0, 1.4) },
    ],
    props: [waveLine(20.6, '#60A5FA', 12, 62), spark(12.2, 3.6, 1.4, -1.4, '#E0F2FE', 38, 60)],
  },

  gitkraken: {
    story:
      'GitKraken mascot bobs through a commit tide as twin branch packets converge cleanly without merge conflicts',
    tracks: [
      {
        on: 'all',
        origin: '50% 60%',
        keys: sway(10, 6, 0.6),
      },
    ],
    props: [
      waveLine(21.0, '#2DD4BF', 10, 62),
      packet(5.2, 6.2, 12.0, 10.5, '#5EEAD4', 16, 44, 0.9),
      packet(18.8, 6.2, 12.0, 10.5, '#99F6E4', 20, 48, 0.9),
      checkFlash(16.5, 4.8, '#5EEAD4', 44, 66),
    ],
  },

  subversion: {
    story:
      'Apache Subversion layered revision ribbons slide into chronological alignment like centralized trunk commits locking in',
    groups: {
      top1: 0,
      top2: 1,
      bot1: 2,
      bot2: 3,
    },
    tracks: [
      { on: 'top1', keys: slideIn(10, -2.8, 0) },
      { on: 'top2', keys: slideIn(16, 2.8, 0) },
      { on: 'bot1', keys: slideIn(22, -2.8, 0) },
      { on: 'bot2', keys: slideIn(28, 2.8, 0) },
    ],
    props: [pulseRing(12, 12, 9.6, '#93C5FD', 34, 64, { sw: 0.55 })],
  },

  mercurial: {
    story:
      'Mercurial liquid-metal droplet shimmers with a fluid wobble while a distributed changeset ripple expands outward',
    tracks: [
      {
        on: 'all',
        origin: '50% 55%',
        keys: {
          12: { sx: 0.93, sy: 1.07, r: -3, e: 'inout' },
          28: { sx: 1.07, sy: 0.94, r: 3, e: 'inout' },
          44: { sx: 0.97, sy: 1.03, r: -1.5, e: 'settle' },
          60: { sx: 1, sy: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.2, '#CBD5E1', 20, 56, { sw: 0.6 }),
      spark(17.5, 5.2, 1.6, -1.6, '#E2E8F0', 34, 56),
    ],
  },

  perforce: {
    story:
      'Helix Core dual interlocking arcs counter-rotate and clamp together around a high-speed large-asset sync pulse',
    groups: {
      rightArc: 0,
      leftArc: 1,
    },
    tracks: [
      {
        on: 'rightArc',
        origin: [12, 12],
        keys: {
          12: { r: 16, x: 1.6, e: 'inout' },
          34: { r: -4, x: -0.2, e: 'settle' },
          54: { r: 0, x: 0, e: 'out' },
        },
      },
      {
        on: 'leftArc',
        origin: [12, 12],
        keys: {
          12: { r: -16, x: -1.6, e: 'inout' },
          34: { r: 4, x: 0.2, e: 'settle' },
          54: { r: 0, x: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 5.5, '#C4B5FD', 26, 58, { sw: 0.65 }),
      radar(12, 12, 10.2, '#A78BFA', 14, 62, 110),
    ],
  },

  // ── Editors & IDEs ─────────────────────────────────────────────────────────

  vscode: {
    story:
      'VS Code folded infinity ribbon weaves its upper and lower wings into the right spine as a build sheen sweeps and cursor caret blinks',
    groups: {
      upperWing: 0,
      lowerWing: 1,
      spine: 2,
    },
    tracks: [
      {
        on: 'upperWing',
        keys: slideIn(10, -2.6, -1.4),
      },
      {
        on: 'lowerWing',
        keys: slideIn(16, -2.6, 1.4),
      },
      {
        on: 'spine',
        keys: {
          14: { x: 2.2, sy: 0.85, o: 0.35, e: 'inout' },
          32: { x: -0.2, sy: 1.04, o: 1, e: 'settle' },
          46: { x: 0, sy: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="1.5" y="1.5" width="21" height="21" rx="2"/>', 38, 64, 0.25),
      checkFlash(4.2, 4.8, '#38BDF8', 42, 66),
    ],
  },

  neovim: {
    story:
      'Neovim twin vertical pillars glide into place as the diagonal slash binds the N and a modal Normal-mode block cursor pulses',
    groups: {
      leftBar: 0,
      rightBar: 2,
      slash: 4,
      fold: 6,
    },
    tracks: [
      { on: 'leftBar', keys: dropIn(10, 2.8) },
      { on: 'rightBar', keys: riseIn(14, 2.8) },
      {
        on: 'slash',
        keys: {
          18: { s: 0.82, o: 0.3, e: 'in' },
          34: { s: 1.05, o: 1, e: 'settle' },
          48: { s: 1, o: 1, e: 'out' },
        },
      },
      {
        on: 'fold',
        keys: {
          20: { o: 0.2, e: 'in' },
          36: { o: 1, e: 'out' },
        },
      },
    ],
    props: [
      {
        layer: 'over',
        svg: '<rect x="17.2" y="17.5" width="2.4" height="3.2" rx="0.4" fill="#86EFAC"/>',
        keys: {
          38: { o: 0, e: 'linear' },
          42: { o: 0.95, e: 'linear' },
          48: { o: 0.15, e: 'linear' },
          54: { o: 0.95, e: 'linear' },
          64: { o: 0, e: 'out' },
        },
      },
    ],
  },

  intellijidea: {
    story:
      'IntelliJ IDEA radiant backdrop shards bloom behind the dark frame while I and J index in and the iconic prompt underscore blinks',
    groups: {
      backdrop: [0, 1, 2, 3],
      frame: 4,
      iChar: 5,
      jChar: 6,
      caret: 7,
    },
    tracks: [
      {
        on: 'backdrop',
        origin: [12, 12],
        keys: {
          10: { s: 0.9, r: -6, e: 'inout' },
          28: { s: 1.04, r: 2, e: 'settle' },
          54: { s: 1, r: 0, e: 'out' },
        },
      },
      { on: 'iChar', keys: popIn(16, 0.4) },
      { on: 'jChar', keys: popIn(22, 0.4) },
      {
        on: 'caret',
        keys: {
          32: { o: 0.1, e: 'linear' },
          38: { o: 1, e: 'linear' },
          46: { o: 0.1, e: 'linear' },
          52: { o: 1, e: 'out' },
        },
      },
    ],
    props: [spark(19.2, 4.4, 1.5, -1.5, '#FB923C', 34, 56)],
  },

  cursor: {
    story:
      'Cursor isometric AI prism unfolds its shaded planes as an inline autocomplete spark darts across the top facet',
    groups: {
      bottom: 0,
      right: 1,
      left: 2,
      frontRight: 3,
      top: 4,
    },
    tracks: [
      { on: 'left', keys: slideIn(10, -2.0, -0.8) },
      { on: 'right', keys: slideIn(14, 2.0, -0.8) },
      { on: 'bottom', keys: riseIn(18, 2.0) },
      { on: 'frontRight', keys: slideIn(22, 1.4, 1.0) },
      {
        on: 'top',
        keys: {
          24: { y: -1.8, o: 0.35, e: 'inout' },
          40: { y: 0.15, o: 1, e: 'settle' },
          52: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(6.5, 9.2, 17.5, 9.2, '#38BDF8', 36, 62, 0.9),
      spark(17.6, 5.4, 1.5, -1.5, '#E2E8F0', 42, 64),
    ],
  },

  vim: {
    story:
      'Vim faceted green diamond snaps cleanly into command mode with a crisp block cursor blink and modal status pulse',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          10: { s: 0.88, r: -6, e: 'in' },
          26: { s: 1.06, r: 2, e: 'settle' },
          42: { s: 0.98, r: -1, e: 'inout' },
          58: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#4ADE80', 18, 52, { sw: 0.6 }),
      {
        layer: 'over',
        svg: '<rect x="16.4" y="16.4" width="2.6" height="3.2" rx="0.3" fill="#86EFAC"/>',
        keys: {
          34: { o: 0, e: 'linear' },
          38: { o: 0.95, e: 'linear' },
          45: { o: 0.15, e: 'linear' },
          51: { o: 0.95, e: 'linear' },
          62: { o: 0, e: 'out' },
        },
      },
    ],
  },

  zedindustries: {
    story:
      'Zed Rust-powered multiplayer editor flashes a high-framerate sheen across its Z-frame while a collaborator cursor pings',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          10: { s: 0.92, e: 'in' },
          24: { s: 1.06, e: 'settle' },
          44: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="1.8" y="1.8" width="20.4" height="20.4" rx="2"/>', 18, 48, 0.3),
      packet(5.4, 7.0, 18.2, 16.8, '#60A5FA', 26, 56, 0.95),
      pulseRing(18.2, 16.8, 2.2, '#93C5FD', 44, 66, { layer: 'over', sw: 0.6 }),
    ],
  },

  pycharm: {
    story:
      'PyCharm emerald-and-gold backdrop blooms behind the dark tile as P and C resolve Python imports and the underscore cursor blinks',
    groups: {
      backdrop: [0, 1, 2],
      frame: 3,
      cChar: 4,
      pChar: 5,
      caret: 6,
    },
    tracks: [
      {
        on: 'backdrop',
        origin: [12, 12],
        keys: {
          10: { s: 0.9, r: 5, e: 'inout' },
          28: { s: 1.04, r: -2, e: 'settle' },
          54: { s: 1, r: 0, e: 'out' },
        },
      },
      { on: 'pChar', keys: popIn(16, 0.4) },
      { on: 'cChar', keys: popIn(22, 0.4) },
      {
        on: 'caret',
        keys: {
          32: { o: 0.1, e: 'linear' },
          38: { o: 1, e: 'linear' },
          46: { o: 0.1, e: 'linear' },
          52: { o: 1, e: 'out' },
        },
      },
    ],
    props: [spark(19.0, 4.8, 1.5, -1.5, '#4ADE80', 34, 58)],
  },

  webstorm: {
    story:
      'WebStorm electric cyan backdrop surges while W and S snap into the IDE frame and the prompt caret blinks with a TypeScript check',
    groups: {
      backdrop: [0, 1, 2],
      frame: 3,
      wChar: 4,
      sChar: 5,
      caret: 6,
    },
    tracks: [
      {
        on: 'backdrop',
        origin: [12, 12],
        keys: {
          10: { s: 0.9, r: -5, e: 'inout' },
          28: { s: 1.04, r: 2, e: 'settle' },
          54: { s: 1, r: 0, e: 'out' },
        },
      },
      { on: 'wChar', keys: popIn(16, 0.4) },
      { on: 'sChar', keys: popIn(22, 0.4) },
      {
        on: 'caret',
        keys: {
          32: { o: 0.1, e: 'linear' },
          38: { o: 1, e: 'linear' },
          46: { o: 0.1, e: 'linear' },
          52: { o: 1, e: 'out' },
        },
      },
    ],
    props: [boltFlash(18.6, 3.8, '#38BDF8', 32, 58)],
  },

  androidstudio: {
    story:
      'Android Studio green mascot peeks over the drafting compass while the blue caliper legs swing inward to measure a build',
    groups: {
      android: [3, 5],
      compass: [0, 1, 2, 4, 6],
    },
    tracks: [
      {
        on: 'android',
        keys: {
          12: { y: 1.6, o: 0.35, e: 'out' },
          28: { y: -0.4, o: 1, e: 'settle' },
          46: { y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'compass',
        origin: [12, 8],
        keys: {
          16: { r: -7, s: 0.95, e: 'inout' },
          34: { r: 5, s: 1.03, e: 'inout' },
          52: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 13, 9.2, '#3DDC84', 28, 60, { sw: 0.55 })],
  },

  xcode: {
    story:
      'Xcode drafting hammer swings down with a crisp build tap on the blueprint while a Swift compilation ring radiates outward',
    tracks: [
      {
        on: 'all',
        origin: '55% 65%',
        keys: {
          12: { r: -10, y: -0.5, e: 'inout' },
          24: { r: 6, y: 0.4, e: 'settle' },
          34: { r: -6, y: -0.3, e: 'inout' },
          46: { r: 3, y: 0.2, e: 'settle' },
          60: { r: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(11.5, 12.5, 9.4, '#60A5FA', 22, 54, { sw: 0.6 }),
      spark(17.8, 5.2, 1.6, -1.6, '#93C5FD', 24, 46),
      checkFlash(16.6, 17.6, '#38BDF8', 42, 66),
    ],
  },

  visualstudio: {
    story:
      'Visual Studio purple infinity ribbon interlocks its upper and lower loops between twin spines as a .NET compile sheen sweeps',
    groups: {
      leftSpine: 0,
      upperBand: 1,
      lowerBand: 2,
      rightSpine: [3, 4],
      overlay: 5,
    },
    tracks: [
      { on: 'leftSpine', keys: slideIn(10, -2.0, 0) },
      { on: 'upperBand', keys: slideIn(14, -1.8, -1.4) },
      { on: 'lowerBand', keys: slideIn(18, -1.8, 1.4) },
      { on: 'rightSpine', keys: slideIn(22, 2.2, 0) },
      {
        on: 'overlay',
        keys: {
          20: { o: 0.35, e: 'in' },
          38: { o: 1, e: 'out' },
        },
      },
    ],
    props: [sheen('<rect x="1.5" y="1.5" width="21" height="21" rx="2"/>', 40, 66, 0.24)],
  },

  goland: {
    story:
      'GoLand vibrant backdrop shifts cleanly as G and O compile into the black tile and the prompt underscore blinks for a goroutine run',
    groups: {
      backdrop: [0, 1, 2],
      frame: 3,
      gChar: 4,
      oChar: 5,
      caret: 6,
    },
    tracks: [
      {
        on: 'backdrop',
        origin: [12, 12],
        keys: {
          10: { s: 0.9, r: 5, e: 'inout' },
          28: { s: 1.04, r: -2, e: 'settle' },
          54: { s: 1, r: 0, e: 'out' },
        },
      },
      { on: 'gChar', keys: popIn(16, 0.4) },
      { on: 'oChar', keys: popIn(22, 0.4) },
      {
        on: 'caret',
        keys: {
          32: { o: 0.1, e: 'linear' },
          38: { o: 1, e: 'linear' },
          46: { o: 0.1, e: 'linear' },
          52: { o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.0, '#2DD4BF', 26, 58, { sw: 0.55 })],
  },

  clion: {
    story:
      'CLion backdrop energizes as C and L link native symbols into the dark IDE frame while the bottom caret blinks',
    groups: {
      backdrop: [0, 1, 2],
      frame: 3,
      cChar: 4,
      lChar: 5,
      caret: 6,
    },
    tracks: [
      {
        on: 'backdrop',
        origin: [12, 12],
        keys: {
          10: { s: 0.9, r: -5, e: 'inout' },
          28: { s: 1.04, r: 2, e: 'settle' },
          54: { s: 1, r: 0, e: 'out' },
        },
      },
      { on: 'cChar', keys: popIn(16, 0.4) },
      { on: 'lChar', keys: popIn(22, 0.4) },
      {
        on: 'caret',
        keys: {
          32: { o: 0.1, e: 'linear' },
          38: { o: 1, e: 'linear' },
          46: { o: 0.1, e: 'linear' },
          52: { o: 1, e: 'out' },
        },
      },
    ],
    props: [spark(18.8, 4.8, 1.5, -1.5, '#F472B6', 34, 58)],
  },

  rider: {
    story:
      'Rider crimson-and-blue backdrop sweeps in as R and D snap into the frame for a fast .NET and game-engine hot reload',
    groups: {
      backdrop: [0, 1, 2],
      frame: 3,
      rChar: 4,
      dChar: 5,
      caret: 6,
    },
    tracks: [
      {
        on: 'backdrop',
        origin: [12, 12],
        keys: {
          10: { s: 0.9, r: 6, e: 'inout' },
          28: { s: 1.04, r: -2, e: 'settle' },
          54: { s: 1, r: 0, e: 'out' },
        },
      },
      { on: 'rChar', keys: popIn(16, 0.4) },
      { on: 'dChar', keys: popIn(22, 0.4) },
      {
        on: 'caret',
        keys: {
          32: { o: 0.1, e: 'linear' },
          38: { o: 1, e: 'linear' },
          46: { o: 0.1, e: 'linear' },
          52: { o: 1, e: 'out' },
        },
      },
    ],
    props: [boltFlash(18.8, 3.8, '#60A5FA', 30, 56)],
  },

  phpstorm: {
    story:
      'PhpStorm violet backdrop blooms behind the dark square as P and S settle in and the underscore prompt blinks',
    groups: {
      backdrop: [0, 1, 2],
      frame: 3,
      sChar: 4,
      pChar: 5,
      caret: 6,
    },
    tracks: [
      {
        on: 'backdrop',
        origin: [12, 12],
        keys: {
          10: { s: 0.9, r: -6, e: 'inout' },
          28: { s: 1.04, r: 2, e: 'settle' },
          54: { s: 1, r: 0, e: 'out' },
        },
      },
      { on: 'pChar', keys: popIn(16, 0.4) },
      { on: 'sChar', keys: popIn(22, 0.4) },
      {
        on: 'caret',
        keys: {
          32: { o: 0.1, e: 'linear' },
          38: { o: 1, e: 'linear' },
          46: { o: 0.1, e: 'linear' },
          52: { o: 1, e: 'out' },
        },
      },
    ],
    props: [spark(18.8, 4.6, 1.5, -1.5, '#D8B4FE', 34, 58)],
  },

  sublimetext: {
    story:
      'Sublime Text layered orange S-ribbon glides with a snappy multi-selection tilt and catches a crisp warm sheen',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          12: { r: -6, s: 0.93, e: 'inout' },
          28: { r: 4, s: 1.05, e: 'settle' },
          46: { r: -1, s: 1, e: 'inout' },
          60: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="3" y="1" width="18" height="22" rx="2"/>', 24, 54, 0.3),
      spark(17.2, 4.6, 1.5, -1.5, '#FCD34D', 38, 60),
    ],
  },

  gnuemacs: {
    story:
      'GNU Emacs purple medallion turns gently while the calligraphic Lisp E traces its stroke and pulses with a keychord spark',
    groups: {
      disc: 0,
      glyph: 1,
    },
    tracks: [
      {
        on: 'disc',
        origin: [12, 12],
        keys: {
          12: { r: -14, s: 0.95, e: 'inout' },
          38: { r: 8, s: 1.03, e: 'settle' },
          60: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'glyph',
        draw: [12, 36],
        fill: [28, 40],
        width: 0.65,
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#C4B5FD', 34, 64, { sw: 0.55 })],
  },

  eclipseide: {
    story:
      'Eclipse lunar crescent glides smoothly over the striped solar sphere as horizontal scan lines align into totality',
    groups: {
      crescent: 0,
      topArc: 1,
      bars: [2, 3],
      botArc: 4,
    },
    tracks: [
      {
        on: 'crescent',
        keys: {
          10: { x: -2.6, o: 0.45, e: 'inout' },
          32: { x: 0.3, o: 1, e: 'settle' },
          48: { x: 0, o: 1, e: 'out' },
        },
      },
      { on: 'topArc', keys: dropIn(14, 1.8) },
      {
        on: 'bars',
        stagger: 5,
        keys: slideIn(20, 2.6, 0),
      },
      { on: 'botArc', keys: riseIn(16, 1.8) },
    ],
    props: [pulseRing(13.1, 12, 9.4, '#C4B5FD', 34, 64, { sw: 0.55 })],
  },

  apachenetbeanside: {
    story:
      'Apache NetBeans isometric hexagon cube tilts with a crisp modular settle while a plugin-platform ring orbits around it',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          12: { r: -10, s: 0.92, e: 'inout' },
          30: { r: 8, s: 1.05, e: 'settle' },
          48: { r: -2, s: 1, e: 'inout' },
          62: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [radar(12, 12, 10.2, '#60A5FA', 14, 62, 120), checkFlash(16.6, 5.0, '#4ADE80', 40, 66)],
  },

  helix: {
    story:
      'Helix double-helix strands counter-glide and interleave cleanly while Tree-sitter selection sparks blink along the curve',
    groups: {
      topPurple: 0,
      botCyan: 1,
      midCyan: 2,
      midViolet: 3,
    },
    tracks: [
      { on: 'topPurple', keys: slideIn(10, -2.4, -1.0) },
      { on: 'botCyan', keys: slideIn(14, 2.4, 1.0) },
      { on: 'midCyan', keys: slideIn(18, 2.2, -0.8) },
      { on: 'midViolet', keys: slideIn(22, -2.2, 0.8) },
    ],
    props: [
      pulseRing(12, 12, 9.5, '#67E8F9', 30, 60, { sw: 0.55 }),
      spark(17.8, 5.5, 1.4, -1.4, '#C4B5FD', 40, 62),
    ],
  },

  // ── AI Coding Assistants ───────────────────────────────────────────────────

  githubcopilot: {
    story:
      'GitHub Copilot aviator visor tilts attentively while its twin eyes blink in sync and an AI code-completion spark lights up',
    groups: {
      visor: 0,
      eyes: [1, 2],
    },
    tracks: [
      {
        on: 'visor',
        origin: '50% 60%',
        keys: nod(14, 5.5),
      },
      {
        on: 'eyes',
        each: true,
        keys: {
          26: { sy: 1, e: 'in' },
          32: { sy: 0.14, e: 'out' },
          38: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(18.6, 4.4, 1.6, -1.6, '#38BDF8', 36, 58),
      pulseRing(12, 12, 9.8, '#93C5FD', 24, 58, { sw: 0.55 }),
    ],
  },

  // ── Terminals & Shells ─────────────────────────────────────────────────────

  tmux: {
    story:
      'tmux splits its terminal into side-by-side workspace panes above the green status bar as a detached session prompt blinks',
    groups: {
      statusBar: [0, 1],
      rightPane: 2,
      leftPane: 3,
    },
    tracks: [
      { on: 'leftPane', keys: slideIn(10, -2.2, 0) },
      { on: 'rightPane', keys: slideIn(16, 2.4, 0) },
      {
        on: 'statusBar',
        keys: {
          22: { y: 1.8, o: 0.35, e: 'out' },
          36: { y: -0.15, o: 1, e: 'settle' },
          48: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      {
        layer: 'over',
        svg: '<rect x="5.2" y="6.0" width="2.2" height="2.8" rx="0.3" fill="#4ADE80"/>',
        keys: {
          34: { o: 0, e: 'linear' },
          38: { o: 0.95, e: 'linear' },
          45: { o: 0.15, e: 'linear' },
          51: { o: 0.95, e: 'linear' },
          62: { o: 0, e: 'out' },
        },
      },
    ],
  },

  zsh: {
    story:
      'Zsh orange prompt chevron slides into the shell frame while the command underscore blinks twice and fires a plugin completion spark',
    groups: {
      prompt: [0, 1, 2],
      cursor: 3,
      frame: [4, 5, 6],
    },
    tracks: [
      {
        on: 'frame',
        keys: {
          10: { s: 0.95, e: 'inout' },
          26: { s: 1.03, e: 'settle' },
          50: { s: 1, e: 'out' },
        },
      },
      { on: 'prompt', keys: slideIn(14, -2.2, 0) },
      {
        on: 'cursor',
        keys: {
          26: { o: 0.1, e: 'linear' },
          32: { o: 1, e: 'linear' },
          40: { o: 0.1, e: 'linear' },
          46: { o: 1, e: 'out' },
        },
      },
    ],
    props: [spark(17.8, 5.4, 1.5, -1.5, '#FB923C', 42, 64)],
  },

  powershell: {
    story:
      'PowerShell slanted console tilts into action as the white command chevron nudges forward and its pipeline underscore blinks',
    groups: {
      window: [0, 1],
      chevron: [3, 4],
      bar: [2, 5],
    },
    tracks: [
      {
        on: 'window',
        origin: [12, 12],
        keys: {
          10: { r: -3, s: 0.95, e: 'inout' },
          28: { r: 2, s: 1.03, e: 'settle' },
          52: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'chevron',
        keys: {
          14: { x: -1.6, e: 'inout' },
          30: { x: 0.9, e: 'settle' },
          48: { x: 0, e: 'out' },
        },
      },
      {
        on: 'bar',
        keys: {
          32: { o: 0.15, e: 'linear' },
          38: { o: 1, e: 'linear' },
          46: { o: 0.15, e: 'linear' },
          52: { o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.0, '#93C5FD', 26, 58, { sw: 0.55 })],
  },

  alacritty: {
    story:
      'Alacritty GPU-accelerated A-crest frames its inner diamond flame as it ignites with a crisp thermal pulse',
    groups: {
      crest: 0,
      flame: 1,
    },
    tracks: [
      {
        on: 'crest',
        keys: {
          10: { y: -1.2, s: 0.94, e: 'inout' },
          28: { y: 0.2, s: 1.03, e: 'settle' },
          50: { y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'flame',
        origin: '50% 60%',
        keys: {
          18: { s: 0.55, y: 1.2, e: 'in' },
          34: { s: 1.18, y: -0.4, e: 'settle' },
          52: { s: 1, y: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 16.5, 4.2, '#FBBF24', 28, 58, { layer: 'over', sw: 0.6 })],
  },

  warp: {
    story:
      'Warp twin velocity wings shear past each other in a Rust-powered terminal warp jump with an electric cyan trail',
    groups: {
      rightWing: 0,
      leftWing: 1,
    },
    tracks: [
      {
        on: 'rightWing',
        keys: {
          12: { x: 2.6, y: -1.4, o: 0.35, e: 'inout' },
          32: { x: -0.25, y: 0.15, o: 1, e: 'settle' },
          48: { x: 0, y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'leftWing',
        keys: {
          16: { x: -2.6, y: 1.4, o: 0.35, e: 'inout' },
          36: { x: 0.25, y: -0.15, o: 1, e: 'settle' },
          52: { x: 0, y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(4.2, 18.0, 19.6, 6.0, '#38BDF8', 24, 54, 0.95),
      spark(18.5, 4.8, 1.6, -1.4, '#7DD3FC', 40, 62),
    ],
  },

  starship: {
    story:
      'Starship rocket lifts inside its magenta crest as exhaust plumes flare beneath and a prompt star twinkles overhead',
    groups: {
      crest: 0,
      star: 1,
      rocket: 2,
      exhaust: 3,
    },
    tracks: [
      {
        on: 'crest',
        keys: breathe(10, 0.04),
      },
      {
        on: 'rocket',
        keys: {
          14: { y: 1.4, x: -0.6, e: 'inout' },
          34: { y: -1.6, x: 0.7, e: 'settle' },
          54: { y: 0, x: 0, e: 'out' },
        },
      },
      {
        on: 'exhaust',
        origin: '50% 0%',
        keys: {
          16: { s: 0.65, o: 0.4, e: 'in' },
          32: { s: 1.25, o: 1, e: 'settle' },
          52: { s: 1, o: 1, e: 'out' },
        },
      },
      {
        on: 'star',
        keys: {
          20: { s: 0.5, r: -45, e: 'in' },
          38: { s: 1.3, r: 20, e: 'settle' },
          56: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.0, '#F472B6', 24, 58, { sw: 0.55 })],
  },

  wezterm: {
    story:
      'WezTerm command chevron nudges forward as the GPU-rendered W-glyph snaps in with a crisp violet multiplexer pulse',
    groups: {
      prompt: 0,
      wGlyph: 1,
    },
    tracks: [
      { on: 'prompt', keys: slideIn(10, -2.6, 0) },
      { on: 'wGlyph', keys: slideIn(18, 2.6, 0) },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#818CF8', 28, 60, { sw: 0.55 }),
      spark(18.6, 4.8, 1.4, -1.4, '#A5B4FC', 40, 62),
    ],
  },

  iterm2: {
    story:
      'iTerm2 bezel frames the console as split-pane guides briefly appear and a green shell cursor blinks inside',
    groups: {
      bezel: 0,
      screen: 1,
    },
    tracks: [
      { on: 'bezel', keys: breathe(10, 0.04) },
      {
        on: 'screen',
        keys: {
          14: { s: 0.94, e: 'inout' },
          30: { s: 1.03, e: 'settle' },
          50: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      guides(
        [
          [12, 4.2, 12, 19.8],
          [4.2, 12, 19.8, 12],
        ],
        '#4ADE80',
        16,
        56
      ),
      {
        layer: 'over',
        svg: '<rect x="6.4" y="6.4" width="2.2" height="3.0" rx="0.3" fill="#4ADE80"/>',
        keys: {
          26: { o: 0, e: 'linear' },
          30: { o: 0.95, e: 'linear' },
          38: { o: 0.15, e: 'linear' },
          44: { o: 0.95, e: 'linear' },
          58: { o: 0, e: 'out' },
        },
      },
    ],
  },

  fishshell: {
    story:
      'fish shell ASCII-art fish wiggles its tail fins and glides forward as a smart autosuggestion dot trails behind',
    groups: {
      tail: [0, 1, 8],
      body: [2, 3, 4, 5],
      head: [6, 7],
    },
    tracks: [
      {
        on: 'body',
        origin: [12, 12],
        keys: sway(10, 4.5, 0.5),
      },
      {
        on: 'tail',
        origin: [16, 12],
        keys: {
          12: { r: -10, x: 0.4, e: 'inout' },
          28: { r: 10, x: -0.3, e: 'inout' },
          44: { r: -6, x: 0.2, e: 'inout' },
          58: { r: 0, x: 0, e: 'out' },
        },
      },
      {
        on: 'head',
        keys: {
          14: { x: -1.0, e: 'inout' },
          34: { x: 0.6, e: 'settle' },
          54: { x: 0, e: 'out' },
        },
      },
    ],
    props: [packet(2.8, 12.2, 9.0, 12.2, '#86EFAC', 24, 54, 0.85)],
  },

  // ── Package & Build Managers ───────────────────────────────────────────────

  npm: {
    story:
      'npm crimson package crate drops cleanly onto the registry shelf with a crisp spring settle and install-complete check',
    tracks: [
      {
        on: 'all',
        origin: '50% 100%',
        keys: {
          10: { y: -3.0, sx: 0.94, sy: 1.06, e: 'in' },
          24: { y: 0.4, sx: 1.07, sy: 0.92, e: 'settle' },
          38: { y: -0.3, sx: 0.98, sy: 1.02, e: 'inout' },
          52: { y: 0, sx: 1, sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="1.8" y="1.8" width="20.4" height="20.4" rx="1"/>', 30, 58, 0.26),
      checkFlash(16.6, 5.2, '#86EFAC', 40, 66),
    ],
  },

  pnpm: {
    story:
      'pnpm eight content-addressable store blocks cascade into a tight hard-link grid with a golden symlink spark',
    groups: {
      gold: [0, 1, 2, 3],
      dark: [4, 5, 6, 7],
    },
    tracks: [
      {
        on: 'gold',
        order: 'x',
        stagger: 3.5,
        each: true,
        keys: dropIn(10, 2.8),
      },
      {
        on: 'dark',
        order: '-x',
        stagger: 3.5,
        each: true,
        keys: riseIn(18, 2.8),
      },
    ],
    props: [spark(19.0, 4.6, 1.5, -1.5, '#FCD34D', 42, 64)],
  },

  yarn: {
    story:
      'Yarn cat tilts playfully inside the blue badge as a dependency-lock yarn thread orbits around the medallion rim',
    groups: {
      badge: 0,
      cat: 1,
    },
    tracks: [
      { on: 'badge', keys: breathe(10, 0.04) },
      {
        on: 'cat',
        origin: '50% 70%',
        keys: nod(16, 7),
      },
    ],
    props: [radar(12, 12, 10.4, '#7DD3FC', 12, 64, 150)],
  },

  homebrew: {
    story:
      'Homebrew beer stein raises in a cheerful toast as the frothy foam crown puffs up and golden brew bubbles rise',
    groups: {
      mug: [0, 2, 3, 6, 7, 8, 9],
      foam: [1, 4, 5],
    },
    tracks: [
      {
        on: 'mug',
        origin: '50% 80%',
        keys: sway(12, 6, 0.4),
      },
      {
        on: 'foam',
        origin: '50% 85%',
        keys: {
          14: { s: 0.9, y: 0.6, e: 'inout' },
          30: { s: 1.09, y: -0.6, e: 'settle' },
          48: { s: 0.98, y: 0.1, e: 'inout' },
          60: { s: 1, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(10.5, 18.0, 10.5, 9.0, '#FEF08A', 18, 46, 0.7),
      packet(13.0, 19.0, 13.0, 10.2, '#FDE047', 26, 54, 0.65),
    ],
  },

  cmake: {
    story:
      'CMake tri-color build pyramid converges its blue, red, and green faces around the central target core',
    groups: {
      blue: 0,
      green: 1,
      red: 2,
      core: 3,
    },
    tracks: [
      { on: 'blue', keys: slideIn(10, -2.2, -1.6) },
      { on: 'red', keys: slideIn(16, 2.2, -1.6) },
      { on: 'green', keys: riseIn(22, 2.2) },
      { on: 'core', keys: popIn(28, 0.4) },
    ],
    props: [pulseRing(12, 13.5, 9.4, '#93C5FD', 34, 64, { sw: 0.55 })],
  },

  gradle: {
    story:
      'Gradle elephant steps forward with a sturdy nod while a multi-project build-cache ring radiates beneath',
    tracks: [
      {
        on: 'all',
        origin: '50% 70%',
        keys: nod(14, 5.5),
      },
    ],
    props: [
      pulseRing(12, 13, 9.6, '#94A3B8', 22, 56, { sw: 0.6 }),
      checkFlash(16.8, 5.0, '#4ADE80', 40, 66),
    ],
  },

  apachemaven: {
    story:
      'Apache Maven crimson M-feather traces its POM build lifecycle and settles with a verified artifact check',
    tracks: [
      {
        on: 0,
        draw: [10, 36],
        fill: [28, 40],
        width: 0.65,
      },
      {
        on: 'all',
        keys: {
          32: { s: 0.96, e: 'inout' },
          46: { s: 1.04, e: 'settle' },
          60: { s: 1, e: 'out' },
        },
      },
    ],
    props: [checkFlash(16.5, 5.0, '#FDBA74', 42, 66)],
  },

  cargo: {
    story:
      'Cargo Rust shipping crate lowers its golden lid onto the side panels as structural seams trace and lock tight',
    groups: {
      lid: 0,
      leftFace: 1,
      rightFace: 2,
      seams: [3, 4, 5, 6],
    },
    tracks: [
      { on: 'leftFace', keys: slideIn(10, -2.0, 0.8) },
      { on: 'rightFace', keys: slideIn(14, 2.0, 0.8) },
      { on: 'lid', keys: dropIn(18, 2.8) },
      {
        on: 'seams',
        stagger: 3,
        keys: {
          24: { o: 0.25, e: 'in' },
          38: { o: 1, e: 'out' },
        },
      },
    ],
    props: [spark(18.6, 5.0, 1.5, -1.5, '#FDE047', 40, 62)],
  },

  uv: {
    story:
      'uv magenta badge fires a Rust-speed Python dependency resolution burst with twin lightning sparks',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          10: { s: 0.9, r: -4, e: 'in' },
          22: { s: 1.08, r: 3, e: 'settle' },
          36: { s: 0.97, r: -1, e: 'inout' },
          52: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      boltFlash(17.8, 3.6, '#F0ABFC', 18, 46),
      pulseRing(12, 12, 9.6, '#E879F9', 22, 54, { sw: 0.65 }),
    ],
  },

  poetry: {
    story:
      'Poetry layered cerulean curves unfurl like pages of pyproject.toml and settle with a clean lockfile sheen',
    groups: {
      layers: [0, 2, 4, 6, 8, 10],
    },
    tracks: [
      {
        on: 'layers',
        stagger: 3.5,
        each: true,
        keys: {
          10: { x: -1.8, y: 1.2, o: 0.35, e: 'inout' },
          26: { x: 0.2, y: -0.15, o: 1, e: 'settle' },
          36: { x: 0, y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [sheen('<rect x="2" y="1" width="20" height="22" rx="2"/>', 40, 66, 0.24)],
  },

  bazel: {
    story:
      'Bazel faceted green target blocks cascade downward from the top nodes to build a hermetic diamond graph',
    groups: {
      topNodes: [0, 2],
      midFacets: [1, 3, 4],
      base: [5, 6],
    },
    tracks: [
      { on: 'topNodes', order: 'x', stagger: 4, each: true, keys: dropIn(10, 2.8) },
      { on: 'midFacets', order: 'x', stagger: 3.5, each: true, keys: dropIn(18, 2.4) },
      { on: 'base', order: 'x', stagger: 4, each: true, keys: dropIn(28, 2.0) },
    ],
    props: [checkFlash(16.8, 17.6, '#86EFAC', 44, 66)],
  },

  pypi: {
    story:
      'PyPI isometric package tower lifts gently as a freshly built Python wheel drops cleanly into the registry index',
    tracks: [
      {
        on: 'all',
        origin: '50% 60%',
        keys: breathe(12, 0.06),
      },
    ],
    props: [
      packet(12.0, 2.2, 12.0, 9.2, '#FDE047', 14, 42, 1.0),
      pulseRing(12, 12, 9.8, '#60A5FA', 32, 62, { sw: 0.55 }),
    ],
  },

  condaforge: {
    story:
      'conda-forge anvil strikes with a crisp forging bounce and throws bright metallic sparks from a fresh recipe build',
    tracks: [
      {
        on: 'all',
        origin: '50% 80%',
        keys: {
          14: { y: -1.4, r: -4, e: 'in' },
          24: { y: 0.5, sx: 1.06, sy: 0.94, r: 0, e: 'settle' },
          38: { y: -0.2, sx: 0.99, sy: 1.01, e: 'inout' },
          52: { y: 0, sx: 1, sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(16.5, 6.2, 1.8, -1.8, '#FDE047', 22, 44),
      spark(7.5, 6.6, -1.8, -1.6, '#93C5FD', 26, 48),
    ],
  },

  nuget: {
    story:
      'NuGet .NET package cube bounces solidly into place as the corner dependency node pops in and links to the bundle',
    groups: {
      node: 0,
      cube: 1,
    },
    tracks: [
      { on: 'cube', keys: dropIn(10, 2.4) },
      { on: 'node', keys: popIn(24, 0.25) },
    ],
    props: [pulseRing(14.2, 13.9, 8.6, '#60A5FA', 30, 62, { sw: 0.55 })],
  },

  composer: {
    story:
      'Composer conductor sways gracefully with a baton rhythm as PHP dependency harmony rings ripple outward',
    tracks: [
      {
        on: 'all',
        origin: '50% 80%',
        keys: sway(10, 4.5, 0.45),
      },
    ],
    props: [
      pulseRing(12, 11, 9.6, '#FBBF24', 20, 54, { sw: 0.55 }),
      spark(18.0, 5.2, 1.4, -1.6, '#FDE68A', 34, 58),
    ],
  },

  rubygems: {
    story:
      'RubyGems faceted ruby glints inside its hexagonal frame as a crisp diamond sheen sweeps across the jewel',
    groups: {
      gem: 0,
      frame: 1,
    },
    tracks: [
      {
        on: 'frame',
        origin: [12, 12],
        keys: {
          10: { s: 0.93, r: -8, e: 'inout' },
          28: { s: 1.03, r: 2, e: 'settle' },
          50: { s: 1, r: 0, e: 'out' },
        },
      },
      { on: 'gem', keys: popIn(16, 0.45) },
    ],
    props: [
      sheen('<polygon points="12,1.5 21,6.8 21,17.2 12,22.5 3,17.2 3,6.8"/>', 34, 62, 0.3),
      spark(16.8, 5.2, 1.5, -1.5, '#FCA5A5', 42, 64),
    ],
  },

  cocoapods: {
    story:
      'CocoaPods twin halves slide together to encapsulate an iOS and Swift dependency with a warm coral pulse',
    groups: {
      pod: 0,
      bracket: 1,
    },
    tracks: [
      { on: 'pod', keys: slideIn(10, -2.4, 0) },
      { on: 'bracket', keys: slideIn(16, 2.4, 0) },
    ],
    props: [pulseRing(12, 12, 9.6, '#FCA5A5', 30, 62, { sw: 0.55 })],
  },

  conan: {
    story:
      'Conan C/C++ package cube locks in with a sturdy mechanical torque while a decentralized binary artifact ring expands',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: torque(12, 14, 24),
      },
    ],
    props: [radar(12, 12, 10.2, '#93C5FD', 14, 62, 110)],
  },

  vcpkg: {
    story:
      'vcpkg four interlocking amber ribbons converge inward from every quadrant to link cross-platform C++ libraries',
    groups: {
      top: 0,
      left: 1,
      bottom: 2,
      right: 3,
    },
    tracks: [
      { on: 'top', keys: dropIn(10, 2.4) },
      { on: 'left', keys: slideIn(14, -2.4, 0) },
      { on: 'bottom', keys: riseIn(18, 2.4) },
      { on: 'right', keys: slideIn(22, 2.4, 0) },
    ],
    props: [pulseRing(12, 12, 9.2, '#FBBF24', 34, 64, { sw: 0.55 })],
  },

  renovate: {
    story:
      'Renovate automated dependency loop turns smoothly while a fresh semver pull-request check pops into view',
    groups: {
      loop: 0,
      accent: 1,
    },
    tracks: [
      {
        on: 'loop',
        origin: [11, 10],
        keys: {
          12: { r: -18, e: 'inout' },
          36: { r: 24, e: 'settle' },
          58: { r: 0, e: 'out' },
        },
      },
      { on: 'accent', keys: popIn(22, 0.4) },
    ],
    props: [checkFlash(16.6, 5.0, '#4ADE80', 38, 66)],
  },

  dependabot: {
    story:
      'Dependabot robot scans dependency manifests with a synchronized double-eye blink and pops a green security-patch check',
    groups: {
      body: 0,
      eyes: [1, 2],
    },
    tracks: [
      { on: 'body', keys: nod(12, 5) },
      {
        on: 'eyes',
        each: true,
        keys: {
          24: { sy: 1, e: 'in' },
          30: { sy: 0.14, e: 'out' },
          36: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      checkFlash(16.8, 4.8, '#4ADE80', 38, 66),
      pulseRing(12, 12, 9.8, '#38BDF8', 26, 58, { sw: 0.55 }),
    ],
  },

  // ── Compilers & Toolchains ─────────────────────────────────────────────────

  gnu: {
    story:
      'GNU wildebeest gives a resolute nod as its horn and beard details sharpen with a classic GCC compilation pulse',
    groups: {
      head: 0,
      details: [1, 2, 3, 4, 5, 6, 7],
    },
    tracks: [
      { on: 'head', origin: '50% 60%', keys: nod(14, 5.5) },
      {
        on: 'details',
        stagger: 2.5,
        keys: {
          18: { s: 0.85, o: 0.4, e: 'in' },
          30: { s: 1.08, o: 1, e: 'settle' },
          40: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#F87171', 26, 60, { sw: 0.55 })],
  },

  llvm: {
    story:
      'LLVM wyvern dragon rears smoothly with a metallic sheen as an IR optimization pass sweeps across its wings',
    tracks: [
      {
        on: 'all',
        origin: '50% 65%',
        keys: {
          12: { r: -4, y: 0.6, s: 0.96, e: 'inout' },
          30: { r: 3, y: -0.6, s: 1.04, e: 'settle' },
          52: { r: 0, y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="1" y="4" width="22" height="16" rx="2"/>', 24, 56, 0.28),
      pulseRing(12, 12, 9.6, '#38BDF8', 30, 62, { sw: 0.55 }),
    ],
  },

  // ── Code Quality & Formatting ──────────────────────────────────────────────

  eslint: {
    story:
      'ESLint outer hexagon ratchets crisply around its inner rule-engine core before flashing a zero-warnings pass check',
    groups: {
      core: 0,
      ring: 1,
    },
    tracks: [
      {
        on: 'ring',
        origin: [12, 12],
        keys: {
          12: { r: -18, s: 0.94, e: 'inout' },
          34: { r: 12, s: 1.03, e: 'settle' },
          56: { r: 0, s: 1, e: 'out' },
        },
      },
      { on: 'core', keys: heartbeat(16, 0.12) },
    ],
    props: [checkFlash(16.6, 5.0, '#86EFAC', 40, 66)],
  },

  prettier: {
    story:
      'Prettier eight colorful code-line bars slide from ragged indentation into crisp aligned formatting with a clean check flash',
    groups: {
      leftBars: [0, 1, 2, 4, 5],
      rightBars: [3, 6, 7],
    },
    tracks: [
      {
        on: 'leftBars',
        order: 'y',
        stagger: 3.5,
        keys: {
          10: { x: -3.2, o: 0.45, e: 'inout' },
          24: { x: 0.25, o: 1, e: 'settle' },
          34: { x: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'rightBars',
        order: 'y',
        stagger: 4,
        keys: {
          16: { x: 3.0, o: 0.45, e: 'inout' },
          30: { x: -0.25, o: 1, e: 'settle' },
          40: { x: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      guides(
        [
          [2.5, 1.2, 2.5, 22.8],
          [2.5, 22.8, 21.5, 22.8],
        ],
        '#FDE047',
        10,
        52
      ),
      checkFlash(17.0, 20.2, '#4ADE80', 44, 66),
    ],
  },

  biome: {
    story:
      'Biome streamlined wave surges forward in a single-pass Rust lint and format sweep with a crisp pass check',
    tracks: [
      {
        on: 0,
        origin: '50% 60%',
        keys: {
          10: { x: -1.8, r: -4, s: 0.94, e: 'in' },
          26: { x: 0.4, r: 2, s: 1.05, e: 'settle' },
          46: { x: 0, r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="1" y="2" width="22" height="20" rx="2"/>', 22, 52, 0.28),
      checkFlash(16.6, 5.2, '#86EFAC', 40, 66),
    ],
  },

  ruff: {
    story:
      'Ruff neon-lime block fires a sub-millisecond Python lint burst with an electric yellow spark and spring settle',
    groups: {
      block: 0,
      accent: 1,
    },
    tracks: [
      {
        on: 'block',
        origin: [12, 12],
        keys: {
          10: { s: 0.9, r: -5, e: 'in' },
          22: { s: 1.08, r: 3, e: 'settle' },
          38: { s: 0.98, r: -1, e: 'inout' },
          54: { s: 1, r: 0, e: 'out' },
        },
      },
      { on: 'accent', keys: popIn(20, 0.3) },
    ],
    props: [
      boltFlash(17.8, 3.6, '#FEF08A', 18, 46),
      pulseRing(12, 12, 9.6, '#D7FF64', 24, 56, { sw: 0.6 }),
    ],
  },

  editorconfig: {
    story:
      'EditorConfig mouse badge rocks gently as its scroll indicator clicks to synchronize indent rules across editors',
    groups: {
      body: 0,
      wheel: 1,
    },
    tracks: [
      { on: 'body', origin: '50% 65%', keys: sway(12, 5, 0.4) },
      {
        on: 'wheel',
        keys: {
          20: { y: -1.0, e: 'inout' },
          34: { y: 1.0, e: 'inout' },
          48: { y: 0, e: 'out' },
        },
      },
    ],
    props: [
      guides(
        [
          [4, 6, 20, 6],
          [4, 18, 20, 18],
        ],
        '#CBD5E1',
        16,
        56
      ),
    ],
  },

  commitlint: {
    story:
      'commitlint validates a conventional commit header as its bracket bars align sequentially and a green pass check flashes',
    groups: {
      leftBrk: 1,
      midBrk: 0,
      topBar: 2,
      botBar: 3,
    },
    tracks: [
      { on: 'leftBrk', keys: slideIn(10, -2.4, 0) },
      { on: 'midBrk', keys: dropIn(15, 2.2) },
      { on: 'topBar', keys: slideIn(22, 2.6, 0) },
      { on: 'botBar', keys: slideIn(28, 2.6, 0) },
    ],
    props: [checkFlash(16.6, 5.4, '#4ADE80', 40, 66)],
  },

  // ── API & Network Tools ────────────────────────────────────────────────────

  postman: {
    story:
      'Postman orbital astronaut launches diagonally inside the orange disc as an HTTP request packet fires and returns 200 OK',
    groups: {
      disc: [0, 5],
      astronaut: [2, 3, 4, 6],
    },
    tracks: [
      { on: 'disc', keys: breathe(10, 0.04) },
      {
        on: 'astronaut',
        origin: [12, 12],
        keys: {
          12: { x: -1.6, y: 1.6, r: -6, e: 'inout' },
          30: { x: 1.2, y: -1.2, r: 5, e: 'settle' },
          48: { x: -0.2, y: 0.2, r: -1, e: 'inout' },
          60: { x: 0, y: 0, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(6.0, 18.0, 18.2, 5.8, '#FDE047', 16, 44, 0.95),
      checkFlash(16.6, 17.6, '#4ADE80', 42, 66),
    ],
  },

  insomnia: {
    story:
      'Insomnia crescent moon rocks serenely inside the violet disc while a REST and GraphQL ping ripples outward',
    groups: {
      disc: [0, 1],
      moon: 2,
    },
    tracks: [
      { on: 'disc', keys: breathe(10, 0.04) },
      {
        on: 'moon',
        origin: [12, 12],
        keys: {
          12: { r: -14, e: 'inout' },
          32: { r: 12, e: 'inout' },
          52: { r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#C4B5FD', 20, 56, { sw: 0.6 }),
      spark(17.6, 5.2, 1.4, -1.4, '#DDD6FE', 34, 58),
    ],
  },

  hoppscotch: {
    story:
      'Hoppscotch three API endpoint dots hop sequentially across the badge as a live response pulse lights up',
    groups: {
      frame: [0, 1, 2, 6],
      dot1: [3, 7],
      dot2: [4, 8],
      dot3: [5, 9],
    },
    tracks: [
      { on: 'frame', keys: breathe(10, 0.04) },
      {
        on: 'dot1',
        keys: {
          14: { y: 0, s: 1, e: 'out' },
          22: { y: -2.2, s: 1.25, e: 'inout' },
          32: { y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'dot2',
        keys: {
          22: { y: 0, s: 1, e: 'out' },
          30: { y: -2.2, s: 1.25, e: 'inout' },
          40: { y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'dot3',
        keys: {
          30: { y: 0, s: 1, e: 'out' },
          38: { y: -2.2, s: 1.25, e: 'inout' },
          48: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#4ADE80', 34, 64, { sw: 0.55 })],
  },

  curl: {
    story:
      'cURL protocol slashes lean forward in sequence while a data-transfer packet zips from the colon across the URL',
    groups: {
      colon: [0, 1],
      slash1: 2,
      slash2: 3,
    },
    tracks: [
      { on: 'colon', stagger: 4, each: true, keys: popIn(10, 0.35) },
      { on: 'slash1', keys: slideIn(16, -2.0, 0) },
      { on: 'slash2', keys: slideIn(22, -2.0, 0) },
    ],
    props: [packet(3.2, 11.8, 20.6, 11.8, '#38BDF8', 28, 58, 0.95)],
  },

  wireshark: {
    story:
      'Wireshark dorsal fin slices smoothly across the waterline as deep-packet sonar rings expand around the capture',
    tracks: [
      {
        on: 'all',
        origin: '50% 75%',
        keys: {
          10: { x: -2.2, r: -4, e: 'inout' },
          32: { x: 1.6, r: 3, e: 'inout' },
          54: { x: 0, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      waveLine(20.8, '#38BDF8', 10, 62),
      pulseRing(12, 12, 9.2, '#7DD3FC', 22, 56, { sw: 0.6 }),
    ],
  },

  bruno: {
    story:
      'Bruno the open-source API hound tilts his head, blinks both eyes, and wags his red tongue as a plaintext request fires',
    groups: {
      head: [0, 1, 2, 3],
      eyes: [4, 5],
      tongue: 6,
    },
    tracks: [
      { on: 'head', origin: '50% 60%', keys: nod(12, 5) },
      {
        on: 'eyes',
        each: true,
        keys: {
          24: { sy: 1, e: 'in' },
          30: { sy: 0.14, e: 'out' },
          36: { sy: 1, e: 'out' },
        },
      },
      {
        on: 'tongue',
        origin: '50% 0%',
        keys: {
          28: { r: -8, y: 0.4, e: 'inout' },
          40: { r: 8, y: 0.6, e: 'inout' },
          54: { r: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [packet(17.5, 6.0, 21.2, 3.2, '#FBBF24', 32, 58, 0.85)],
  },

  // ── Design & Prototyping ───────────────────────────────────────────────────

  sketch: {
    story:
      'Sketch golden vector diamond fans its faceted planes into crisp geometry and catches a specular sheen across the crown',
    groups: {
      base: 0,
      lowerFacets: [1, 2, 3],
      upperFacets: [4, 5, 6, 7, 8],
    },
    tracks: [
      { on: 'base', keys: breathe(10, 0.04) },
      {
        on: 'lowerFacets',
        order: 'x',
        stagger: 3.5,
        each: true,
        keys: riseIn(12, 2.0),
      },
      {
        on: 'upperFacets',
        order: 'x',
        stagger: 3,
        each: true,
        keys: dropIn(20, 2.0),
      },
    ],
    props: [
      sheen('<polygon points="5,2.5 19,2.5 22.8,9 12,21.5 1.2,9"/>', 38, 66, 0.32),
      spark(17.8, 4.2, 1.5, -1.5, '#FEF08A', 42, 64),
    ],
  },

  // ── 3D & Game Engines ──────────────────────────────────────────────────────

  blender: {
    story:
      'Blender orange three-arm aperture rotates smoothly around its blue viewport iris as a 3D render pulse blooms',
    groups: {
      iris: 0,
      arms: 2,
    },
    tracks: [
      {
        on: 'arms',
        origin: [15.5, 13.2],
        keys: {
          12: { r: -16, e: 'inout' },
          34: { r: 14, e: 'settle' },
          56: { r: 0, e: 'out' },
        },
      },
      { on: 'iris', keys: heartbeat(18, 0.14) },
    ],
    props: [pulseRing(15.5, 13.2, 6.2, '#60A5FA', 24, 58, { sw: 0.6 })],
  },

  unity: {
    story:
      'Unity three isometric cube faces expand slightly outward along their 3D axes and snap tightly back into a solid mesh',
    groups: {
      rightFace: 0,
      leftFace: 2,
      topFace: 3,
    },
    tracks: [
      {
        on: 'topFace',
        keys: {
          12: { y: -2.0, e: 'inout' },
          36: { y: 0.2, e: 'settle' },
          52: { y: 0, e: 'out' },
        },
      },
      {
        on: 'leftFace',
        keys: {
          14: { x: -1.8, y: 1.1, e: 'inout' },
          38: { x: 0.2, y: -0.1, e: 'settle' },
          54: { x: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'rightFace',
        keys: {
          16: { x: 1.8, y: 1.1, e: 'inout' },
          40: { x: -0.2, y: -0.1, e: 'settle' },
          56: { x: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#CBD5E1', 34, 64, { sw: 0.55 })],
  },

  unrealengine: {
    story:
      'Unreal Engine outer medallion counter-rotates against the calligraphic U while a real-time shader sheen sweeps across',
    groups: {
      glyph: 0,
      ring: 1,
    },
    tracks: [
      {
        on: 'ring',
        origin: [12, 12],
        keys: {
          12: { r: -20, e: 'inout' },
          38: { r: 16, e: 'settle' },
          60: { r: 0, e: 'out' },
        },
      },
      {
        on: 'glyph',
        origin: [12, 12],
        keys: {
          14: { s: 0.88, r: 8, e: 'inout' },
          36: { s: 1.05, r: -3, e: 'settle' },
          58: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [sheen('<circle cx="12" cy="12" r="10.2"/>', 30, 60, 0.28)],
  },

  godotengine: {
    story:
      'Godot friendly robot head nods with a synchronized double-eye blink as its lower jaw plate clicks cleanly into place',
    groups: {
      head: 0,
      eyes: [1, 2],
      jaw: 3,
    },
    tracks: [
      { on: 'head', origin: '50% 60%', keys: nod(12, 5.5) },
      {
        on: 'eyes',
        each: true,
        keys: {
          24: { sy: 1, e: 'in' },
          30: { sy: 0.14, e: 'out' },
          36: { sy: 1, e: 'out' },
        },
      },
      {
        on: 'jaw',
        keys: {
          16: { y: 1.4, e: 'inout' },
          34: { y: -0.2, e: 'settle' },
          50: { y: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#60A5FA', 28, 60, { sw: 0.55 })],
  },

  aseprite: {
    story:
      'Aseprite pixel-art mascot bounces with crisp sprite-frame energy and blinks both pixel eyes as a brush spark pops',
    groups: {
      crown: [0, 1, 3],
      body: 2,
      eyes: [4, 5],
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 85%',
        keys: {
          10: { y: 0, sx: 1.05, sy: 0.94, e: 'in' },
          22: { y: -1.8, sx: 0.96, sy: 1.05, e: 'out' },
          34: { y: 0.3, sx: 1.04, sy: 0.96, e: 'settle' },
          48: { y: 0, sx: 1, sy: 1, e: 'out' },
        },
      },
      { on: 'crown', keys: dropIn(12, 1.8) },
      {
        on: 'eyes',
        each: true,
        keys: {
          32: { sy: 1, e: 'in' },
          38: { sy: 0.15, e: 'out' },
          44: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [spark(18.8, 4.4, 1.4, -1.4, '#CBD5E1', 26, 48)],
  },

  // ── Docs & Project Management ──────────────────────────────────────────────

  notion: {
    story:
      'Notion paper cube tilts gently as its front page and serif N settle into place with a clean workspace sheen',
    groups: {
      cube: [0, 2, 5],
      page: 4,
      nGlyph: 7,
    },
    tracks: [
      { on: 'cube', origin: '50% 60%', keys: sway(10, 4.5, 0.4) },
      { on: 'page', keys: breathe(14, 0.05) },
      { on: 'nGlyph', keys: popIn(18, 0.5) },
    ],
    props: [sheen('<rect x="2" y="2" width="20" height="20" rx="2"/>', 34, 62, 0.26)],
  },

  obsidian: {
    story:
      'Obsidian four amethyst crystal shards shift and lock together while a knowledge-graph backlink pulse radiates outward',
    groups: {
      shard0: 0,
      shard1: 1,
      shard2: 2,
      shard3: 3,
    },
    tracks: [
      { on: 'shard3', keys: slideIn(10, -1.8, -1.8) },
      { on: 'shard0', keys: slideIn(14, 1.8, -1.0) },
      { on: 'shard2', keys: slideIn(18, -1.8, 1.4) },
      { on: 'shard1', keys: slideIn(22, 1.2, 2.0) },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#A78BFA', 30, 62, { sw: 0.6 }),
      spark(16.8, 4.6, 1.5, -1.5, '#DDD6FE', 38, 60),
    ],
  },

  linear: {
    story:
      'Linear three diagonal velocity stripes streak sequentially into the sphere as an issue-sprint pulse confirms',
    groups: {
      stripes: [0, 1, 2],
      sphere: 3,
    },
    tracks: [
      {
        on: 'stripes',
        stagger: 4.5,
        keys: {
          10: { x: -2.4, y: 2.4, o: 0.25, e: 'inout' },
          26: { x: 0.2, y: -0.2, o: 1, e: 'settle' },
          36: { x: 0, y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'sphere',
        keys: {
          18: { s: 0.94, e: 'inout' },
          36: { s: 1.04, e: 'settle' },
          56: { s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#818CF8', 32, 62, { sw: 0.55 })],
  },

  jira: {
    story:
      'Jira three blue workflow chevrons climb diagonally in a staggered sprint cascade from backlog to done',
    groups: {
      step1: 4,
      step2: 2,
      step3: 0,
    },
    tracks: [
      { on: 'step1', keys: slideIn(10, -2.4, 2.4) },
      { on: 'step2', keys: slideIn(18, -2.4, 2.4) },
      { on: 'step3', keys: slideIn(26, -2.4, 2.4) },
    ],
    props: [spark(19.2, 4.4, 1.5, -1.5, '#60A5FA', 42, 64)],
  },

  docusaurus: {
    story:
      'Docusaurus mascot nods cheerfully while its React documentation pages fan and settle into a live site build',
    groups: {
      dino: 0,
      pages: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    tracks: [
      { on: 'dino', origin: '45% 65%', keys: nod(12, 5.5) },
      {
        on: 'pages',
        stagger: 2,
        keys: {
          16: { x: 1.6, o: 0.35, e: 'inout' },
          28: { x: -0.15, o: 1, e: 'settle' },
          36: { x: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#4ADE80', 30, 62, { sw: 0.55 })],
  },

  confluence: {
    story:
      'Confluence twin opposing waves glide toward each other to connect team documentation with a central sync ring',
    groups: {
      lowerWave: 0,
      upperWave: 2,
    },
    tracks: [
      {
        on: 'lowerWave',
        keys: {
          12: { x: -2.2, y: 1.4, e: 'inout' },
          34: { x: 0.2, y: -0.15, e: 'settle' },
          54: { x: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'upperWave',
        keys: {
          12: { x: 2.2, y: -1.4, e: 'inout' },
          34: { x: -0.2, y: 0.15, e: 'settle' },
          54: { x: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 8.8, '#60A5FA', 26, 58, { sw: 0.55 })],
  },

  slack: {
    story:
      'Slack four colorful hashtag arms pulse outward in a clockwise channel-notification wave around the workspace square',
    groups: (parts) => ({
      bg: [0],
      blue: parts.filter((p) => p.fill === '#36C5F0').map((p) => p.i),
      green: parts.filter((p) => p.fill === '#2EB67D').map((p) => p.i),
      yellow: parts.filter((p) => p.fill === '#ECB22E').map((p) => p.i),
      red: parts.filter((p) => p.fill === '#E01E5A').map((p) => p.i),
    }),
    tracks: [
      { on: 'blue', keys: { 10: { y: -1.2, s: 1.06, e: 'inout' }, 26: { y: 0, s: 1, e: 'out' } } },
      { on: 'green', keys: { 18: { x: 1.2, s: 1.06, e: 'inout' }, 34: { x: 0, s: 1, e: 'out' } } },
      { on: 'yellow', keys: { 26: { y: 1.2, s: 1.06, e: 'inout' }, 42: { y: 0, s: 1, e: 'out' } } },
      { on: 'red', keys: { 34: { x: -1.2, s: 1.06, e: 'inout' }, 50: { x: 0, s: 1, e: 'out' } } },
    ],
    props: [pulseRing(12, 12, 10.2, '#E879F9', 36, 66, { sw: 0.55 })],
  },

  discord: {
    story:
      'Discord Clyde controller mascot tilts with a playful bounce while twin voice-channel rings ripple outward',
    tracks: [
      {
        on: 'all',
        origin: '50% 60%',
        keys: {
          10: { r: -6, y: 0.5, e: 'inout' },
          26: { r: 6, y: -0.7, s: 1.04, e: 'settle' },
          44: { r: -2, y: 0.15, s: 1, e: 'inout' },
          58: { r: 0, y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#818CF8', 18, 50, { sw: 0.6 }),
      pulseRing(12, 12, 10.6, '#A5B4FC', 28, 62, { sw: 0.5 }),
    ],
  },

  vitepress: {
    story:
      'VitePress ignites its inner lightning bolt inside the indigo V-crest for an instant static-docs hot reload',
    groups: {
      shield: 0,
      bolt: 1,
      accent: 2,
    },
    tracks: [
      { on: 'shield', keys: breathe(10, 0.05) },
      {
        on: 'bolt',
        keys: {
          16: { y: -2.0, s: 0.7, o: 0.3, e: 'in' },
          30: { y: 0.25, s: 1.15, o: 1, e: 'settle' },
          46: { y: 0, s: 1, o: 1, e: 'out' },
        },
      },
      { on: 'accent', keys: popIn(22, 0.5) },
    ],
    props: [spark(17.6, 5.2, 1.5, -1.5, '#FDE047', 28, 52)],
  },

  mkdocs: {
    story:
      'MkDocs emblem flips open like a crisp Material documentation page and settles with a clean search-index sheen',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: flipX(12),
      },
    ],
    props: [
      sheen('<rect x="1.5" y="2" width="21" height="20" rx="2"/>', 34, 62, 0.28),
      pulseRing(12, 12, 9.8, '#93C5FD', 26, 58, { sw: 0.55 }),
    ],
  },

  sphinx: {
    story:
      'Sphinx rises smoothly as its upper header bar lowers onto the technical documentation pillar with a golden reference pulse',
    groups: {
      pillar: 0,
      crown: 1,
    },
    tracks: [
      { on: 'pillar', keys: riseIn(12, 2.0) },
      { on: 'crown', keys: dropIn(18, 2.2) },
    ],
    props: [pulseRing(12, 12, 9.8, '#FDE68A', 32, 62, { sw: 0.55 })],
  },

  mdx: {
    story:
      'MDX wordmark pulses with a JSX-in-Markdown component pop and flashes a bright amber-and-blue syntax spark',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: heartbeat(12, 0.08),
      },
    ],
    props: [
      sheen('<rect x="0.8" y="6.8" width="22.4" height="10.4" rx="1.5"/>', 24, 54, 0.3),
      spark(18.6, 6.2, 1.6, -1.6, '#FBBF24', 36, 58),
    ],
  },
};
