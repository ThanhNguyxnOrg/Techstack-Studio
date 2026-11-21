// Backend stories: 67 bespoke animations for web frameworks, runtimes, APIs,
// proxies, messaging brokers, task queues, auth providers, and headless CMSes.
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
  express: {
    story:
      'Express minimalist e-x mark snaps into middleware formation as incoming HTTP request and outgoing response packets zip cleanly through the pipeline',
    groups: {
      e: 2,
      frame: 1,
      x: 0,
    },
    tracks: [
      {
        on: 'frame',
        keys: {
          10: { sx: 0.94, e: 'inout' },
          30: { sx: 1.03, e: 'settle' },
          56: { sx: 1, e: 'out' },
        },
      },
      {
        on: 'e',
        keys: slideIn(10, -2.4, 0),
      },
      {
        on: 'x',
        keys: slideIn(16, 2.4, 0),
      },
    ],
    props: [
      packet(2.5, 9.2, 21.5, 9.2, '#38BDF8', 18, 44, 0.9),
      packet(21.5, 14.8, 2.5, 14.8, '#4ADE80', 34, 62, 0.9),
    ],
  },

  fastapi: {
    story:
      'FastAPI teal badge discharges an async lightning surge as non-blocking coroutine packets race out and an OpenAPI schema check flashes green',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        fill: [22, 32],
        width: 0.65,
        keys: {
          18: { s: 0.92, r: -4, e: 'in' },
          30: { s: 1.08, r: 3, e: 'settle' },
          46: { s: 0.98, r: -1, e: 'inout' },
          60: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#2DD4BF', 24, 54),
      boltFlash(13.2, 6.2, '#FDE047', 22, 48),
      checkFlash(16.6, 5.4, '#86EFAC', 44, 66),
    ],
  },

  springboot: {
    story:
      'Spring Boot leaf-shield powers up as its central boot switch presses in, illuminating the power ring with an auto-configured green energy wave',
    groups: {
      shield: 0,
      stem: 1,
      ring: 2,
    },
    tracks: [
      {
        on: 'shield',
        keys: {
          12: { s: 0.93, e: 'inout' },
          28: { s: 1.05, e: 'settle' },
          48: { s: 1, e: 'out' },
        },
      },
      {
        on: 'stem',
        keys: {
          14: { y: -2.2, o: 0.3, e: 'in' },
          26: { y: 0.5, o: 1, e: 'settle' },
          38: { y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'ring',
        origin: [12, 12.1],
        keys: {
          16: { s: 0.72, r: -24, e: 'inout' },
          34: { s: 1.12, r: 10, e: 'settle' },
          52: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.4, '#86EFAC', 26, 58),
      spark(18.5, 5.2, 1.8, -1.6, '#BEF264', 28, 48),
    ],
  },

  dotnet: {
    story:
      'The .NET runtime wordmark compiles left-to-right from its leading dot through N, E, and T while a CLR JIT pulse sweeps cleanly across the letters',
    groups: {
      letters: [3, 2, 1, 0],
    },
    tracks: [
      {
        on: 'letters',
        each: true,
        stagger: 5,
        keys: {
          10: { y: 2.8, s: 0.75, o: 0.15, e: 'out' },
          24: { y: -0.5, s: 1.08, o: 1, e: 'settle' },
          36: { y: 0, s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="0.5" y="7" width="23" height="10" rx="2"/>', 42, 66, 0.32),
      pulseRing(12, 12, 9.8, '#A78BFA', 34, 62),
    ],
  },

  django: {
    story:
      'Django batteries-included d-j monogram snaps upright as the j-dot bounces playfully into place and a green ORM query ring confirms readiness',
    groups: {
      d: 0,
      jStem: 1,
      jDot: 2,
    },
    tracks: [
      {
        on: 'd',
        keys: slideIn(10, -2.2, 0),
      },
      {
        on: 'jStem',
        keys: riseIn(16, 2.8),
      },
      {
        on: 'jDot',
        keys: {
          18: { y: -3.4, s: 0.4, o: 0, e: 'in' },
          30: { y: 0.6, s: 1.22, o: 1, e: 'settle' },
          40: { y: -0.9, s: 0.94, o: 1, e: 'inout' },
          52: { y: 0, s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(18.7, 2.9, 2.4, '#6EE7B7', 28, 52, { layer: 'over' }),
      checkFlash(3.4, 18.6, '#6EE7B7', 44, 66),
    ],
  },

  flask: {
    story:
      'Flask chili-horn microframework tilts to pour a crisp WSGI request drop as three minimal blueprint segments cascade smoothly into alignment',
    groups: {
      top: 0,
      mid: 1,
      base: 2,
    },
    tracks: [
      {
        on: 'top',
        origin: '80% 80%',
        keys: {
          10: { r: -14, y: -1.4, e: 'inout' },
          32: { r: 7, y: 0.4, e: 'settle' },
          54: { r: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'mid',
        keys: slideIn(16, -2.0, 1.2),
      },
      {
        on: 'base',
        keys: slideIn(22, 2.2, 0.8),
      },
    ],
    props: [
      packet(5.4, 9.5, 16.5, 16.8, '#7DD3FC', 22, 52, 0.95),
      pulseRing(16.5, 16.8, 2.6, '#38BDF8', 44, 66, { layer: 'over' }),
    ],
  },

  nestjs: {
    story:
      'NestJS crimson feline emblem perks its ear tuft and surges forward as dependency-injection modules wire together inside a crisp radar ring',
    groups: {
      ear: 0,
      head: 1,
    },
    tracks: [
      {
        on: 'head',
        origin: '50% 55%',
        keys: {
          12: { s: 0.92, r: -4, e: 'inout' },
          30: { s: 1.05, r: 3, e: 'settle' },
          52: { s: 1, r: 0, e: 'out' },
        },
      },
      {
        on: 'ear',
        origin: '50% 100%',
        keys: {
          14: { r: -16, y: 0.8, e: 'in' },
          28: { r: 12, y: -0.5, e: 'settle' },
          44: { r: -4, y: 0.1, e: 'inout' },
          58: { r: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      radar(12, 12, 10.2, '#FB7185', 14, 64, 110),
      spark(17.8, 4.6, 1.8, -1.4, '#FDA4AF', 26, 46),
    ],
  },

  laravel: {
    story:
      'Laravel isometric crimson ribbon traces its artisan architectural geometry and gleams with a diagonal sheen as an MVC route resolves',
    tracks: [
      {
        on: 0,
        draw: [8, 36],
        fill: [28, 38],
        width: 0.65,
        keys: {
          12: { y: 1.4, s: 0.94, e: 'inout' },
          34: { y: -0.6, s: 1.03, e: 'settle' },
          56: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="1.5" y="1.5" width="21" height="21" rx="2"/>', 42, 66, 0.3),
      spark(18.6, 4.8, 1.8, -1.6, '#FCA5A5', 34, 54),
    ],
  },

  graphql: {
    story:
      'GraphQL hexagon and inner schema triangle trace into place while all six vertex nodes pop alive and typed query packets hop between graph vertices',
    groups: {
      hex: 0,
      tri: 1,
      nodes: [2, 3, 4, 5, 6, 7],
    },
    tracks: [
      {
        on: 'hex',
        draw: [8, 30],
        fill: [24, 32],
        width: 0.85,
      },
      {
        on: 'tri',
        draw: [14, 36],
        fill: [30, 38],
        width: 0.85,
      },
      {
        on: 'nodes',
        each: true,
        stagger: 3.2,
        keys: {
          12: { s: 0.25, o: 0.2, e: 'in' },
          24: { s: 1.28, o: 1, e: 'settle' },
          34: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(12, 2.8, 20, 16.7, '#F472B6', 28, 52, 0.95),
      packet(20, 16.7, 4, 16.7, '#38BDF8', 40, 64, 0.95),
      packet(4, 7.3, 12, 2.8, '#FDE047', 46, 68, 0.9),
    ],
  },

  nginx: {
    story:
      'Nginx green hexagon anchors steady as its N routing path draws through and reverse-proxy traffic splits from one ingress into two upstream backends',
    groups: {
      hex: 0,
      n: 1,
    },
    tracks: [
      {
        on: 'hex',
        keys: breathe(10, 0.05),
      },
      {
        on: 'n',
        draw: [10, 34],
        fill: [28, 36],
        width: 1.2,
      },
    ],
    props: [
      packet(2.2, 12, 11.2, 12, '#86EFAC', 14, 36, 0.95),
      packet(12.5, 12, 21.5, 7.2, '#38BDF8', 34, 58, 0.9),
      packet(12.5, 12, 21.5, 16.8, '#38BDF8', 38, 62, 0.9),
    ],
  },

  rabbitmq: {
    story:
      'RabbitMQ orange broker hops briskly on its queue cycle as AMQP messages arrive on the left exchange and dispatch cleanly out the right consumer channel',
    tracks: [
      {
        on: 0,
        origin: '50% 85%',
        keys: {
          10: { y: 0.6, sy: 0.92, sx: 1.05, e: 'in' },
          22: { y: -2.2, sy: 1.07, sx: 0.95, e: 'out' },
          34: { y: 0.5, sy: 0.93, sx: 1.04, e: 'settle' },
          46: { y: -1.0, sy: 1.03, sx: 0.98, e: 'inout' },
          58: { y: 0, sy: 1, sx: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(1.8, 13.5, 9.5, 13.5, '#FDE047', 12, 36, 0.95),
      packet(14.5, 13.5, 22.2, 13.5, '#4ADE80', 36, 62, 0.95),
      pulseRing(12, 12, 9.8, '#FDBA74', 24, 54),
    ],
  },

  deno: {
    story:
      'Deno sauropod peeks out inside its secure sandbox ring, blinks knowingly, and flashes a green permission-granted checkmark',
    groups: {
      dino: 0,
      eye: 1,
    },
    tracks: [
      {
        on: 'dino',
        origin: '50% 60%',
        keys: nod(14, 6),
      },
      {
        on: 'eye',
        each: true,
        keys: {
          26: { sy: 1, e: 'in' },
          31: { sy: 0.1, e: 'out' },
          37: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [radar(12, 12, 10.6, '#38BDF8', 10, 62, 90), checkFlash(16.6, 5.2, '#86EFAC', 42, 66)],
  },

  bun: {
    story:
      'Bun steamed dumpling mascot squishes and springs upward with sub-millisecond cold-start energy while warm steam wisps curl above its head',
    tracks: [
      {
        on: 0,
        origin: '50% 88%',
        keys: {
          10: { sy: 0.86, sx: 1.1, y: 0.8, e: 'in' },
          24: { sy: 1.1, sx: 0.92, y: -1.8, e: 'settle' },
          38: { sy: 0.94, sx: 1.05, y: 0.3, e: 'inout' },
          52: { sy: 1.03, sx: 0.98, y: -0.4, e: 'settle' },
          64: { sy: 1, sx: 1, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      {
        layer: 'over',
        svg: '<path d="M9.5 4.2 Q8.8 2.8 9.6 1.8 M14.5 4.2 Q15.2 2.8 14.4 1.8" fill="none" stroke="#FDE68A" stroke-width="0.7" stroke-linecap="round"/>',
        keys: {
          22: { y: 1.2, o: 0, e: 'out' },
          34: { y: 0, o: 0.9, e: 'inout' },
          52: { y: -1.4, o: 0, e: 'out' },
        },
      },
      boltFlash(19.2, 4.6, '#FDE047', 20, 46),
    ],
  },

  rubyonrails: {
    story:
      'Ruby on Rails sweeping track draws into view as all ten railway sleepers click into place along the curve and an express convention packet speeds down the rails',
    groups: {
      rail: 0,
      ties: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    tracks: [
      {
        on: 'rail',
        draw: [8, 30],
        fill: [22, 32],
        width: 0.65,
      },
      {
        on: 'ties',
        order: '-y',
        each: true,
        stagger: 2.2,
        keys: {
          12: { s: 0.25, o: 0, e: 'in' },
          24: { s: 1.22, o: 1, e: 'settle' },
          34: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(3.0, 17.5, 19.5, 7.5, '#FB7185', 32, 62, 1.0),
      spark(19.5, 7.2, 1.8, -1.2, '#FDE047', 54, 68),
    ],
  },

  fastify: {
    story:
      'Fastify low-overhead speed hull surges forward as its three inner chevron streaks fire in rapid succession and wind lines trail behind',
    groups: {
      hull: [0, 2],
      streaks: [3, 5, 4],
    },
    tracks: [
      {
        on: 'hull',
        keys: {
          10: { x: -1.8, e: 'in' },
          24: { x: 1.4, e: 'settle' },
          44: { x: 0.3, e: 'inout' },
          58: { x: 0, e: 'out' },
        },
      },
      {
        on: 'streaks',
        each: true,
        stagger: 4.5,
        keys: {
          12: { x: -3.2, o: 0, e: 'out' },
          24: { x: 0.4, o: 1, e: 'settle' },
          36: { x: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(2.2, 8.8, 3.2, -0.4, '#38BDF8', 16, 40),
      spark(1.6, 12.0, 3.8, 0.35, '#FDE047', 22, 46),
      spark(2.6, 15.2, 3.0, -0.4, '#38BDF8', 28, 52),
    ],
  },

  hono: {
    story:
      'Hono edge-runtime flame dances upward with kinetic flicker while glowing embers rise off the tip like ultrafast Workers requests',
    tracks: [
      {
        on: 0,
        origin: '50% 90%',
        keys: {
          10: { sy: 0.92, sx: 1.06, r: -3, e: 'inout' },
          24: { sy: 1.09, sx: 0.94, r: 4, e: 'inout' },
          38: { sy: 0.96, sx: 1.03, r: -3, e: 'inout' },
          52: { sy: 1.05, sx: 0.97, r: 2, e: 'settle' },
          64: { sy: 1, sx: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(11.4, 7.0, 10.2, 1.8, '#FDE047', 16, 46, 0.85),
      packet(13.2, 8.2, 14.8, 2.4, '#FB923C', 28, 58, 0.8),
      pulseRing(12, 14, 7.6, '#FDBA74', 22, 54),
    ],
  },

  gin: {
    story:
      'Gin Go HTTP gopher-martini gives a lively cocktail shake while its eyes blink and garnish bubbles fizz cleanly from the glass rim',
    groups: {
      body: 0,
      eyes: [6, 7],
      rim: [8, 9, 1],
      features: [2, 3, 4, 5],
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 80%',
        keys: sway(10, 6, 0.5),
      },
      {
        on: 'rim',
        order: 'x',
        stagger: 3,
        keys: dropIn(12, 2.0),
      },
      {
        on: 'eyes',
        each: true,
        keys: {
          34: { sy: 1, e: 'in' },
          39: { sy: 0.12, e: 'out' },
          45: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(9.5, 5.2, 8.8, 1.8, '#7DD3FC', 20, 48, 0.75),
      packet(13.8, 4.8, 14.6, 1.6, '#38BDF8', 30, 58, 0.75),
    ],
  },

  phoenixframework: {
    story:
      'Phoenix Elixir firebird fans its eight layered wing feathers outward from the core and rises on a fault-tolerant LiveView thermal',
    groups: {
      wings: [0, 1, 2, 3, 4, 5, 6, 7],
    },
    tracks: [
      {
        on: 'wings',
        order: 'r',
        each: true,
        stagger: 3.2,
        keys: {
          10: { y: 2.2, s: 0.72, o: 0.25, e: 'out' },
          24: { y: -0.7, s: 1.08, o: 1, e: 'settle' },
          38: { y: 0, s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#FB923C', 24, 58),
      spark(18.2, 5.2, 2.0, -1.8, '#FDE047', 30, 52),
    ],
  },

  symfony: {
    story:
      'Symfony circular S-F emblem traces its reusable component contours and rotates with poised architectural precision',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        draw: [8, 34],
        fill: [26, 36],
        width: 0.6,
        keys: {
          14: { r: -10, s: 0.95, e: 'inout' },
          36: { r: 6, s: 1.03, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [radar(12, 12, 10.6, '#CBD5E1', 16, 64, 90)],
  },

  quarkus: {
    story:
      'Quarkus supersonic GraalVM shards snap radially into its Kubernetes-native lattice in a sub-second native-image boot burst',
    groups: {
      shards: (parts) => parts.filter((p) => p.box && p.box.width > 0.5).map((p) => p.i),
    },
    tracks: [
      {
        on: 'shards',
        order: 'a',
        each: true,
        stagger: 1.8,
        keys: {
          10: { s: 0.35, o: 0.1, e: 'in' },
          24: { s: 1.15, o: 1, e: 'settle' },
          36: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#60A5FA', 28, 60), boltFlash(18.8, 3.8, '#F43F5E', 24, 50)],
  },

  ktor: {
    story:
      'Ktor dual asynchronous Kotlin wings glide diagonally into lock around the central dark core as coroutine streams cross in full duplex',
    groups: {
      topLeft: 0,
      bottomRight: 2,
      core: 4,
    },
    tracks: [
      {
        on: 'topLeft',
        keys: slideIn(10, -2.6, -2.6),
      },
      {
        on: 'bottomRight',
        keys: slideIn(14, 2.6, 2.6),
      },
      {
        on: 'core',
        origin: [12, 12],
        keys: {
          16: { s: 0.4, r: -45, o: 0.2, e: 'inout' },
          36: { s: 1.14, r: 8, o: 1, e: 'settle' },
          52: { s: 1, r: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(4.5, 4.5, 19.5, 19.5, '#60A5FA', 26, 56, 0.9),
      packet(19.5, 19.5, 4.5, 4.5, '#A78BFA', 34, 64, 0.9),
    ],
  },

  actix: {
    story:
      'Actix Web Rust actor emblem locks with crisp mechanical torque and fires concurrent worker sparks across its sharp geometry',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        keys: torque(12, 16, 32),
      },
    ],
    props: [
      spark(18.6, 4.8, 2.0, -1.8, '#38BDF8', 24, 44),
      spark(5.2, 19.2, -2.0, 1.8, '#F59E0B', 42, 62),
      pulseRing(12, 12, 9.8, '#94A3B8', 28, 58),
    ],
  },

  socketdotio: {
    story:
      'Socket.IO outer channel ring pulses while its opposing upper and lower lightning bolts exchange low-latency bidirectional real-time events',
    groups: {
      ring: 0,
      upperBolt: 1,
      lowerBolt: 2,
    },
    tracks: [
      {
        on: 'ring',
        origin: [12, 12],
        keys: heartbeat(12, 0.06),
      },
      {
        on: 'upperBolt',
        keys: {
          12: { x: -2.0, y: 1.4, e: 'in' },
          26: { x: 1.0, y: -0.7, e: 'settle' },
          44: { x: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'lowerBolt',
        keys: {
          20: { x: 2.0, y: -1.4, e: 'in' },
          34: { x: -1.0, y: 0.7, e: 'settle' },
          52: { x: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 10.4, '#38BDF8', 22, 56),
      packet(7.2, 16.5, 16.8, 7.5, '#FDE047', 16, 42, 0.85),
      packet(16.8, 7.5, 7.2, 16.5, '#4ADE80', 36, 62, 0.85),
    ],
  },

  openapiinitiative: {
    story:
      'OpenAPI specification segments cascade radially around the contract ring, locking schemas and endpoints into a unified HTTP standard',
    groups: {
      segments: (parts) => parts.filter((p) => p.box && p.box.width > 0.5).map((p) => p.i),
    },
    tracks: [
      {
        on: 'segments',
        order: 'a',
        each: true,
        stagger: 1.6,
        keys: {
          10: { s: 0.55, o: 0.2, e: 'out' },
          24: { s: 1.12, o: 1, e: 'settle' },
          36: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [radar(12, 12, 10.6, '#86EFAC', 14, 62, 100), checkFlash(16.8, 5.2, '#BEF264', 44, 66)],
  },

  swagger: {
    story:
      'Swagger curly braces breathe outward to frame an API endpoint while its three central ellipsis dots ripple sequentially like a live JSON payload',
    groups: {
      bg: 0,
      ring: 6,
      leftBrace: 1,
      rightBrace: 5,
      dots: [2, 3, 4],
    },
    tracks: [
      {
        on: 'bg',
        keys: breathe(10, 0.04),
      },
      {
        on: 'leftBrace',
        keys: {
          12: { x: -1.8, e: 'inout' },
          36: { x: 0.3, e: 'settle' },
          52: { x: 0, e: 'out' },
        },
      },
      {
        on: 'rightBrace',
        keys: {
          12: { x: 1.8, e: 'inout' },
          36: { x: -0.3, e: 'settle' },
          52: { x: 0, e: 'out' },
        },
      },
      {
        on: 'dots',
        order: 'x',
        each: true,
        stagger: 5.5,
        keys: {
          16: { y: 0, s: 0.7, e: 'in' },
          28: { y: -1.6, s: 1.32, e: 'settle' },
          40: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.4, '#BEF264', 24, 58)],
  },

  caddy: {
    story:
      'Caddy automatic-HTTPS padlock snaps shut inside its azure badge and flashes a verified TLS certificate checkmark',
    groups: {
      badge: 0,
      lock: 1,
    },
    tracks: [
      {
        on: 'badge',
        keys: breathe(10, 0.05),
      },
      {
        on: 'lock',
        keys: {
          12: { y: -2.2, s: 0.9, e: 'in' },
          26: { y: 0.4, s: 1.08, e: 'settle' },
          40: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#38BDF8', 24, 56), checkFlash(16.6, 5.2, '#86EFAC', 36, 64)],
  },

  traefikproxy: {
    story:
      'Traefik cloud-native ingress router steers incoming edge traffic cleanly onto dynamic service routes while a discovery radar sweeps behind it',
    tracks: [
      {
        on: 0,
        origin: '50% 55%',
        keys: nod(14, 6),
      },
    ],
    props: [
      radar(12, 12, 10.6, '#38BDF8', 10, 62, 120),
      packet(2.2, 8.5, 11.2, 11.5, '#7DD3FC', 14, 38, 0.9),
      packet(12.8, 11.5, 21.8, 7.5, '#4ADE80', 36, 62, 0.9),
      packet(12.8, 12.5, 21.8, 16.5, '#4ADE80', 40, 66, 0.9),
    ],
  },

  envoyproxy: {
    story:
      'Envoy service-mesh proxy planes fan into layered alignment as L7 telemetry packets pass smoothly through the sidecar filter chain',
    groups: {
      planes: [0, 1, 2, 3, 4, 5],
    },
    tracks: [
      {
        on: 'planes',
        order: 'x',
        each: true,
        stagger: 3.5,
        keys: {
          10: { x: -2.0, o: 0.25, e: 'out' },
          26: { x: 0.25, o: 1, e: 'settle' },
          38: { x: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(2.5, 12, 21.5, 12, '#E879F9', 26, 56, 0.95),
      pulseRing(12, 12, 10.2, '#C084FC', 32, 62),
    ],
  },

  kong: {
    story:
      'Kong geometric gorilla facets lock together like an armored API gateway while authenticated requests clear the rate-limit checkpoint',
    groups: {
      facets: [0, 3, 1, 2],
    },
    tracks: [
      {
        on: 'facets',
        each: true,
        stagger: 4.5,
        keys: {
          10: { y: 2.2, s: 0.85, o: 0.25, e: 'out' },
          26: { y: -0.35, s: 1.06, o: 1, e: 'settle' },
          38: { y: 0, s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="1" y="1" width="22" height="22" rx="2"/>', 40, 64, 0.28),
      checkFlash(16.8, 5.2, '#4ADE80', 42, 66),
    ],
  },

  apache: {
    story:
      'Apache HTTP Server crimson feather glides smoothly on a gentle draft while its layered quill vanes ripple from base to tip',
    groups: {
      vanes: (parts) => parts.filter((p) => p.box && p.box.width > 1).map((p) => p.i),
    },
    tracks: [
      {
        on: 'all',
        origin: '35% 85%',
        keys: sway(10, 6, 0.6),
      },
      {
        on: 'vanes',
        order: '-y',
        each: true,
        stagger: 2.0,
        keys: {
          12: { s: 0.88, o: 0.55, e: 'inout' },
          26: { s: 1.06, o: 1, e: 'settle' },
          38: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [spark(17.4, 3.6, 1.8, -1.4, '#FDBA74', 28, 50)],
  },

  celery: {
    story:
      'Celery distributed task-queue emblem pulses with worker vigor as queued Python jobs feed into the broker and return completed results',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        fill: [24, 34],
        width: 0.65,
        keys: heartbeat(16, 0.07),
      },
    ],
    props: [
      packet(2.0, 9.5, 11.2, 11.5, '#BEF264', 16, 40, 0.9),
      packet(12.8, 12.5, 22.0, 14.5, '#4ADE80', 36, 62, 0.9),
      checkFlash(16.8, 5.4, '#86EFAC', 44, 66),
    ],
  },

  temporal: {
    story:
      'Temporal durable-execution emblem revolves along its fault-tolerant timeline as a workflow checkpoint locks cleanly across retries',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        keys: {
          10: { r: -28, s: 0.94, e: 'inout' },
          36: { r: 22, s: 1.04, e: 'inout' },
          56: { r: -3, s: 1, e: 'settle' },
          66: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      radar(12, 12, 10.6, '#38BDF8', 12, 64, 150),
      pulseRing(12, 12, 6.2, '#FDE047', 28, 56, { layer: 'over' }),
    ],
  },

  strapi: {
    story:
      'Strapi headless CMS corner block snaps into its modular content-type grid while a published API payload dispatches outward',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        fill: [24, 34],
        width: 0.65,
        keys: {
          12: { x: -1.6, y: 1.6, s: 0.92, e: 'out' },
          30: { x: 0.3, y: -0.3, s: 1.05, e: 'settle' },
          48: { x: 0, y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      guides(
        [
          [12, 1.5, 12, 22.5],
          [1.5, 12, 22.5, 12],
        ],
        '#818CF8',
        10,
        52
      ),
      packet(13.5, 10.5, 21.2, 3.2, '#A5B4FC', 34, 62, 0.95),
    ],
  },

  hasura: {
    story:
      'Hasura instant-API crest energizes around its central engine core, emitting a real-time GraphQL subscription ripple from the database layer',
    groups: {
      crest: 0,
      core: 1,
    },
    tracks: [
      {
        on: 'crest',
        origin: [12, 12],
        keys: {
          12: { s: 0.92, r: -6, e: 'inout' },
          32: { s: 1.05, r: 4, e: 'settle' },
          54: { s: 1, r: 0, e: 'out' },
        },
      },
      {
        on: 'core',
        origin: [12.2, 12.5],
        keys: {
          14: { s: 0.55, r: 18, e: 'in' },
          30: { s: 1.22, r: -6, e: 'settle' },
          48: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#22D3EE', 24, 58), boltFlash(17.8, 4.4, '#67E8F9', 26, 52)],
  },

  keycloak: {
    story:
      'Keycloak identity gate traces its keyhole silhouette, snaps into SSO lock, and flashes an OIDC verified-session checkmark',
    tracks: [
      {
        on: 0,
        draw: [8, 34],
        fill: [26, 36],
        width: 0.65,
        keys: {
          14: { s: 0.93, e: 'inout' },
          34: { s: 1.04, e: 'settle' },
          54: { s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.6, '#38BDF8', 28, 60), checkFlash(16.6, 5.4, '#4ADE80', 40, 66)],
  },

  auth0: {
    story:
      'Auth0 orange shield anchors securely while a glossy verification sheen sweeps across its star emblem and an authorization check lights up',
    tracks: [
      {
        on: 0,
        origin: '50% 45%',
        keys: {
          10: { s: 0.9, y: -1.2, e: 'in' },
          26: { s: 1.06, y: 0.3, e: 'settle' },
          44: { s: 1, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="2" y="1" width="20" height="22" rx="3"/>', 34, 60, 0.3),
      pulseRing(12, 12, 10.2, '#FB923C', 22, 54),
      checkFlash(16.8, 5.2, '#86EFAC', 42, 66),
    ],
  },

  clerk: {
    story:
      'Clerk purple identity orb pops cleanly into center as its outer C-arc and base embrace it like a seamless user-session handshake',
    groups: {
      base: 0,
      arc: 1,
      orb: 2,
    },
    tracks: [
      {
        on: 'arc',
        origin: [12, 12],
        keys: {
          10: { r: -24, s: 0.9, e: 'inout' },
          32: { r: 6, s: 1.04, e: 'settle' },
          52: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'base',
        keys: riseIn(16, 2.2),
      },
      {
        on: 'orb',
        keys: popIn(18, 0.3),
      },
    ],
    props: [pulseRing(14.2, 12, 5.4, '#A78BFA', 28, 58), checkFlash(17.2, 4.8, '#86EFAC', 42, 66)],
  },

  jsonwebtokens: {
    story:
      'JWT ten-spoke cryptographic starburst ignites clockwise around its axis as header, payload, and signature claims lock into a signed token',
    groups: {
      spokes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    tracks: [
      {
        on: 'spokes',
        each: true,
        stagger: 2.2,
        keys: {
          10: { s: 0.35, o: 0.15, e: 'in' },
          22: { s: 1.18, o: 1, e: 'settle' },
          34: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 10.4, '#38BDF8', 24, 56),
      pulseRing(12, 12, 6.2, '#F472B6', 34, 62, { layer: 'over' }),
    ],
  },

  adonisjs: {
    story:
      'AdonisJS royal-violet shield settles firmly while its inner architectural A-peak rises into MVC alignment with a crisp metallic sheen',
    groups: {
      shield: 0,
      peak: 1,
    },
    tracks: [
      {
        on: 'shield',
        keys: {
          10: { s: 0.92, e: 'inout' },
          28: { s: 1.04, e: 'settle' },
          48: { s: 1, e: 'out' },
        },
      },
      {
        on: 'peak',
        keys: riseIn(14, 2.6),
      },
    ],
    props: [
      sheen('<rect x="1.5" y="1.5" width="21" height="21" rx="3"/>', 38, 64, 0.3),
      pulseRing(12, 12, 10.2, '#818CF8', 24, 56),
    ],
  },

  koa: {
    story:
      'Koa minimalist K-o-a wordmark ripples downstream and upstream in a classic async middleware onion cascade',
    groups: {
      letters: [0, 1, 2],
    },
    tracks: [
      {
        on: 'letters',
        order: 'x',
        each: true,
        stagger: 5.5,
        keys: {
          10: { y: 0, s: 0.92, e: 'inout' },
          22: { y: -2.0, s: 1.08, e: 'settle' },
          34: { y: 0.4, s: 0.98, e: 'inout' },
          46: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(2.2, 8.2, 21.8, 8.2, '#38BDF8', 14, 40, 0.85),
      packet(21.8, 19.2, 2.2, 19.2, '#A78BFA', 36, 62, 0.85),
    ],
  },

  codeigniter: {
    story:
      'CodeIgniter rapid PHP flame ignites with a crisp upward flare and throws bright orange sparks from its crest',
    tracks: [
      {
        on: 0,
        origin: '50% 88%',
        keys: {
          10: { sy: 0.9, sx: 1.06, r: -4, e: 'inout' },
          24: { sy: 1.1, sx: 0.94, r: 5, e: 'settle' },
          40: { sy: 0.96, sx: 1.03, r: -3, e: 'inout' },
          56: { sy: 1, sx: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      spark(15.2, 4.2, 2.0, -1.8, '#FDE047', 22, 44),
      spark(8.4, 5.2, -1.8, -1.6, '#FB923C', 32, 54),
      pulseRing(12, 13.5, 8.2, '#FCA5A5', 20, 52),
    ],
  },

  cakephp: {
    story:
      'CakePHP layered MVC pastry stacks its left and right base slices beneath a swiftly dropping icing layer for rapid convention scaffolding',
    groups: {
      leftSlice: 0,
      icing: 1,
      rightSlice: 2,
    },
    tracks: [
      {
        on: 'leftSlice',
        keys: slideIn(10, -2.4, 0.8),
      },
      {
        on: 'rightSlice',
        keys: slideIn(14, 2.4, 0.8),
      },
      {
        on: 'icing',
        keys: dropIn(20, 3.2),
      },
    ],
    props: [spark(18.5, 5.2, 1.6, -1.4, '#FDA4AF', 38, 58)],
  },

  natsdotio: {
    story:
      'NATS cloud-native messaging badge snaps cleanly as subject-based pub/sub packets dart in and fan out at microsecond speed',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        fill: [22, 32],
        width: 0.65,
        keys: {
          14: { s: 0.93, e: 'inout' },
          30: { s: 1.05, e: 'settle' },
          50: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(2.0, 7.5, 11.5, 12.0, '#7DD3FC', 16, 38, 0.9),
      packet(12.5, 12.0, 22.0, 7.0, '#4ADE80', 36, 58, 0.9),
      packet(12.5, 12.0, 22.0, 17.0, '#38BDF8', 40, 64, 0.9),
    ],
  },

  apachepulsar: {
    story:
      'Apache Pulsar streaming wave emblem radiates rhythmic pulsar rings while multi-tenant event packets surf cleanly across its frequency bands',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        keys: {
          10: { sx: 0.92, sy: 1.04, e: 'inout' },
          28: { sx: 1.06, sy: 0.96, e: 'settle' },
          46: { sx: 0.98, sy: 1.02, e: 'inout' },
          60: { sx: 1, sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 8.6, '#60A5FA', 16, 48),
      pulseRing(12, 12, 10.6, '#38BDF8', 28, 62),
      packet(2.2, 12, 21.8, 12, '#FDE047', 22, 54, 0.95),
    ],
  },

  serverless: {
    story:
      'Serverless six-bar lambda mark spins up from zero in staggered bursts like auto-scaling FaaS functions firing on demand',
    groups: {
      leftBars: [0, 1, 2],
      rightBars: [3, 4, 5],
    },
    tracks: [
      {
        on: 'leftBars',
        each: true,
        stagger: 4.5,
        keys: {
          10: { x: -3.2, o: 0.15, e: 'out' },
          24: { x: 0.3, o: 1, e: 'settle' },
          36: { x: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'rightBars',
        each: true,
        stagger: 4.5,
        keys: {
          16: { x: 3.2, o: 0.15, e: 'out' },
          30: { x: -0.3, o: 1, e: 'settle' },
          42: { x: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [boltFlash(12.2, 8.8, '#FDE047', 34, 60)],
  },

  sanic: {
    story:
      'Sanic neon-magenta async Python emblem dashes forward with a supersonic blur and electric coroutine spark',
    tracks: [
      {
        on: 0,
        origin: '50% 50%',
        keys: {
          10: { x: -2.0, r: -6, s: 0.94, e: 'in' },
          24: { x: 1.4, r: 5, s: 1.07, e: 'settle' },
          42: { x: -0.3, r: -1, s: 0.99, e: 'inout' },
          58: { x: 0, r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(2.0, 9.0, 3.0, -0.4, '#F472B6', 14, 38),
      spark(1.8, 14.5, 3.4, 0.4, '#FB7185', 20, 44),
      boltFlash(17.8, 4.4, '#FDE047', 26, 52),
    ],
  },

  aiohttp: {
    story:
      'AIOHTTP asyncio client-server emblem banks smoothly like a paper plane dispatching concurrent HTTP requests across an event-loop orbit',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        keys: {
          10: { x: -1.4, y: 1.0, r: -8, e: 'inout' },
          30: { x: 1.2, y: -1.0, r: 6, e: 'settle' },
          54: { x: 0, y: 0, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      radar(12, 12, 10.6, '#60A5FA', 12, 62, 110),
      packet(3.0, 17.5, 20.5, 6.0, '#7DD3FC', 22, 54, 0.95),
    ],
  },

  vapor: {
    story:
      'Vapor server-side Swift droplet glides downward as its cyan and magenta vapor-stream ribbons cascade in shimmering harmonic layers',
    groups: {
      droplet: [0, 11],
      cyanRibbons: [1, 2, 3, 4, 5],
      magentaRibbons: [6, 7, 8, 9, 10],
    },
    tracks: [
      {
        on: 'droplet',
        keys: dropIn(10, 2.2),
      },
      {
        on: 'cyanRibbons',
        each: true,
        stagger: 2.5,
        keys: {
          14: { y: 2.0, o: 0.3, e: 'out' },
          28: { y: -0.3, o: 1, e: 'settle' },
          40: { y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'magentaRibbons',
        each: true,
        stagger: 2.5,
        keys: {
          18: { y: 2.0, o: 0.3, e: 'out' },
          32: { y: -0.3, o: 1, e: 'settle' },
          44: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#38BDF8', 28, 60)],
  },

  spring: {
    story:
      'Spring enterprise Java leaf unfurls inside its verdant badge and radiates a steady dependency-injection vitality pulse',
    tracks: [
      {
        on: 0,
        origin: '50% 60%',
        draw: [8, 34],
        fill: [26, 36],
        width: 0.65,
        keys: {
          12: { s: 0.92, r: -5, e: 'inout' },
          32: { s: 1.05, r: 3, e: 'settle' },
          54: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#86EFAC', 26, 58),
      spark(17.6, 5.2, 1.8, -1.6, '#BEF264', 32, 52),
    ],
  },

  springsecurity: {
    story:
      'Spring Security green shield locks solidly into place while its central keyhole rotates to engage Java access-control authorization',
    groups: {
      shield: 0,
      keyhole: 1,
    },
    tracks: [
      {
        on: 'shield',
        keys: {
          10: { s: 0.92, e: 'inout' },
          28: { s: 1.05, e: 'settle' },
          50: { s: 1, e: 'out' },
        },
      },
      {
        on: 'keyhole',
        origin: [12, 9.6],
        keys: {
          16: { r: -35, s: 0.85, e: 'inout' },
          34: { r: 12, s: 1.12, e: 'settle' },
          50: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.0, '#86EFAC', 26, 58), checkFlash(16.6, 5.2, '#BEF264', 40, 66)],
  },

  echo: {
    story:
      'Echo minimalist Go router emits three acoustic wave chevrons that reverberate outward into the e-c-h-o wordmark like fast middleware responses',
    groups: {
      waves: [0, 1, 2],
      letters: [3, 4, 5, 6],
    },
    tracks: [
      {
        on: 'waves',
        order: 'x',
        each: true,
        stagger: 4.0,
        keys: {
          10: { x: -2.0, s: 0.7, o: 0.2, e: 'out' },
          24: { x: 0.4, s: 1.12, o: 1, e: 'settle' },
          38: { x: 0, s: 1, o: 1, e: 'out' },
        },
      },
      {
        on: 'letters',
        order: 'x',
        each: true,
        stagger: 3.5,
        keys: {
          20: { y: 1.6, o: 0.35, e: 'out' },
          34: { y: -0.35, o: 1, e: 'settle' },
          46: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(4.2, 12.2, 4.4, '#38BDF8', 14, 46)],
  },

  rocket: {
    story:
      'Rocket Rust web framework ignites its thruster with a crisp vertical liftoff tremor and leaves a bright exhaust flash beneath its crimson emblem',
    tracks: [
      {
        on: 0,
        origin: '50% 60%',
        keys: {
          10: { y: 1.0, r: -2, e: 'in' },
          18: { y: 1.4, r: 2, e: 'in' },
          34: { y: -2.4, r: 0, s: 1.05, e: 'out' },
          48: { y: 0.3, s: 0.99, e: 'settle' },
          62: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(10.2, 20.5, -1.2, 2.2, '#FDE047', 16, 42),
      spark(13.8, 20.5, 1.2, 2.2, '#FB923C', 18, 44),
      pulseRing(12, 12, 10.2, '#FDA4AF', 28, 58),
    ],
  },

  tokio: {
    story:
      'Tokio async Rust runtime hull steadies while its seven hexagonal task nodes fire in a work-stealing wave and async futures hop across threads',
    groups: {
      hull: 0,
      nodes: [1, 2, 3, 4, 5, 6, 7],
    },
    tracks: [
      {
        on: 'hull',
        keys: breathe(10, 0.04),
      },
      {
        on: 'nodes',
        each: true,
        stagger: 3.2,
        keys: {
          12: { s: 0.3, o: 0.2, e: 'in' },
          24: { s: 1.4, o: 1, e: 'settle' },
          36: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(5.5, 8.2, 18.5, 15.8, '#38BDF8', 22, 50, 0.85),
      packet(18.5, 8.2, 5.5, 15.8, '#FDE047', 34, 62, 0.85),
    ],
  },

  loopback: {
    story:
      'LoopBack five interlocking API ribbon segments weave into continuous alignment as an extensible REST/OpenAPI packet orbits the loop',
    groups: {
      ribbons: [0, 1, 2, 3, 4],
    },
    tracks: [
      {
        on: 'ribbons',
        order: 'a',
        each: true,
        stagger: 3.8,
        keys: {
          10: { s: 0.82, o: 0.25, e: 'out' },
          26: { s: 1.07, o: 1, e: 'settle' },
          40: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [radar(12, 12, 10.4, '#60A5FA', 14, 64, 140)],
  },

  sailsdotjs: {
    story:
      'Sails.js twin blue sails billow forward to catch a realtime WebSocket breeze while gliding smoothly over a shimmering ocean swell',
    groups: {
      mainSail: 0,
      jibSail: 1,
    },
    tracks: [
      {
        on: 'mainSail',
        origin: '50% 95%',
        keys: {
          10: { r: -6, x: -0.8, e: 'inout' },
          30: { r: 5, x: 0.7, e: 'inout' },
          52: { r: 0, x: 0, e: 'out' },
        },
      },
      {
        on: 'jibSail',
        origin: '50% 95%',
        keys: {
          14: { r: -8, x: -0.6, e: 'inout' },
          34: { r: 6, x: 0.9, e: 'inout' },
          56: { r: 0, x: 0, e: 'out' },
        },
      },
    ],
    props: [waveLine(21.6, '#38BDF8', 10, 64)],
  },

  meteor: {
    story:
      'Meteor seven diagonal comet streaks blaze from upper-right to lower-left in staggered isomorphic sync bursts with trailing golden stardust',
    groups: {
      streaks: [0, 1, 2, 3, 4, 5, 6],
    },
    tracks: [
      {
        on: 'streaks',
        each: true,
        stagger: 3.2,
        keys: {
          10: { x: 2.6, y: -2.6, o: 0.15, e: 'in' },
          24: { x: -0.35, y: 0.35, o: 1, e: 'settle' },
          38: { x: 0, y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(19.2, 4.6, 2.0, -2.0, '#FDE047', 16, 40),
      spark(4.8, 19.2, -2.0, 2.0, '#FB7185', 36, 60),
    ],
  },

  directus: {
    story:
      'Directus white rabbit leaps lightly forward as instant SQL data streams surface into its headless CMS API layer',
    tracks: [
      {
        on: 0,
        origin: '50% 80%',
        keys: {
          10: { y: 0.8, r: -4, e: 'in' },
          24: { y: -2.0, r: 5, s: 1.04, e: 'out' },
          38: { y: 0.4, r: -2, s: 0.98, e: 'settle' },
          54: { y: 0, r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(2.5, 17.5, 21.5, 17.5, '#818CF8', 18, 48, 0.9),
      pulseRing(12, 12, 10.2, '#A5B4FC', 26, 58),
    ],
  },

  payloadcms: {
    story:
      'Payload CMS twin interlocking isometric cube faces slide cleanly into a code-first Next.js schema block with a crisp edge sheen',
    groups: {
      lowerFace: 0,
      upperFace: 1,
    },
    tracks: [
      {
        on: 'lowerFace',
        keys: slideIn(10, -2.2, 2.2),
      },
      {
        on: 'upperFace',
        keys: slideIn(16, 2.2, -2.2),
      },
    ],
    props: [
      sheen('<rect x="1.5" y="1.5" width="21" height="21" rx="2"/>', 38, 64, 0.3),
      checkFlash(16.8, 5.2, '#86EFAC', 42, 66),
    ],
  },

  ghost: {
    story:
      'Ghost headless publishing grid glides gently into focus as crisp editorial lines animate like freshly published newsletter posts',
    tracks: [
      {
        on: 0,
        keys: {
          10: { y: 1.6, s: 0.94, e: 'inout' },
          30: { y: -0.6, s: 1.03, e: 'settle' },
          54: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      telemetryBar(4.2, 19.6, 5.2, 1.0, '#E2E8F0', 18, 50),
      telemetryBar(10.6, 19.6, 9.2, 1.0, '#38BDF8', 26, 58),
      sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5" rx="2"/>', 40, 64, 0.28),
    ],
  },

  sanity: {
    story:
      'Sanity composable content badge frames its crisp S-letterform as GROQ query packets sweep through and structured content publishes cleanly',
    groups: {
      badge: 0,
      s: 1,
    },
    tracks: [
      {
        on: 'badge',
        keys: breathe(10, 0.05),
      },
      {
        on: 's',
        draw: [12, 36],
        fill: [28, 38],
        width: 0.65,
      },
    ],
    props: [
      sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5" rx="2"/>', 42, 66, 0.3),
      packet(3.0, 4.5, 21.0, 4.5, '#FB7185', 20, 48, 0.85),
    ],
  },

  contentful: {
    story:
      'Contentful three-node composable C-loop traces its API-first content graph and pulses with a synchronized multi-channel publish wave',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        draw: [8, 34],
        fill: [26, 36],
        width: 0.65,
        keys: {
          14: { r: -10, s: 0.94, e: 'inout' },
          34: { r: 6, s: 1.04, e: 'settle' },
          56: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(15.5, 5.2, 15.5, 18.8, '#38BDF8', 24, 54, 0.9),
      pulseRing(12, 12, 10.2, '#60A5FA', 28, 60),
    ],
  },

  haproxy: {
    story:
      'HAProxy high-availability load balancer steadies at the core while incoming TCP/HTTP traffic fans evenly across three healthy backend pools',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: breathe(12, 0.05),
      },
    ],
    props: [
      radar(12, 12, 10.6, '#38BDF8', 10, 64, 120),
      packet(1.8, 12.0, 10.5, 12.0, '#FDE047', 12, 34, 0.95),
      packet(13.5, 12.0, 22.0, 6.2, '#4ADE80', 32, 56, 0.9),
      packet(13.5, 12.0, 22.0, 12.0, '#4ADE80', 36, 60, 0.9),
      packet(13.5, 12.0, 22.0, 17.8, '#4ADE80', 40, 64, 0.9),
    ],
  },

  apachetomcat: {
    story:
      'Apache Tomcat golden feline springs eagerly into its servlet pounce while its raised head/tail accent flicks alive on an incoming Jakarta request',
    groups: {
      body: 0,
      accent: 1,
    },
    tracks: [
      {
        on: 'body',
        origin: '40% 80%',
        keys: {
          10: { r: -5, y: 0.8, e: 'in' },
          26: { r: 6, y: -1.2, s: 1.04, e: 'settle' },
          44: { r: -2, y: 0.2, s: 0.99, e: 'inout' },
          58: { r: 0, y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'accent',
        origin: '50% 80%',
        keys: {
          14: { r: -14, y: 0.5, e: 'inout' },
          30: { r: 10, y: -0.6, e: 'settle' },
          48: { r: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      spark(20.2, 7.2, 1.8, -1.2, '#FDE047', 26, 48),
      pulseRing(12, 12, 10.2, '#FCD34D', 24, 56),
    ],
  },

  gunicorn: {
    story:
      'Gunicorn green UNIX unicorn gallops forward with a confident nod as forked Python WSGI workers spin up along its stride',
    tracks: [
      {
        on: 0,
        origin: '50% 75%',
        keys: {
          10: { r: -6, y: 0.8, e: 'in' },
          24: { r: 6, y: -1.4, e: 'out' },
          38: { r: -3, y: 0.4, e: 'inout' },
          54: { r: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(2.2, 18.2, 21.8, 18.2, '#86EFAC', 16, 48, 0.9),
      spark(18.6, 5.4, 2.0, -1.4, '#BEF264', 24, 46),
    ],
  },

  pm2: {
    story:
      'PM2 Node.js process manager staggers its three cluster bars into zero-downtime reload formation while live uptime telemetry ticks cleanly',
    groups: {
      topBar: 0,
      botBar: 1,
      chevron: 2,
    },
    tracks: [
      {
        on: 'topBar',
        keys: slideIn(10, -2.6, 0),
      },
      {
        on: 'botBar',
        keys: slideIn(16, -2.6, 0),
      },
      {
        on: 'chevron',
        keys: slideIn(22, 2.6, 0),
      },
    ],
    props: [pulseRing(12, 12, 10.4, '#C4B5FD', 26, 58), checkFlash(16.8, 5.0, '#4ADE80', 42, 66)],
  },

  passport: {
    story:
      'Passport.js four color-coded OAuth strategy arcs snap clockwise around the central credential post and flash an authenticated session check',
    groups: {
      yellow: 0,
      green: 2,
      blue: 4,
      stem: 6,
    },
    tracks: [
      {
        on: 'yellow',
        keys: popIn(10, 0.4),
      },
      {
        on: 'green',
        keys: popIn(16, 0.4),
      },
      {
        on: 'blue',
        keys: popIn(22, 0.4),
      },
      {
        on: 'stem',
        keys: riseIn(26, 2.8),
      },
    ],
    props: [pulseRing(12, 10.2, 8.8, '#4ADE80', 30, 60), checkFlash(16.8, 17.6, '#86EFAC', 44, 66)],
  },

  authelia: {
    story:
      'Authelia five interlocking 2FA shield facets converge into a hardened zero-trust portal while a single-sign-on verification ring confirms identity',
    groups: {
      facets: [0, 1, 2, 3, 4],
    },
    tracks: [
      {
        on: 'facets',
        order: 'r',
        each: true,
        stagger: 3.8,
        keys: {
          10: { s: 0.72, o: 0.2, e: 'out' },
          26: { s: 1.08, o: 1, e: 'settle' },
          40: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#94A3B8', 24, 58), checkFlash(16.8, 5.0, '#4ADE80', 42, 66)],
  },

  h3: {
    story:
      'H3 seven composable hexagonal HTTP tiles cascade smoothly into a lightweight router grid as a fast request packet zips across',
    tracks: [
      {
        on: [0, 1, 2, 3, 4, 5, 6],
        order: 'x',
        each: true,
        stagger: 3.2,
        keys: popIn(10, 0.45),
      },
    ],
    props: [
      packet(4.0, 12.0, 20.0, 12.0, '#60A5FA', 32, 58, 0.95),
      pulseRing(12, 12, 10.2, '#93C5FD', 38, 66, { layer: 'under', sw: 0.5 }),
    ],
  },

  unjs: {
    story:
      'UnJS universal JavaScript badge traces its runtime-agnostic frame and radiates a golden ecosystem pulse with twin utility sparks',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        fill: [24, 36],
        width: 0.65,
        keys: heartbeat(14, 0.06),
      },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#FEF08A', 24, 58, { layer: 'under', sw: 0.55 }),
      spark(18.6, 5.2, 1.6, -1.6, '#FDE047', 34, 58),
    ],
  },

  scalar: {
    story:
      'Scalar twin OpenAPI crescent arcs trace and converge around the center while an interactive API radar sweeps and confirms live endpoints',
    groups: {
      rightArc: 0,
      leftArc: 1,
    },
    tracks: [
      {
        on: 'leftArc',
        draw: [8, 30],
        fill: [22, 34],
        width: 0.6,
        keys: slideIn(10, -2.0, 0),
      },
      {
        on: 'rightArc',
        draw: [14, 36],
        fill: [28, 40],
        width: 0.6,
        keys: slideIn(16, 2.0, 0),
      },
    ],
    props: [radar(12, 12, 10.3, '#38BDF8', 22, 62, 120), checkFlash(16.6, 5.2, '#4ADE80', 42, 66)],
  },

  betterauth: {
    story:
      'Better Auth twin cryptographic halves slide together and lock cleanly as a green verified session check flashes at the corner',
    groups: { left: 0, right: 1 },
    tracks: [
      { on: 'left', keys: slideIn(10, -2.4, 0) },
      { on: 'right', keys: slideIn(14, 2.4, 0) },
    ],
    props: [
      pulseRing(12, 12, 10.0, '#94A3B8', 24, 58, { layer: 'under', sw: 0.55 }),
      checkFlash(16.8, 5.0, '#4ADE80', 38, 64),
    ],
  },

  lucia: {
    story:
      'Lucia session-auth emblem traces its minimalist silhouette and blooms with a crisp violet verification ring',
    tracks: [{ on: 0, draw: [8, 34], fill: [26, 38], width: 0.65, keys: popIn(12, 0.84) }],
    props: [
      pulseRing(12, 12, 9.8, '#A5B4FC', 22, 56, { layer: 'under', sw: 0.6 }),
      checkFlash(16.6, 5.2, '#4ADE80', 40, 66),
    ],
  },

  ory: {
    story:
      'Ory zero-trust identity core pulses as its upper and lower OAuth2 security brackets clamp securely into place',
    groups: { core: 0, top: 1, bottom: 2 },
    tracks: [
      { on: 'core', keys: heartbeat(12, 0.08) },
      { on: 'top', keys: dropIn(14, 2.4) },
      { on: 'bottom', keys: riseIn(18, 2.4) },
    ],
    props: [radar(12, 12, 10.4, '#818CF8', 20, 62, 110)],
  },

  stripe: {
    story:
      'Stripe iconic S-mark traces its crisp payment contour, gleams with a diagonal checkout sheen, and confirms with a green authorization check',
    tracks: [{ on: 0, draw: [8, 32], fill: [24, 36], width: 0.65, keys: breathe(12, 0.05) }],
    props: [
      sheen('<rect x="3" y="1" width="18" height="22" rx="2"/>', 32, 60, 0.32),
      checkFlash(16.8, 5.0, '#4ADE80', 40, 66),
    ],
  },

  lemonsqueezy: {
    story:
      'Lemon Squeezy four golden citrus wedges fan into place in sequence with a bright SaaS billing bounce and spark',
    tracks: [{ on: [0, 1, 2, 3], order: 'y', each: true, stagger: 4.5, keys: popIn(10, 0.45) }],
    props: [
      pulseRing(12, 12, 10.0, '#FDE047', 26, 60, { layer: 'under', sw: 0.55 }),
      spark(18.6, 5.2, 1.6, -1.6, '#FEF08A', 36, 60),
    ],
  },

  paddle: {
    story:
      'Paddle billing mark rocks with rhythmic momentum as its circular coin pops into the blade and a golden checkout ring pulses',
    groups: { coin: 0, blade: 1 },
    tracks: [
      { on: 'blade', origin: '50% 70%', keys: sway(10, 6, 0.5) },
      { on: 'coin', keys: popIn(16, 0.4) },
    ],
    props: [pulseRing(12, 12, 10.2, '#FEF08A', 26, 60, { layer: 'under', sw: 0.55 })],
  },

  resend: {
    story:
      'Resend crisp transactional email R traces swiftly as an outgoing message packet shoots across the diagonal and confirms delivery',
    tracks: [{ on: 0, draw: [8, 32], fill: [24, 36], width: 0.65 }],
    props: [
      packet(4.5, 18.5, 19.5, 5.5, '#38BDF8', 24, 52, 0.95),
      checkFlash(16.8, 5.0, '#4ADE80', 42, 66),
    ],
  },

  pusher: {
    story:
      'Pusher real-time pub/sub beacon pulses twice as concentric WebSocket broadcast rings expand outward to connected clients',
    tracks: [{ on: 0, origin: [12, 12], keys: heartbeat(10, 0.08) }],
    props: [
      pulseRing(12, 12, 8.8, '#C084FC', 16, 50, { layer: 'under', sw: 0.6 }),
      pulseRing(12, 12, 10.4, '#38BDF8', 28, 64, { layer: 'under', sw: 0.5 }),
    ],
  },

  livekit: {
    story:
      'LiveKit open-source WebRTC outer frame and inner broadcast core pulse in sync while live audio/video signal rings radiate outward',
    groups: { outer: 0, inner: 1 },
    tracks: [
      { on: 'outer', draw: [8, 30], fill: [22, 34], width: 0.6 },
      { on: 'inner', keys: popIn(18, 0.45) },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#38BDF8', 22, 56, { layer: 'under', sw: 0.6 }),
      pulseRing(12, 12, 10.5, '#4ADE80', 34, 66, { layer: 'under', sw: 0.45 }),
    ],
  },

  agora: {
    story:
      'Agora five real-time voice-and-video letter glyphs ripple left-to-right like live media frames streaming across a global RTC edge',
    tracks: [{ on: [2, 4, 0, 1, 3], each: true, stagger: 4.0, keys: riseIn(10, 2.2) }],
    props: [
      waveLine(19.6, '#38BDF8', 14, 62),
      pulseRing(12, 11.5, 10.0, '#7DD3FC', 28, 62, { layer: 'under', sw: 0.5 }),
    ],
  },

  convex: {
    story:
      'Convex three reactive orbital ribbons converge and rotate cleanly into sync as real-time database mutation packets pulse across the core',
    tracks: [
      {
        on: [0, 1, 2],
        origin: [12, 12],
        stagger: 4.5,
        keys: {
          10: { r: -24, s: 0.86, o: 0.35, e: 'out' },
          32: { r: 4, s: 1.04, o: 1, e: 'settle' },
          46: { r: 0, s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 10.0, '#FCA5A5', 26, 60, { layer: 'under', sw: 0.55 }),
      spark(18.6, 5.4, 1.5, -1.5, '#FDE047', 36, 58),
    ],
  },

  sidekiq: {
    story:
      'Sidekiq martial-arts silhouette delivers a snappy high-speed strike as background worker jobs drain rapidly with a crimson spark',
    groups: { body: 0, kick: 1 },
    tracks: [
      { on: 'body', origin: '50% 60%', keys: nod(10, 6) },
      { on: 'kick', keys: slideIn(16, 2.4, -1.2) },
    ],
    props: [
      boltFlash(17.8, 4.6, '#F472B6', 24, 52),
      pulseRing(12, 12, 10.0, '#F9A8D4', 30, 62, { layer: 'under', sw: 0.5 }),
    ],
  },

  sst: {
    story:
      'SST full-stack cloud emblem traces its infrastructure-as-code silhouette and fires a warm coral serverless deploy pulse',
    tracks: [{ on: 0, draw: [8, 34], fill: [26, 38], width: 0.65, keys: riseIn(10, 2.2) }],
    props: [
      pulseRing(12, 12, 10.2, '#FDBA74', 26, 60, { layer: 'under', sw: 0.55 }),
      spark(18.6, 5.2, 1.6, -1.6, '#FDE047', 38, 60),
    ],
  },

  medusa: {
    story:
      'Medusa headless commerce emblem traces its sculpted vector contours and shimmers with a sleek storefront sheen',
    tracks: [{ on: 0, draw: [8, 34], fill: [26, 38], width: 0.6, keys: breathe(12, 0.05) }],
    props: [sheen('<rect x="2" y="1" width="20" height="22" rx="3"/>', 34, 62, 0.28)],
  },

  shopify: {
    story:
      'Shopify shopping bag swings lightly like a freshly packed order while its side gusset locks in and a green checkout check flashes',
    groups: { side: 0, front: 1 },
    tracks: [
      { on: 'front', origin: '50% 25%', keys: sway(10, 6, 0.4) },
      { on: 'side', keys: slideIn(14, 2.0, 0) },
    ],
    props: [checkFlash(16.8, 4.8, '#86EFAC', 38, 64)],
  },

  woocommerce: {
    story:
      'WooCommerce speech-bubble badge pops into place as its crisp storefront letters ripple left-to-right across the banner',
    groups: { bubble: 0, letters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    tracks: [
      { on: 'bubble', keys: popIn(10, 0.72) },
      { on: 'letters', order: 'x', each: true, stagger: 2.2, keys: riseIn(16, 1.6) },
    ],
    props: [pulseRing(12, 12, 10.2, '#C084FC', 34, 64, { layer: 'under', sw: 0.5 })],
  },

  wordpress: {
    story:
      'WordPress classic W-seal traces its circular publishing emblem and turns gently into alignment with a crisp editorial sheen',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        draw: [8, 34],
        fill: [26, 38],
        width: 0.65,
        keys: { 10: { r: -20, e: 'inout' }, 38: { r: 4, e: 'settle' }, 58: { r: 0, e: 'out' } },
      },
    ],
    props: [sheen('<circle cx="12" cy="12" r="10.4"/>', 38, 64, 0.26)],
  },

  drupal: {
    story:
      'Drupal water-drop mascot descends cleanly with a gentle splash ripple beneath it and gives a friendly nod',
    tracks: [{ on: 0, origin: '50% 65%', keys: dropIn(10, 2.8) }],
    props: [
      waveLine(21.2, '#38BDF8', 22, 62),
      pulseRing(12, 14, 8.8, '#60A5FA', 26, 58, { layer: 'under', sw: 0.55 }),
    ],
  },

  webflow: {
    story:
      'Webflow dynamic W-ribbon traces its fluid visual-layout curves while crisp blue smart-guides flash and lock it to the canvas',
    tracks: [{ on: 0, draw: [8, 34], fill: [26, 38], width: 0.65, keys: slideIn(10, -2.4, 0) }],
    props: [
      guides(
        [
          [12.0, 3.0, 12.0, 21.0],
          [1.5, 12.0, 22.5, 12.0],
        ],
        '#60A5FA',
        12,
        54
      ),
      sheen('<rect x="0.5" y="4.5" width="23" height="15" rx="2"/>', 36, 64, 0.3),
    ],
  },

  wix: {
    story:
      'Wix three bold letterforms W-i-x cascade briskly left-to-right across the canvas with a clean studio gloss sweep',
    tracks: [{ on: [0, 1, 2], order: 'x', each: true, stagger: 5.5, keys: riseIn(10, 2.6) }],
    props: [sheen('<rect x="0.5" y="7" width="23" height="10" rx="1.5"/>', 36, 64, 0.3)],
  },

  squarespace: {
    story:
      'Squarespace four interlocking ribbon loops trace and weave together from opposing diagonals into a balanced minimalist emblem',
    tracks: [
      { on: [3, 2, 1, 0], each: true, stagger: 4.2, draw: [8, 28], fill: [20, 32], width: 0.55 },
    ],
    props: [pulseRing(12, 12, 10.2, '#CBD5E1', 34, 64, { layer: 'under', sw: 0.5 })],
  },

  tina: {
    story:
      'TinaCMS orange llama hops cheerily as it commits visual Markdown edits to Git, flashing a warm verified spark',
    groups: { llama: 0, foot: 1 },
    tracks: [
      { on: 'llama', origin: '50% 80%', keys: nod(12, 6) },
      { on: 'foot', keys: riseIn(18, 1.4) },
    ],
    props: [
      spark(17.8, 5.0, 1.6, -1.6, '#FDBA74', 28, 52),
      checkFlash(16.6, 5.2, '#4ADE80', 40, 66),
    ],
  },

  storyblok: {
    story:
      'Storyblok speech-bubble frame pops open as its two modular content blocks slide cleanly into place inside the visual editor',
    groups: { frame: 2, blocks: [1, 0] },
    tracks: [
      { on: 'frame', keys: popIn(10, 0.78) },
      { on: 'blocks', each: true, stagger: 5, keys: slideIn(18, -2.2, 0) },
    ],
    props: [pulseRing(12, 12, 10.2, '#5EEAD4', 32, 62, { layer: 'under', sw: 0.55 })],
  },

  prismic: {
    story:
      'Prismic eight modular content-slice tiles assemble clockwise into a cohesive page-builder prism with a soft indigo bloom',
    tracks: [
      {
        on: [0, 1, 2, 3, 4, 5, 6, 7],
        order: 'a',
        each: true,
        stagger: 2.6,
        keys: popIn(10, 0.45),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#818CF8', 34, 64, { layer: 'under', sw: 0.55 })],
  },
};
