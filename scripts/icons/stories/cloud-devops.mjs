// Bespoke, story-driven SVG animation specs for all 83 icons in "Cloud and DevOps".
// (docker and kubernetes live in pilot.mjs)
// Every keyframe strictly stays within the 6%..72% story window (T = 4.8s).

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
  breathe,
} from '../motifs.mjs';

export default {
  // ── Cloud Providers ────────────────────────────────────────────────────────

  amazonaws: {
    story:
      'AWS letters rise into global cloud formation while the orange smile arrow traces A-to-Z and snaps its arrowhead with a warm cloud pulse',
    groups: {
      letters: [0, 1, 2],
      smile: 3,
      tip: 4,
    },
    tracks: [
      {
        on: 'letters',
        order: 'x',
        stagger: 4,
        each: true,
        keys: riseIn(10, 2.2),
      },
      {
        on: 'smile',
        draw: [20, 46],
        fill: [40, 50],
        width: 0.7,
      },
      {
        on: 'tip',
        keys: {
          38: { x: -2.2, y: 0.8, s: 0.5, o: 0, e: 'out' },
          48: { x: 0.25, y: -0.1, s: 1.15, o: 1, e: 'settle' },
          58: { x: 0, y: 0, s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#FF9900', 34, 66, { o: 0.55 })],
  },

  googlecloud: {
    story:
      'Google Cloud’s four-color quadrants glide in from cardinal directions and interlock into a unified global compute cloud',
    groups: {
      red: 0,
      blue: 1,
      green: 2,
      yellow: 3,
    },
    tracks: [
      { on: 'red', keys: slideIn(10, 0, -2.6) },
      { on: 'blue', keys: slideIn(15, 2.6, 0) },
      { on: 'green', keys: slideIn(20, 0, 2.6) },
      { on: 'yellow', keys: slideIn(25, -2.6, 0) },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#4285F4', 34, 66, { o: 0.6 }),
      packet(4.5, 13.5, 19.5, 13.5, '#FBBC05', 36, 64, 0.85),
    ],
  },

  azure: {
    story:
      'Azure’s geometric origami facets unfold and lock into an enterprise A-frame as a crisp cloud sheen sweeps across',
    groups: {
      left: 0,
      base: 1,
      fold: 2,
      right: 3,
    },
    tracks: [
      { on: 'left', keys: slideIn(10, -2.4, 1.4) },
      { on: 'fold', keys: popIn(16, 0.72) },
      { on: 'right', keys: slideIn(22, 2.4, -1.2) },
      { on: 'base', keys: riseIn(28, 2.2) },
    ],
    props: [
      sheen('<rect x="1.5" y="1.5" width="21" height="21" rx="2"/>', 44, 68, 0.25),
      pulseRing(12, 12, 10.2, '#38BDF8', 32, 64, { o: 0.5 }),
    ],
  },

  digitalocean: {
    story:
      'DigitalOcean’s circular ocean ring traces cleanly while three droplet pixel blocks cascade into the tide',
    groups: {
      ring: 3,
      droplets: [0, 1, 2],
    },
    tracks: [
      {
        on: 'ring',
        draw: [8, 34],
        fill: [26, 36],
        width: 0.65,
      },
      {
        on: 'droplets',
        order: '-x',
        stagger: 5,
        each: true,
        keys: popIn(26, 0.25),
      },
    ],
    props: [waveLine(21.4, '#38BDF8', 14, 64)],
  },

  railway: {
    story:
      'Railway’s sleek locomotive glides forward along parallel deployment rails, throwing a launch spark as infrastructure spins up',
    groups: {
      train: 0,
      rails: [1, 2, 3],
    },
    tracks: [
      {
        on: 'rails',
        order: 'y',
        stagger: 4,
        keys: slideIn(10, -2.4, 0),
      },
      {
        on: 'train',
        keys: {
          14: { x: -3.0, o: 0.35, e: 'out' },
          36: { x: 0.45, o: 1, e: 'settle' },
          52: { x: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(19.6, 8.2, 1.8, -1.2, '#C084FC', 28, 50),
      packet(3.5, 13.0, 20.5, 13.0, '#E2E8F0', 22, 56, 0.75),
    ],
  },

  render: {
    story:
      'Render’s unified cloud mark snaps into focus as a full-stack web service and database deploy with a clean verification check',
    tracks: [
      {
        on: 'all',
        keys: {
          10: { s: 0.88, r: -4, e: 'out' },
          28: { s: 1.05, r: 2, e: 'settle' },
          46: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#A78BFA', 18, 54, { o: 0.65 }),
      checkFlash(16.6, 6.2, '#86EFAC', 38, 66),
    ],
  },

  heroku: {
    story:
      'Heroku’s container PaaS frame outlines while dyno bars rise and a stylized H-arc snaps into active runtime',
    groups: {
      frame: 0,
      leg: 1,
      arc: 2,
      bar: 3,
    },
    tracks: [
      {
        on: 'frame',
        draw: [8, 30],
        fill: [22, 32],
        width: 0.6,
      },
      { on: 'leg', keys: riseIn(22, 2.4) },
      { on: 'arc', keys: popIn(28, 0.5) },
      { on: 'bar', keys: dropIn(34, 2.2) },
    ],
    props: [pulseRing(12, 12, 10.0, '#B094D4', 32, 64, { o: 0.55 })],
  },

  hetzner: {
    story:
      'Hetzner’s bold bare-metal badge pulses firmly as European dedicated server rack telemetry bars light up with a metallic sheen',
    tracks: [
      {
        on: 'all',
        keys: heartbeat(12, 0.06),
      },
    ],
    props: [
      telemetryBar(4.2, 16.0, 1.4, 4.2, '#FCA5A5', 14, 54),
      telemetryBar(6.4, 14.4, 1.4, 5.8, '#F87171', 20, 58),
      telemetryBar(8.6, 15.2, 1.4, 5.0, '#FCA5A5', 26, 62),
      sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5" rx="1.5"/>', 40, 66, 0.28),
    ],
  },

  akamai: {
    story:
      'Akamai’s three global CDN ocean-wave arcs ripple outward in staggered cadence as edge traffic packets surf the crest',
    groups: {
      outer: 0,
      mid: 1,
      inner: 2,
    },
    tracks: [
      { on: 'outer', keys: slideIn(10, -2.2, 0.8) },
      { on: 'mid', keys: slideIn(18, -1.8, -0.8) },
      { on: 'inner', keys: slideIn(26, -1.5, -1.2) },
    ],
    props: [
      packet(4.2, 14.0, 20.0, 7.6, '#38BDF8', 22, 58, 0.9),
      pulseRing(12, 12, 9.8, '#0096D6', 30, 64, { o: 0.55 }),
    ],
  },

  ovh: {
    story:
      'OVHcloud’s twin angled bare-metal wings converge symmetrically around a sovereign European cloud pulse',
    groups: {
      right: 0,
      left: 1,
    },
    tracks: [
      { on: 'left', keys: slideIn(12, -2.8, 0) },
      { on: 'right', keys: slideIn(18, 2.8, 0) },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#9BAEC2', 26, 62, { o: 0.65 }),
      spark(18.8, 6.2, 1.6, -1.4, '#38BDF8', 34, 56),
    ],
  },

  scaleway: {
    story:
      'Scaleway’s interlocking cloud-GPU coils wind together around dual compute cores with violet acceleration sparks',
    groups: {
      outer: 0,
      cores: [1, 2],
    },
    tracks: [
      {
        on: 'outer',
        origin: [12, 12],
        keys: {
          10: { r: -18, s: 0.92, e: 'inout' },
          36: { r: 8, s: 1.03, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'cores',
        stagger: 6,
        each: true,
        keys: popIn(18, 0.45),
      },
    ],
    props: [
      spark(18.2, 4.8, 1.5, -1.2, '#C084FC', 28, 50),
      spark(5.8, 19.2, -1.5, 1.2, '#A855F7', 36, 58),
    ],
  },

  vultr: {
    story:
      'Vultr’s razor-sharp V-wings swoop into high-frequency compute formation as a lightning spark ignites at the apex',
    groups: {
      left: 0,
      right: 1,
    },
    tracks: [
      { on: 'left', keys: slideIn(10, -2.5, 1.4) },
      { on: 'right', keys: slideIn(18, 2.5, -1.8) },
    ],
    props: [
      boltFlash(17.8, 4.2, '#38BDF8', 26, 54),
      pulseRing(12, 12, 9.5, '#007BFC', 32, 64, { o: 0.55 }),
    ],
  },

  // ── Cloud & Edge Network ───────────────────────────────────────────────────

  cloudflare: {
    story:
      'Cloudflare’s global edge cloud swells into view as its companion cloudlet locks in and Zero-Trust edge radar sweeps the perimeter',
    groups: {
      main: 0,
      edge: 1,
    },
    tracks: [
      {
        on: 'main',
        keys: {
          10: { x: -2.0, s: 0.9, e: 'out' },
          30: { x: 0.25, s: 1.04, e: 'settle' },
          48: { x: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'edge',
        keys: slideIn(20, 2.6, 0),
      },
    ],
    props: [
      radar(12, 12, 10.4, '#FDBA74', 14, 64, 110),
      packet(3.2, 12.2, 20.8, 14.2, '#FDE047', 26, 58, 0.85),
    ],
  },

  vercel: {
    story:
      'Vercel’s iconic delta triangle launches upward with a crisp edge-deployment sheen and velocity sparks',
    tracks: [
      {
        on: 'all',
        origin: '50% 70%',
        keys: {
          10: { y: 2.6, s: 0.86, e: 'in' },
          28: { y: -1.2, s: 1.05, e: 'settle' },
          46: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<polygon points="12,2.4 23,21.5 1,21.5"/>', 34, 62, 0.35),
      spark(12, 2.2, 0, -1.6, '#FFFFFF', 24, 46),
      pulseRing(12, 14, 8.8, '#94A3B8', 26, 60, { o: 0.5 }),
    ],
  },

  netlify: {
    story:
      'Netlify’s composable edge beams radiate from its central diamond as global edge-deploy packets converge',
    groups: {
      bg: 0,
      beams: [1, 2, 3, 4, 5, 6],
      core: 7,
    },
    tracks: [
      { on: 'core', keys: heartbeat(10, 0.14) },
      {
        on: 'beams',
        order: 'a',
        stagger: 3.5,
        each: true,
        keys: popIn(14, 0.3),
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#00C7B7', 24, 60, { o: 0.65 }),
      packet(4.5, 12, 19.5, 12, '#5EEAD4', 28, 60, 0.85),
    ],
  },

  flydotio: {
    story:
      'Fly.io’s hot-air balloon floats skyward on a Firecracker microVM thermal, radiating global edge-region ripples',
    tracks: [
      {
        on: 'all',
        origin: '50% 60%',
        keys: {
          10: { y: 1.8, r: -3, e: 'inout' },
          28: { y: -1.8, r: 2.5, e: 'inout' },
          48: { y: -0.6, r: -1.5, e: 'inout' },
          64: { y: 0, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 11, 8.4, '#C4B5FD', 18, 56, { o: 0.6 }),
      waveLine(21.6, '#A78BFA', 14, 62),
    ],
  },

  fastly: {
    story:
      'Fastly’s programmable edge stopwatch snaps taut while its center dial fires a sub-millisecond Varnish cache bolt',
    groups: {
      body: 0,
      dial: 1,
    },
    tracks: [
      {
        on: 'body',
        keys: {
          10: { s: 0.92, r: -8, e: 'in' },
          24: { s: 1.06, r: 5, e: 'settle' },
          44: { s: 1, r: 0, e: 'out' },
        },
      },
      {
        on: 'dial',
        origin: [12.7, 12.5],
        keys: {
          14: { r: 0, e: 'in' },
          38: { r: 180, e: 'settle' },
          58: { r: 360, e: 'out' },
        },
      },
    ],
    props: [
      boltFlash(17.2, 4.2, '#FDE047', 22, 50),
      pulseRing(12, 12.5, 9.6, '#FF282D', 24, 58, { o: 0.6 }),
    ],
  },

  // ── CI/CD & GitOps ─────────────────────────────────────────────────────────

  githubactions: {
    story:
      'GitHub Actions triggers a workflow run from the top-left node, steps cascade through the job matrix, and a green check confirms CI pass',
    groups: {
      trigger: 2,
      frame: 3,
      steps: [0, 1, 4, 5],
      badge: 6,
    },
    tracks: [
      {
        on: 'frame',
        keys: breathe(10, 0.04),
      },
      {
        on: 'trigger',
        keys: popIn(10, 0.45),
      },
      {
        on: 'steps',
        order: 'x',
        stagger: 4.5,
        each: true,
        keys: popIn(18, 0.35),
      },
      {
        on: 'badge',
        keys: heartbeat(34, 0.14),
      },
    ],
    props: [
      packet(6.3, 6.0, 18.8, 19.3, '#60A5FA', 16, 46, 0.9),
      checkFlash(16.8, 18.6, '#4ADE80', 44, 68),
    ],
  },

  argocd: {
    story:
      'Argo CD’s astronaut-octopus bobs weightlessly in orbit while a GitOps reconciliation radar sweeps and syncs cluster state',
    tracks: [
      {
        on: 'all',
        origin: '50% 55%',
        keys: sway(10, 4.5, 0.9),
      },
    ],
    props: [
      radar(12, 10.5, 10.4, '#38BDF8', 12, 64, 130),
      packet(4.5, 6.5, 19.5, 17.5, '#FDBA74', 20, 56, 0.85),
      checkFlash(16.8, 5.2, '#86EFAC', 44, 68),
    ],
  },

  jenkins: {
    story:
      'Jenkins the build butler gives a crisp nod of service as an automated CI pipeline sweeps to completion and flashes green',
    tracks: [
      {
        on: 'all',
        origin: '50% 65%',
        keys: nod(16, 6.5),
      },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#F87171', 14, 52, { o: 0.55 }),
      checkFlash(16.6, 17.6, '#4ADE80', 40, 66),
    ],
  },

  circleci: {
    story:
      'CircleCI’s continuous integration ring winds through a full build cycle while its central hub pulses green on deployment',
    groups: {
      ring: 1,
      hub: 2,
    },
    tracks: [
      {
        on: 'ring',
        origin: [12, 12],
        keys: {
          10: { r: -35, e: 'inout' },
          44: { r: 25, e: 'settle' },
          64: { r: 0, e: 'out' },
        },
      },
      {
        on: 'hub',
        keys: heartbeat(18, 0.18),
      },
    ],
    props: [radar(12, 12, 10.4, '#94A3B8', 12, 62, 140), checkFlash(16.5, 5.8, '#4ADE80', 42, 68)],
  },

  flux: {
    story:
      'Flux CD’s GitOps stream ribs cascade upward in wave order into the reconciliation hood as cluster state converges',
    groups: {
      ribs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      hood: 10,
    },
    tracks: [
      {
        on: 'hood',
        keys: {
          10: { y: -1.6, e: 'out' },
          30: { y: 0.3, e: 'settle' },
          52: { y: 0, e: 'out' },
        },
      },
      {
        on: 'ribs',
        order: '-y',
        stagger: 2.2,
        each: true,
        keys: riseIn(12, 1.8),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#818CF8', 28, 64, { o: 0.6 })],
  },

  tekton: {
    story:
      'Tekton’s Kubernetes-native pipeline block locks in as its four task stage indicators pop sequentially and confirm completion',
    groups: {
      body: 0,
      dots: [1, 2, 3, 4],
      bar: 5,
    },
    tracks: [
      { on: 'body', keys: breathe(10, 0.05) },
      {
        on: 'dots',
        order: 'x',
        stagger: 5,
        each: true,
        keys: popIn(14, 0.2),
      },
      { on: 'bar', keys: slideIn(28, -2.0, 0) },
    ],
    props: [
      packet(4.5, 12, 19.5, 12, '#FDA4AF', 20, 52, 0.85),
      checkFlash(16.4, 5.6, '#86EFAC', 42, 68),
    ],
  },

  travisci: {
    story:
      'Travis CI’s hard-hat build mascot nods confidently as its visor blinks and a hosted CI build check flashes green',
    groups: {
      eyes: [0, 1],
      helmet: 2,
      crest: 3,
    },
    tracks: [
      { on: 'helmet', origin: '50% 65%', keys: nod(14, 5.5) },
      { on: 'crest', keys: dropIn(12, 1.8) },
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
    props: [checkFlash(16.8, 5.4, '#4ADE80', 42, 68)],
  },

  buildkite: {
    story:
      'Buildkite’s emerald pipeline kite banks smoothly into a tailwind, leaving a high-speed hybrid-runner spark in its wake',
    tracks: [
      {
        on: 'all',
        origin: '50% 50%',
        keys: {
          10: { x: -1.8, y: 1.2, r: -8, e: 'inout' },
          30: { x: 1.4, y: -1.2, r: 6, e: 'settle' },
          52: { x: 0, y: 0, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      spark(19.6, 6.2, 1.8, -1.4, '#4ADE80', 24, 48),
      packet(3.8, 16.5, 20.2, 7.5, '#86EFAC', 18, 54, 0.85),
    ],
  },

  drone: {
    story:
      'Drone’s container-native CI rotor lifts and stabilizes over its core lens while an automated build packet glides through',
    groups: {
      core: 0,
      rotor: 1,
      chassis: 2,
    },
    tracks: [
      {
        on: 'rotor',
        keys: {
          10: { y: -1.8, r: -4, e: 'inout' },
          32: { y: 0.35, r: 3, e: 'settle' },
          54: { y: 0, r: 0, e: 'out' },
        },
      },
      { on: 'core', keys: heartbeat(16, 0.16) },
      { on: 'chassis', keys: riseIn(14, 1.8) },
    ],
    props: [pulseRing(12, 13.5, 8.8, '#94A3B8', 22, 58, { o: 0.55 })],
  },

  teamcity: {
    story:
      'TeamCity’s prismatic flares expand behind the dark console as T, C, and the prompt bar snap into a green CI build',
    groups: {
      flares: [0, 1, 2],
      core: 3,
      letters: [4, 5],
      bar: 6,
    },
    tracks: [
      {
        on: 'flares',
        stagger: 3.5,
        keys: {
          10: { s: 0.86, e: 'out' },
          28: { s: 1.06, e: 'settle' },
          46: { s: 1, e: 'out' },
        },
      },
      {
        on: 'letters',
        order: 'x',
        stagger: 5,
        each: true,
        keys: popIn(18, 0.4),
      },
      {
        on: 'bar',
        keys: {
          26: { sx: 0.2, o: 0.3, e: 'out' },
          40: { sx: 1.08, o: 1, e: 'settle' },
          52: { sx: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [checkFlash(16.6, 5.2, '#4ADE80', 44, 68)],
  },

  // ── Infrastructure as Code ─────────────────────────────────────────────────

  terraform: {
    story:
      'Terraform’s four isometric infrastructure blocks drop and lock declaratively into the multi-cloud T-lattice with an apply check',
    groups: {
      blocks: [0, 2, 1, 3],
    },
    tracks: [
      {
        on: 'blocks',
        stagger: 6,
        each: true,
        keys: dropIn(10, 3.0),
      },
    ],
    props: [
      guides(
        [
          [12, 2, 12, 22],
          [3, 10, 21, 10],
        ],
        '#C084FC',
        10,
        56
      ),
      checkFlash(16.6, 17.8, '#86EFAC', 44, 68),
    ],
  },

  ansible: {
    story:
      'Ansible’s outer playbook ring traces into place while the inner A-chevron snaps sharp and dispatches agentless config packets',
    groups: {
      chevron: 0,
      ring: 1,
    },
    tracks: [
      {
        on: 'ring',
        draw: [8, 34],
        fill: [26, 36],
        width: 0.65,
      },
      {
        on: 'chevron',
        keys: popIn(22, 0.35),
      },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#F87171', 28, 62, { o: 0.65 }),
      spark(18.6, 5.4, 1.5, -1.4, '#FCA5A5', 32, 54),
    ],
  },

  nixos: {
    story:
      'NixOS’s six interlocking lambda arms rotate and lock into a pure, reproducible declarative snowflake',
    groups: {
      light: [0, 1, 2],
      deep: [3, 4, 5],
    },
    tracks: [
      {
        on: 'light',
        origin: [12, 12],
        keys: {
          10: { r: -30, s: 0.9, e: 'inout' },
          38: { r: 6, s: 1.03, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'deep',
        origin: [12, 12],
        keys: {
          14: { r: 30, s: 0.9, e: 'inout' },
          42: { r: -6, s: 1.03, e: 'settle' },
          62: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.0, '#7EBAE4', 24, 60, { o: 0.55 })],
  },

  pulumi: {
    story:
      'Pulumi’s multicolored isometric cube facets stack upward from base to crown like typed cloud resources provisioning in code',
    groups: {
      bottom: [0, 1, 2, 3],
      mid: [5, 7, 9, 10],
      top: [4, 6, 8, 11],
    },
    tracks: [
      { on: 'bottom', order: 'x', stagger: 3, each: true, keys: riseIn(10, 2.2) },
      { on: 'mid', order: 'x', stagger: 3, each: true, keys: popIn(20, 0.5) },
      { on: 'top', order: 'x', stagger: 3, each: true, keys: dropIn(30, 2.2) },
    ],
    props: [pulseRing(12, 12, 10.2, '#F6BF29', 34, 66, { o: 0.55 })],
  },

  opentofu: {
    story:
      'OpenTofu’s open-source IaC mascot hops into provisioned state and blinks cheerfully while a declarative state ring pulses',
    groups: {
      body: 0,
      eyes: [3, 4],
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 70%',
        keys: {
          10: { y: 1.6, s: 0.93, e: 'in' },
          24: { y: -1.4, s: 1.05, e: 'settle' },
          40: { y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'eyes',
        each: true,
        keys: {
          36: { sy: 1, e: 'in' },
          42: { sy: 0.12, e: 'out' },
          48: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#FDE047', 24, 60, { o: 0.6 }),
      checkFlash(16.6, 5.2, '#86EFAC', 42, 68),
    ],
  },

  chef: {
    story:
      'Progress Chef’s policy-ring segments pop radially into alignment around the core as infrastructure recipes converge',
    groups: {
      core: 3,
      ring: [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    tracks: [
      { on: 'core', keys: heartbeat(12, 0.12) },
      {
        on: 'ring',
        order: 'a',
        stagger: 2.2,
        each: true,
        keys: popIn(14, 0.45),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#FDBA74', 28, 64, { o: 0.55 })],
  },

  puppet: {
    story:
      'Puppet’s declarative model-driven mark traces its node graph and breathes solidly as catalog state converges',
    tracks: [
      {
        on: 'all',
        keys: {
          10: { s: 0.9, r: -4, e: 'inout' },
          30: { s: 1.06, r: 3, e: 'settle' },
          52: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#FFAE1A', 18, 56, { o: 0.65 }),
      checkFlash(16.8, 5.4, '#86EFAC', 40, 66),
    ],
  },

  saltproject: {
    story:
      'Salt Project’s crystalline hexagon ratchets with event-driven torque while remote-execution sparks fire off its corners',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: torque(10, 20, 42),
      },
    ],
    props: [
      spark(19.4, 5.2, 1.6, -1.2, '#5EEAD4', 24, 46),
      spark(4.6, 18.8, -1.6, 1.2, '#57BCAD', 38, 60),
    ],
  },

  // ── Containers & Orchestration / Runtime ───────────────────────────────────

  helm: {
    story:
      'Helm’s nautical chart arcs steer into Kubernetes course while H-E-L-M package letters cascade across the banner',
    groups: {
      arcs: [1, 2],
      h: [3, 4],
      e: [5, 6],
      l: [7, 8],
      m: [9, 10],
    },
    tracks: [
      { on: 'arcs', origin: [12, 12], keys: steer(10, -16, 18) },
      { on: 'h', keys: riseIn(14, 2.0) },
      { on: 'e', keys: riseIn(20, 2.0) },
      { on: 'l', keys: riseIn(26, 2.0) },
      { on: 'm', keys: riseIn(32, 2.0) },
    ],
    props: [radar(12, 12, 10.4, '#9A9DCD', 12, 62, 100)],
  },

  podman: {
    story:
      'Podman’s trio of rootless container seals bob buoyantly in unison while daemonless OCI pod rings ripple outward',
    tracks: [
      {
        on: 'all',
        origin: '50% 60%',
        keys: sway(10, 4.5, 0.8),
      },
    ],
    props: [
      pulseRing(12, 12, 10.0, '#C084FC', 16, 54, { o: 0.65 }),
      waveLine(21.4, '#A855F7', 12, 62),
      spark(18.5, 5.2, 1.4, -1.2, '#E9D5FF', 34, 56),
    ],
  },

  istio: {
    story:
      'Istio’s twin service-mesh sails billow over its hull while mTLS traffic packets glide smoothly across the fleet',
    groups: {
      mainSail: 0,
      jib: 1,
      hull: 2,
    },
    tracks: [
      { on: 'hull', keys: slideIn(10, -2.0, 0) },
      {
        on: 'mainSail',
        origin: '50% 90%',
        keys: {
          12: { r: -8, x: -0.6, e: 'inout' },
          36: { r: 6, x: 0.5, e: 'settle' },
          58: { r: 0, x: 0, e: 'out' },
        },
      },
      {
        on: 'jib',
        origin: '50% 90%',
        keys: {
          16: { r: -10, x: -0.5, e: 'inout' },
          40: { r: 5, x: 0.4, e: 'settle' },
          60: { r: 0, x: 0, e: 'out' },
        },
      },
    ],
    props: [
      waveLine(22.2, '#60A5FA', 12, 62),
      packet(5.0, 14.0, 19.0, 8.5, '#93C5FD', 22, 56, 0.85),
    ],
  },

  cilium: {
    story:
      'Cilium’s central eBPF kernel cell pulses first, then its six honeycomb networking cells pop radially into a secure mesh',
    groups: {
      core: 0,
      ring: [1, 2, 3, 4, 5, 6],
    },
    tracks: [
      { on: 'core', keys: heartbeat(10, 0.16) },
      {
        on: 'ring',
        order: 'a',
        stagger: 4,
        each: true,
        keys: popIn(16, 0.35),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#FDE047', 28, 64, { o: 0.6 })],
  },

  consul: {
    story:
      'Consul’s service-mesh rings pulse outward from the core while six discovery health-check nodes cascade cleanly on the right',
    groups: {
      core: 5,
      rings: 7,
      nodes: [0, 1, 2, 3, 4, 6],
    },
    tracks: [
      { on: 'core', keys: heartbeat(10, 0.18) },
      { on: 'rings', keys: breathe(12, 0.05) },
      {
        on: 'nodes',
        order: 'y',
        stagger: 4,
        each: true,
        keys: popIn(18, 0.25),
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#FB7185', 22, 58, { o: 0.6 })],
  },

  openshift: {
    story:
      'OpenShift’s crimson enterprise container ring ratchets forward with industrial torque as a Kubernetes cluster radar sweeps behind',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: torque(10, 24, 48),
      },
    ],
    props: [
      radar(12, 12, 10.5, '#F87171', 12, 64, 120),
      spark(19.0, 5.2, 1.6, -1.2, '#FCA5A5', 26, 48),
    ],
  },

  rancher: {
    story:
      'Rancher’s multi-cluster longhorn steer gives a confident nod while its cattle tag flicks and cluster pulses radiate',
    groups: {
      steerBody: 0,
      tag: 1,
    },
    tracks: [
      { on: 'steerBody', origin: '50% 60%', keys: nod(14, 6) },
      {
        on: 'tag',
        keys: {
          18: { r: -18, y: -0.8, e: 'inout' },
          36: { r: 12, y: 0.3, e: 'settle' },
          54: { r: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#60A5FA', 20, 58, { o: 0.6 })],
  },

  portainer: {
    story:
      'Portainer’s harbor crane steadies its jib while six container cubes drop neatly onto the barge deck above a gentle swell',
    groups: {
      crane: [0, 1, 2, 3, 4, 5, 6],
      barge: 7,
      cubes: [8, 9, 10, 11, 12, 13],
    },
    tracks: [
      { on: 'barge', origin: '50% 70%', keys: sway(10, 3, 0.5) },
      { on: 'crane', keys: breathe(12, 0.03) },
      {
        on: 'cubes',
        order: 'x',
        stagger: 3.5,
        each: true,
        keys: dropIn(14, 2.4),
      },
    ],
    props: [waveLine(20.6, '#38BDF8', 12, 62)],
  },

  harbor: {
    story:
      'Harbor’s container-registry lighthouse stands steady while its three sweeping beacon beams flash across the trusted harbor',
    groups: {
      tower: [1, 2, 3, 4, 5],
      beams: [9, 10, 11],
      frame: 8,
    },
    tracks: [
      { on: 'tower', keys: riseIn(10, 1.6) },
      {
        on: 'beams',
        order: 'y',
        stagger: 5,
        keys: {
          18: { sx: 0.25, o: 0.15, e: 'out' },
          34: { sx: 1.06, o: 1, e: 'settle' },
          48: { sx: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#4ADE80', 26, 62, { o: 0.55 }),
      waveLine(21.4, '#38BDF8', 14, 62),
    ],
  },

  containerd: {
    story:
      'containerd’s core runtime enclosure traces into place while the inner OCI container block drops cleanly into its slot',
    groups: {
      shell: 0,
      block: 1,
    },
    tracks: [
      {
        on: 'shell',
        draw: [8, 32],
        fill: [24, 34],
        width: 0.65,
      },
      {
        on: 'block',
        keys: dropIn(24, 3.0),
      },
    ],
    props: [checkFlash(16.6, 5.2, '#86EFAC', 44, 68)],
  },

  linkerd: {
    story:
      'Linkerd’s ultralight Rust service-mesh pillars rise as three emerald proxy chevrons glide into a zero-trust bridge',
    groups: {
      pillars: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      chevrons: [10, 11, 12],
    },
    tracks: [
      {
        on: 'pillars',
        order: 'x',
        stagger: 2.0,
        each: true,
        keys: riseIn(10, 2.0),
      },
      {
        on: 'chevrons',
        order: 'y',
        stagger: 5,
        keys: dropIn(22, 2.2),
      },
    ],
    props: [packet(3.0, 10.5, 21.0, 10.5, '#6EE7B7', 30, 62, 0.85)],
  },

  nomad: {
    story:
      'Nomad’s emerald workload hexagon traces its perimeter and pulses smoothly as containers and binaries schedule across the cluster',
    tracks: [
      {
        on: 'all',
        keys: {
          10: { s: 0.9, r: -6, e: 'inout' },
          30: { s: 1.06, r: 4, e: 'settle' },
          54: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      radar(12, 12, 10.2, '#34D399', 14, 64, 110),
      pulseRing(12, 12, 9.0, '#00CA8E', 24, 58, { o: 0.6 }),
    ],
  },

  // ── Observability & Security ───────────────────────────────────────────────

  grafana: {
    story:
      'Grafana’s swirling dashboard flame rotates smoothly while live operational telemetry bars rise and pulse',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          10: { r: -20, s: 0.94, e: 'inout' },
          38: { r: 16, s: 1.04, e: 'settle' },
          62: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      telemetryBar(16.6, 15.8, 1.3, 4.4, '#FDBA74', 16, 56),
      telemetryBar(18.6, 13.8, 1.3, 6.4, '#FB923C', 22, 60),
      telemetryBar(20.6, 14.8, 1.3, 5.4, '#FDE047', 28, 64),
      pulseRing(12, 12, 10.0, '#F46800', 20, 56, { o: 0.55 }),
    ],
  },

  prometheus: {
    story:
      'Prometheus’s monitoring flame flares upward with warm time-series scraping sparks and an alert threshold pulse',
    tracks: [
      {
        on: 'all',
        origin: '50% 75%',
        keys: {
          10: { sy: 0.92, y: 0.6, e: 'inout' },
          26: { sy: 1.08, y: -0.8, e: 'settle' },
          44: { sy: 0.97, y: 0.2, e: 'inout' },
          60: { sy: 1, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#FB923C', 16, 56, { o: 0.65 }),
      spark(12, 2.4, 0, -1.6, '#FDE047', 22, 46),
      spark(17.4, 4.6, 1.4, -1.2, '#FCA5A5', 30, 54),
    ],
  },

  datadog: {
    story:
      'Bits the Datadog hound perks up with an alert nod while live APM telemetry bars and a full-stack observability radar sweep',
    groups: {
      head: 1,
      collar: 0,
      face: [2, 3, 4],
    },
    tracks: [
      { on: 'head', origin: '50% 60%', keys: nod(14, 6) },
      { on: 'collar', keys: riseIn(12, 1.6) },
      {
        on: 'face',
        each: true,
        keys: {
          32: { sy: 1, e: 'in' },
          38: { sy: 0.15, e: 'out' },
          44: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      radar(12, 12, 10.4, '#A855F7', 12, 62, 110),
      telemetryBar(2.4, 16.2, 1.3, 4.0, '#C084FC', 20, 58),
      telemetryBar(4.2, 14.6, 1.3, 5.6, '#A855F7', 26, 62),
    ],
  },

  sentry: {
    story:
      'Sentry’s real-time error-tracking emblem traces its protective arcs while an exception spark is caught and resolved cleanly',
    groups: {
      mark: 0,
    },
    tracks: [
      {
        on: 'mark',
        draw: [8, 34],
        fill: [26, 36],
        width: 0.65,
      },
    ],
    props: [
      pulseRing(12, 13, 9.6, '#C4B5FD', 22, 58, { o: 0.6 }),
      spark(18.2, 5.4, 1.6, -1.4, '#F87171', 26, 46),
      checkFlash(16.6, 17.6, '#4ADE80', 44, 68),
    ],
  },

  opentelemetry: {
    story:
      'OpenTelemetry’s golden nodes and blue telemetry lenses converge as distributed trace spans stream end-to-end',
    groups: {
      gold: [0, 1, 2],
      blue: [4, 5],
    },
    tracks: [
      {
        on: 'gold',
        order: 'x',
        stagger: 5,
        each: true,
        keys: popIn(10, 0.35),
      },
      {
        on: 'blue',
        stagger: 6,
        each: true,
        keys: slideIn(18, -1.8, 1.8),
      },
    ],
    props: [
      packet(4.2, 19.8, 18.2, 5.8, '#FDE047', 22, 56, 0.9),
      pulseRing(12, 12, 9.8, '#60A5FA', 30, 64, { o: 0.55 }),
    ],
  },

  vault: {
    story:
      'HashiCorp Vault’s geometric V-lock snaps shut with an encryption sheen and golden key-rotation pulse',
    tracks: [
      {
        on: 'all',
        keys: {
          10: { s: 0.9, e: 'in' },
          26: { s: 1.07, e: 'settle' },
          44: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#FDE047', 18, 56, { o: 0.7 }),
      sheen('<rect x="1.6" y="1.9" width="20.8" height="20.2" rx="1"/>', 36, 64, 0.32),
    ],
  },

  snyk: {
    story:
      'Snyk’s security hound braces its ears and shield as a dependency vulnerability radar sweeps clean and verifies zero CVEs',
    groups: {
      shield: 0,
      leftWing: 1,
      crest: 2,
      rightWing: 3,
    },
    tracks: [
      { on: 'shield', keys: heartbeat(12, 0.08) },
      { on: 'leftWing', keys: slideIn(14, -2.0, 0) },
      { on: 'rightWing', keys: slideIn(14, 2.0, 0) },
      { on: 'crest', keys: dropIn(20, 1.6) },
    ],
    props: [radar(12, 12, 10.4, '#A78BFA', 14, 62, 120), checkFlash(16.6, 5.4, '#4ADE80', 44, 68)],
  },

  tailscale: {
    story:
      'Tailscale’s 3x3 WireGuard mesh nodes illuminate in diagonal wave order while encrypted peer-to-peer packets hop across the grid',
    groups: {
      nodes: [8, 7, 6, 3, 2, 4, 0, 1, 5],
    },
    tracks: [
      {
        on: 'nodes',
        stagger: 3.2,
        each: true,
        keys: popIn(10, 0.35),
      },
    ],
    props: [
      packet(4.3, 4.3, 19.7, 19.7, '#38BDF8', 22, 54, 0.9),
      packet(19.7, 4.3, 4.3, 19.7, '#4ADE80', 30, 62, 0.9),
    ],
  },

  wireguard: {
    story:
      'WireGuard’s crimson kernel-VPN dragon coils taut inside its encrypted tunnel as a zero-overhead pulse radiates outward',
    groups: {
      coil: 0,
      crest: 1,
    },
    tracks: [
      {
        on: 'coil',
        origin: [12, 12],
        keys: {
          10: { r: -16, s: 0.92, e: 'inout' },
          36: { r: 10, s: 1.04, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
      { on: 'crest', keys: popIn(24, 0.3) },
    ],
    props: [pulseRing(12, 12, 10.2, '#F87171', 18, 58, { o: 0.65 })],
  },

  letsencrypt: {
    story:
      'Let’s Encrypt’s ACME padlock locks solidly as five sunburst rays flare outward to celebrate automated TLS certificate issuance',
    groups: {
      lock: 3,
      rays: [5, 2, 0, 1, 4],
    },
    tracks: [
      { on: 'lock', keys: riseIn(10, 2.0) },
      {
        on: 'rays',
        stagger: 4,
        each: true,
        keys: popIn(20, 0.25),
      },
    ],
    props: [checkFlash(16.8, 17.8, '#4ADE80', 44, 68)],
  },

  jaeger: {
    story:
      'Jaeger’s distributed tracing emblem sweeps with a cyan span radar while trace packets hop across microservices',
    tracks: [
      {
        on: 'all',
        origin: '50% 55%',
        keys: nod(14, 5.5),
      },
    ],
    props: [
      radar(12, 11.5, 10.2, '#66CFE3', 12, 62, 130),
      packet(4.5, 18.0, 19.0, 6.5, '#A5F3FC', 20, 56, 0.85),
    ],
  },

  kibana: {
    story:
      'Kibana’s three analytics visualization slices fan open and lock together as live Elasticsearch dashboard bars animate',
    groups: {
      top: 0,
      pillar: 2,
      bottom: 3,
    },
    tracks: [
      { on: 'top', keys: dropIn(10, 2.4) },
      { on: 'pillar', keys: slideIn(18, -2.2, 0) },
      { on: 'bottom', keys: riseIn(26, 2.4) },
    ],
    props: [
      telemetryBar(16.8, 15.2, 1.3, 4.6, '#F472B6', 24, 60),
      telemetryBar(18.8, 13.6, 1.3, 6.2, '#2DD4BF', 30, 64),
    ],
  },

  logstash: {
    story:
      'Logstash ingests events down its golden input tower, transforms them in the dark filter core, and emits them through the teal output',
    groups: {
      input: 2,
      core: 3,
      output: 0,
    },
    tracks: [
      { on: 'input', keys: dropIn(10, 2.4) },
      { on: 'core', keys: heartbeat(22, 0.12) },
      { on: 'output', keys: slideIn(30, -2.2, 0) },
    ],
    props: [
      packet(7.2, 3.0, 7.2, 18.5, '#FDE047', 14, 40, 0.9),
      packet(8.0, 18.9, 21.0, 18.9, '#2DD4BF', 34, 64, 0.9),
    ],
  },

  splunk: {
    story:
      'Splunk’s SIEM wordmark cascades left-to-right into the iconic search chevron as a real-time log query fires',
    groups: {
      chevron: 0,
      letters: [6, 5, 4, 3, 2, 1],
    },
    tracks: [
      {
        on: 'letters',
        stagger: 3.5,
        each: true,
        keys: riseIn(10, 1.8),
      },
      {
        on: 'chevron',
        keys: {
          28: { x: -2.0, s: 0.7, e: 'out' },
          42: { x: 0.6, s: 1.2, e: 'settle' },
          56: { x: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [spark(22.4, 11.9, 1.5, 0, '#4ADE80', 38, 60)],
  },

  newrelic: {
    story:
      'New Relic’s emerald observability cube pulses above its wordmark as full-stack telemetry spans stream across the platform',
    groups: {
      cube: [0, 2, 4],
    },
    tracks: [
      {
        on: 'all',
        keys: breathe(10, 0.04),
      },
      {
        on: 'cube',
        stagger: 4,
        each: true,
        keys: popIn(12, 0.45),
      },
    ],
    props: [
      pulseRing(12, 9.5, 7.2, '#1CE783', 20, 56, { o: 0.65 }),
      packet(2.5, 16.4, 21.5, 16.4, '#1CE783', 26, 60, 0.8),
    ],
  },

  dynatrace: {
    story:
      'Dynatrace’s six colorful observability ribbons weave clockwise into a unified AI-powered full-stack monitoring loop',
    groups: {
      ribbons: [0, 1, 2, 5, 4, 3],
    },
    tracks: [
      {
        on: 'ribbons',
        stagger: 4.5,
        each: true,
        keys: popIn(10, 0.5),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#38BDF8', 28, 64, { o: 0.55 })],
  },

  pagerduty: {
    story:
      'PagerDuty’s on-call P-beacon pulses with an urgent incident alert ring that resolves into a green acknowledgment check',
    groups: {
      loop: 0,
      stem: 1,
    },
    tracks: [
      { on: 'stem', keys: riseIn(10, 2.2) },
      { on: 'loop', keys: heartbeat(14, 0.12) },
    ],
    props: [
      pulseRing(12, 8.5, 8.8, '#4ADE80', 16, 54, { o: 0.75 }),
      checkFlash(16.6, 18.2, '#4ADE80', 42, 68),
    ],
  },

  owasp: {
    story:
      'OWASP’s application security wasp-shield locks solidly inside its outer frame while a ZAP vulnerability scanner sweeps the perimeter',
    groups: {
      inner: 0,
      outer: 1,
    },
    tracks: [
      { on: 'outer', keys: breathe(10, 0.05) },
      { on: 'inner', keys: popIn(16, 0.45) },
    ],
    props: [radar(12, 12, 10.4, '#38BDF8', 14, 62, 125), checkFlash(16.6, 5.4, '#86EFAC', 44, 68)],
  },

  trivy: {
    story:
      'Trivy’s concentric security prism layers scan inward from outer shell to core, locking in a clean container and IaC audit',
    groups: {
      outer: [0, 1, 2],
      mid: [3, 4, 5],
      inner: [6, 7, 8],
      core: 9,
    },
    tracks: [
      { on: 'outer', stagger: 2.5, each: true, keys: popIn(10, 0.75) },
      { on: 'mid', stagger: 2.5, each: true, keys: popIn(20, 0.65) },
      { on: 'inner', stagger: 2.5, each: true, keys: popIn(30, 0.55) },
      { on: 'core', keys: heartbeat(40, 0.2) },
    ],
    props: [checkFlash(16.8, 18.2, '#4ADE80', 46, 68)],
  },

  zerotier: {
    story:
      'ZeroTier’s encrypted P2P overlay arcs snap symmetrically inside the golden ring as peer packets bridge across networks',
    groups: {
      ring: 0,
      leftArc: 1,
      rightArc: 2,
    },
    tracks: [
      { on: 'ring', keys: breathe(10, 0.05) },
      { on: 'leftArc', keys: slideIn(14, -2.2, 0) },
      { on: 'rightArc', keys: slideIn(18, 2.2, 0) },
    ],
    props: [
      packet(4.5, 12, 19.5, 12, '#FDE047', 26, 58, 0.9),
      pulseRing(12, 12, 10.2, '#FFB441', 22, 60, { o: 0.6 }),
    ],
  },

  // ── Operating Systems & Kernel ─────────────────────────────────────────────

  ubuntu: {
    story:
      'Ubuntu’s Circle of Friends rotates smoothly in unison on its orange banner, celebrating community-driven cloud Linux',
    groups: {
      badge: 0,
      friends: [1, 2, 3, 4, 5, 6],
    },
    tracks: [
      { on: 'badge', keys: breathe(10, 0.04) },
      {
        on: 'friends',
        origin: [12.1, 15.3],
        keys: {
          12: { r: -40, e: 'inout' },
          44: { r: 24, e: 'settle' },
          64: { r: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#FB923C', 22, 60, { o: 0.55 })],
  },

  debian: {
    story: 'Debian’s iconic crimson spiral winds smoothly into a rock-solid universal Linux core',
    groups: {
      swirl: 5,
    },
    tracks: [
      {
        on: 'all',
        origin: [12.1, 12.1],
        keys: {
          10: { r: -36, s: 0.9, e: 'inout' },
          40: { r: 10, s: 1.04, e: 'settle' },
          62: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.0, '#F43F5E', 20, 58, { o: 0.55 })],
  },

  alpinelinux: {
    story:
      'Alpine Linux’s crisp mountain peak rises with minimal footprint and a brisk alpine sheen for ultra-lean containers',
    tracks: [
      {
        on: 'all',
        origin: '50% 80%',
        keys: {
          10: { y: 2.2, s: 0.9, e: 'out' },
          30: { y: -0.6, s: 1.04, e: 'settle' },
          50: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="1" y="2.4" width="22" height="19.2"/>', 34, 62, 0.3),
      spark(12, 3.2, 0, -1.5, '#7DD3FC', 24, 48),
    ],
  },

  archlinux: {
    story:
      'Arch Linux’s sharp rolling-release peak traces cleanly upward with a minimalist cyan summit spark',
    groups: {
      peak: 0,
    },
    tracks: [
      {
        on: 'peak',
        draw: [8, 36],
        fill: [28, 38],
        width: 0.65,
      },
    ],
    props: [
      spark(11.5, 2.2, 0, -1.5, '#38BDF8', 32, 56),
      pulseRing(12, 13, 9.4, '#1793D1', 28, 62, { o: 0.55 }),
    ],
  },

  redhat: {
    story:
      'Red Hat’s iconic crimson fedora tips forward with an enterprise nod and a crisp executive sheen',
    groups: {
      brim: 0,
      band: 1,
      crown: 3,
    },
    tracks: [
      {
        on: 'all',
        origin: '50% 65%',
        keys: {
          10: { r: -8, y: -0.6, e: 'inout' },
          28: { r: 6, y: 0.4, e: 'settle' },
          46: { r: -2, y: 0, e: 'inout' },
          60: { r: 0, y: 0, e: 'out' },
        },
      },
      { on: 'crown', keys: dropIn(12, 1.4) },
    ],
    props: [sheen('<rect x="1.5" y="2" width="21" height="20"/>', 38, 64, 0.25)],
  },

  fedora: {
    story:
      'Fedora’s blue community badge steadies while its white infinity-f loops trace and interlock in open-source harmony',
    groups: {
      badge: 0,
      loops: [5, 6],
    },
    tracks: [
      { on: 'badge', keys: breathe(10, 0.04) },
      {
        on: 'loops',
        stagger: 6,
        draw: [12, 36],
        fill: [30, 40],
        width: 0.7,
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#60A5FA', 28, 64, { o: 0.55 })],
  },

  freebsd: {
    story:
      'FreeBSD’s Beastie orb gives a playful devilish tilt while its twin horns perk up over a rock-solid UNIX pulse',
    groups: {
      orb: 3,
      leftHorn: 2,
      rightHorn: 1,
    },
    tracks: [
      { on: 'orb', origin: [11.4, 12.2], keys: nod(14, 7) },
      { on: 'leftHorn', keys: popIn(12, 0.5) },
      { on: 'rightHorn', keys: popIn(18, 0.5) },
    ],
    props: [pulseRing(11.4, 12.2, 9.8, '#F87171', 24, 60, { o: 0.55 })],
  },

  suse: {
    story:
      'SUSE’s Geeko chameleon curls forward with a sharp eye blink as an enterprise cloud-native Linux ring pulses behind',
    groups: {
      eye: 0,
      body: 1,
    },
    tracks: [
      { on: 'body', origin: '50% 60%', keys: nod(14, 5) },
      {
        on: 'eye',
        keys: {
          30: { sy: 1, e: 'in' },
          36: { sy: 0.1, e: 'out' },
          42: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#34D399', 20, 58, { o: 0.55 })],
  },

  kalilinux: {
    story:
      'Kali Linux’s stealth cyber-dragon swoops with sharpened wings across a penetration-testing security radar sweep',
    groups: {
      wing: 0,
      crest: 1,
      body: 2,
      ridge: 3,
    },
    tracks: [
      { on: 'body', origin: '50% 55%', keys: sway(10, 5, 0.6) },
      { on: 'wing', keys: slideIn(12, -2.0, -1.0) },
      { on: 'crest', keys: slideIn(18, 1.8, -0.8) },
      { on: 'ridge', keys: slideIn(22, -1.6, -1.2) },
    ],
    props: [radar(12, 12, 10.4, '#38BDF8', 12, 64, 135)],
  },

  centos: {
    story:
      'CentOS’s four-color enterprise compass arrows converge symmetrically toward the center core',
    groups: {
      left: 0,
      top: 2,
      bottom: 4,
      right: 6,
      inners: [8, 10, 12],
    },
    tracks: [
      { on: 'top', keys: slideIn(10, 0, -2.4) },
      { on: 'right', keys: slideIn(14, 2.4, 0) },
      { on: 'bottom', keys: slideIn(18, 0, 2.4) },
      { on: 'left', keys: slideIn(22, -2.4, 0) },
      { on: 'inners', stagger: 4, each: true, keys: popIn(26, 0.45) },
    ],
    props: [pulseRing(12, 12, 10.0, '#A4A3C6', 32, 66, { o: 0.55 })],
  },

  // ── Virtualization & Cloud ─────────────────────────────────────────────────

  proxmox: {
    story:
      'Proxmox VE’s interlocking virtualization chevrons slide cleanly together as KVM and LXC hypervisor pulses ignite',
    groups: {
      topChev: 10,
      botChev: 11,
      glyphs: [0, 1, 2, 3, 5, 6, 7, 8, 9],
    },
    tracks: [
      { on: 'topChev', keys: dropIn(10, 2.0) },
      { on: 'botChev', keys: riseIn(14, 2.0) },
      {
        on: 'glyphs',
        order: 'x',
        stagger: 2.2,
        each: true,
        keys: popIn(18, 0.55),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#FB923C', 28, 64, { o: 0.55 })],
  },

  packer: {
    story:
      'Packer’s machine-image core snaps cleanly into its outer multi-cloud mold with a golden-image verification check',
    groups: {
      core: 0,
      mold: 2,
    },
    tracks: [
      { on: 'mold', keys: slideIn(10, 2.2, -1.2) },
      { on: 'core', keys: slideIn(18, -2.2, 1.2) },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#38BDF8', 26, 60, { o: 0.6 }),
      checkFlash(16.6, 5.2, '#86EFAC', 42, 68),
    ],
  },

  vagrant: {
    story:
      'Vagrant’s isometric V-pillars drop and lock into a reproducible, portable virtual development box',
    groups: {
      rightPillar: 0,
      leftPillar: 1,
      frame: 2,
    },
    tracks: [
      { on: 'frame', keys: breathe(10, 0.05) },
      { on: 'leftPillar', keys: dropIn(14, 2.6) },
      { on: 'rightPillar', keys: dropIn(22, 2.6) },
    ],
    props: [
      guides(
        [
          [12, 2, 12, 22],
          [3, 12, 21, 12],
        ],
        '#60A5FA',
        12,
        56
      ),
      pulseRing(12, 12, 9.8, '#38BDF8', 28, 62, { o: 0.55 }),
    ],
  },

  virtualbox: {
    story:
      'VirtualBox’s 3D hypervisor cube steadies while its inner virtualization pulse traces across the upper facet',
    groups: {
      cube: 0,
      topWave: 1,
    },
    tracks: [
      { on: 'cube', keys: breathe(10, 0.05) },
      {
        on: 'topWave',
        draw: [14, 38],
        fill: [32, 42],
        width: 0.7,
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#60A5FA', 24, 60, { o: 0.6 })],
  },

  qemu: {
    story:
      'QEMU’s machine-emulator emblem nods briskly with an eye blink as cross-architecture emulation rings pulse outward',
    groups: {
      body: 0,
      eye: 1,
    },
    tracks: [
      { on: 'body', origin: '50% 60%', keys: nod(14, 6) },
      {
        on: 'eye',
        keys: {
          32: { sy: 1, e: 'in' },
          38: { sy: 0.12, e: 'out' },
          44: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      radar(12, 12, 10.2, '#FB923C', 14, 62, 115),
      spark(18.6, 5.4, 1.5, -1.2, '#FDE047', 26, 48),
    ],
  },

  vmware: {
    story:
      'VMware’s five enterprise hypervisor segments cascade left-to-right into alignment over a virtualized cluster pulse',
    groups: {
      segments: [0, 2, 4, 1, 3],
    },
    tracks: [
      {
        on: 'segments',
        stagger: 4.5,
        each: true,
        keys: riseIn(10, 2.2),
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#94A3B8', 24, 60, { o: 0.55 }),
      packet(3.0, 12, 21.0, 12, '#38BDF8', 28, 60, 0.8),
    ],
  },

  cloudflareworkers: {
    story:
      'Cloudflare Workers three orange V8-isolate chevron blades snap together in sequence as zero-cold-start edge packets fire across the globe',
    tracks: [
      {
        on: [2, 0, 1],
        each: true,
        stagger: 4.8,
        keys: slideIn(10, -2.4, 0),
      },
    ],
    props: [
      boltFlash(17.8, 4.2, '#FDE047', 26, 54),
      packet(3.0, 12.0, 21.0, 12.0, '#FDBA74', 30, 58, 0.9),
    ],
  },

  cloudflarepages: {
    story:
      'Cloudflare Pages edge deployment window traces its frame while its three browser dots pop in and static-to-edge build slices lock into place',
    groups: {
      frame: 0,
      dots: [1, 2, 3],
      slices: [5, 4, 6, 7],
    },
    tracks: [
      { on: 'frame', draw: [8, 30], fill: [22, 34], width: 0.6 },
      { on: 'dots', each: true, stagger: 3.5, keys: popIn(18, 0.25) },
      { on: 'slices', each: true, stagger: 3.5, keys: slideIn(24, 2.0, 0) },
    ],
    props: [checkFlash(16.8, 5.0, '#4ADE80', 44, 66)],
  },

  coolify: {
    story:
      'Coolify seven violet self-hosting bars cascade smoothly into a stacked C-badge as a fresh container deployment confirms',
    tracks: [
      {
        on: [0, 1, 2, 3, 4, 5, 6],
        order: 'y',
        each: true,
        stagger: 3.0,
        keys: slideIn(10, -2.2, 0),
      },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#C084FC', 30, 62, { layer: 'under', sw: 0.55 }),
      checkFlash(16.8, 5.0, '#4ADE80', 42, 66),
    ],
  },

  caprover: {
    story:
      'CapRover self-hosted Docker PaaS crest turns gently like a captain compass while its inner sails lock cleanly into course',
    groups: { outer: 0, sails: [1, 2, 3] },
    tracks: [
      { on: 'outer', origin: [12, 12], keys: sway(10, 5, 0.4) },
      { on: 'sails', each: true, stagger: 4, keys: slideIn(16, -2.0, 0) },
    ],
    props: [pulseRing(12, 12, 10.2, '#FDBA74', 28, 60, { layer: 'under', sw: 0.55 })],
  },

  alibabacloud: {
    story:
      'Alibaba Cloud twin orange brackets converge around the central link bar as global compute packets stream cleanly across the bridge',
    groups: { left: 0, right: 1, bridge: 2 },
    tracks: [
      { on: 'left', keys: slideIn(10, -2.4, 0) },
      { on: 'right', keys: slideIn(14, 2.4, 0) },
      { on: 'bridge', keys: popIn(20, 0.35) },
    ],
    props: [packet(5.0, 12.0, 19.0, 12.0, '#FDE047', 28, 56, 0.9)],
  },

  backblaze: {
    story:
      'Backblaze three crimson flame tongues rise in staggered cadence like hot B2 cloud storage firing up with glowing sparks',
    tracks: [{ on: [2, 1, 0], each: true, stagger: 4.8, keys: riseIn(10, 2.4) }],
    props: [
      spark(17.8, 5.2, 1.6, -1.8, '#FDBA74', 28, 52),
      pulseRing(12, 12, 10.2, '#FCA5A5', 30, 62, { layer: 'under', sw: 0.55 }),
    ],
  },

  wasabi: {
    story:
      'Wasabi emerald hot-cloud emblem blooms cleanly from its center with a crisp zero-egress pulse ring and diagonal sheen',
    tracks: [{ on: 0, draw: [8, 32], fill: [24, 36], width: 0.65, keys: popIn(10, 0.8) }],
    props: [
      pulseRing(12, 12, 10.2, '#86EFAC', 22, 58, { layer: 'under', sw: 0.6 }),
      sheen('<circle cx="12" cy="12" r="10.4"/>', 36, 64, 0.28),
    ],
  },

  talos: {
    story:
      'Talos five symmetric immutable-OS ribs rise outward from the central spine into a hardened API-driven Kubernetes shield',
    tracks: [{ on: [4, 0, 1, 3, 2], each: true, stagger: 3.6, keys: riseIn(10, 2.4) }],
    props: [pulseRing(12, 12, 10.2, '#FDBA74', 32, 62, { layer: 'under', sw: 0.55 })],
  },

  skaffold: {
    story:
      'Skaffold four blue continuous-dev scaffolding tiers slide into alignment in alternating directions as a Kubernetes rebuild completes',
    tracks: [
      { on: [2, 1], each: true, stagger: 4.5, keys: slideIn(10, -2.4, 0) },
      { on: [3, 0], each: true, stagger: 4.5, keys: slideIn(14, 2.4, 0) },
    ],
    props: [checkFlash(16.8, 5.0, '#7DD3FC', 40, 66)],
  },

  devbox: {
    story:
      'Devbox Nix-powered workspace brackets clamp around the isolated shell core while a crisp reproducible environment check confirms',
    groups: { right: 0, left: 1, core: 2 },
    tracks: [
      { on: 'core', keys: popIn(10, 0.6) },
      { on: 'left', keys: slideIn(16, -2.4, 0) },
      { on: 'right', keys: slideIn(20, 2.4, 0) },
    ],
    props: [checkFlash(16.8, 4.8, '#C084FC', 40, 66)],
  },

  gitpod: {
    story:
      'Gitpod golden hexagonal workspace traces its ephemeral cloud contour and gleams with a crisp ready-to-code sheen',
    tracks: [{ on: 0, draw: [8, 34], fill: [26, 38], width: 0.65, keys: breathe(12, 0.05) }],
    props: [
      sheen('<rect x="2" y="1" width="20" height="22" rx="3"/>', 34, 62, 0.3),
      spark(18.6, 5.2, 1.6, -1.6, '#FEF08A', 38, 60),
    ],
  },

  coder: {
    story:
      'Coder cloud workspace left and right emblem halves lock cleanly together as a Terraform-provisioned environment check flashes',
    groups: { right: 0, left: 1 },
    tracks: [
      { on: 'left', keys: slideIn(10, -2.4, 0) },
      { on: 'right', keys: slideIn(16, 2.4, 0) },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#94A3B8', 26, 58, { layer: 'under', sw: 0.55 }),
      checkFlash(16.8, 5.2, '#4ADE80', 40, 66),
    ],
  },

  pangolin: {
    story:
      'Pangolin armored proxy mascot curls into a protective zero-trust stance while a tunnel radar ring sweeps cleanly around it',
    tracks: [
      { on: 0, origin: [12, 12], draw: [8, 32], fill: [24, 36], width: 0.6, keys: nod(14, 5.5) },
    ],
    props: [radar(12, 12, 10.4, '#FDBA74', 18, 62, 120)],
  },

  ngrok: {
    story:
      'ngrok five wordmark letters cascade left-to-right as a secure localhost ingress tunnel packet shoots straight across the bridge',
    tracks: [{ on: [3, 2, 4, 1, 0], each: true, stagger: 3.6, keys: riseIn(10, 2.0) }],
    props: [
      packet(2.5, 17.2, 21.5, 17.2, '#38BDF8', 26, 56, 0.9),
      checkFlash(16.8, 5.0, '#4ADE80', 42, 66),
    ],
  },

  falco: {
    story:
      'Falco six teal falcon wing feathers fan swiftly into formation as an eBPF runtime threat-detection radar sweeps cleanly across',
    tracks: [{ on: [0, 1, 3, 2, 4, 5], each: true, stagger: 3.0, keys: slideIn(10, -2.0, -1.2) }],
    props: [radar(12, 12, 10.4, '#67E8F9', 22, 62, 120)],
  },
};
