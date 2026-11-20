// Pilot stories: 12 Tier-A icons setting the visual and motion bar for the library.
// Every story lives strictly inside the 6%..72% window (T = 4.8s), returning to
// the clean, authentic logo at 0%..6% and 72%..100%.

export default {
  docker: {
    story:
      'Docker whale rides a gentle swell while three tiers of shipping containers lower into place on its back and a brief water spout puffs above',
    groups: {
      hull: 9,
      row1: [0, 5, 6, 7, 8],
      row2: [2, 3, 4],
      row3: 1,
    },
    tracks: [
      {
        on: 'hull',
        origin: '50% 65%',
        keys: {
          10: { r: -3.5, y: 0.7, e: 'inout' },
          28: { r: 2.5, y: -0.5, e: 'inout' },
          48: { r: -2, y: 0.4, e: 'inout' },
          64: { r: 0.8, y: -0.15, e: 'settle' },
        },
      },
      {
        on: 'row1',
        order: 'x',
        stagger: 2.2,
        each: true,
        keys: {
          10: { y: -3.2, o: 0, e: 'in' },
          14: { y: -2.4, o: 1, e: 'out' },
          26: { y: 0.35, o: 1, e: 'settle' },
          34: { y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'row2',
        order: 'x',
        stagger: 2.4,
        each: true,
        keys: {
          20: { y: -3.6, o: 0, e: 'in' },
          24: { y: -2.6, o: 1, e: 'out' },
          36: { y: 0.3, o: 1, e: 'settle' },
          44: { y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'row3',
        keys: {
          32: { y: -4.0, o: 0, e: 'in' },
          36: { y: -3.0, o: 1, e: 'out' },
          48: { y: 0.35, o: 1, e: 'settle' },
          58: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      // Subtle ocean wave line beneath the whale during the swell
      {
        layer: 'under',
        svg: '<path d="M2.5 21.2 Q7 19.9 12 21.2 T21.5 21.2" fill="none" stroke="#38BDF8" stroke-width="0.7" stroke-linecap="round"/>',
        keys: {
          10: { x: -1.4, o: 0, e: 'out' },
          22: { x: -0.4, o: 0.65, e: 'inout' },
          48: { x: 1.0, o: 0.55, e: 'inout' },
          64: { x: 1.8, o: 0, e: 'out' },
        },
      },
      // Tiny playful water spout arc above the whale's head once stacked
      {
        layer: 'over',
        origin: '50% 100%',
        svg: '<path d="M17.4 6.6 Q17.2 4.6 15.8 4.4 M17.4 6.6 Q17.7 4.6 19.1 4.4" fill="none" stroke="#7DD3FC" stroke-width="0.65" stroke-linecap="round"/>',
        keys: {
          44: { s: 0.3, y: 1.2, o: 0, e: 'out' },
          52: { s: 1.05, y: 0, o: 0.9, e: 'out' },
          62: { s: 1.15, y: -0.6, o: 0, e: 'out' },
        },
      },
    ],
  },

  kubernetes: {
    story:
      'Kubernetes helm wheel steers port and starboard to reconcile cluster course while subtle orchestration arcs pulse around the heptagon',
    groups: {
      shield: 0,
      wheel: 1,
    },
    tracks: [
      {
        on: 'shield',
        keys: {
          16: { s: 0.96, e: 'inout' },
          36: { s: 1.02, e: 'inout' },
          58: { s: 1, e: 'out' },
        },
      },
      {
        on: 'wheel',
        origin: [12, 12.15],
        keys: {
          14: { r: -42, e: 'inout' },
          24: { r: -48, e: 'inout' },
          44: { r: 62, e: 'inout' },
          56: { r: -6, e: 'settle' },
          66: { r: 0, e: 'out' },
        },
      },
    ],
    props: [
      {
        layer: 'under',
        origin: [12, 12],
        svg: '<circle cx="12" cy="12" r="10.5" fill="none" stroke="#60A5FA" stroke-width="0.55" stroke-dasharray="6 9"/>',
        keys: {
          12: { r: 0, s: 0.92, o: 0, e: 'out' },
          24: { r: 30, s: 1.0, o: 0.7, e: 'linear' },
          52: { r: 95, s: 1.02, o: 0.55, e: 'out' },
          66: { r: 120, s: 1.04, o: 0, e: 'out' },
        },
      },
    ],
  },

  git: {
    story:
      'Git commit trunk and feature branch draw out, commit nodes pop in along the graph, and a merge packet travels from the branch back to main',
    groups: {
      diamond: 0,
      branch: 1,
      trunk: 2,
      rootNode: 3,
      headNode: 4,
      branchNode: 5,
    },
    tracks: [
      {
        on: 'diamond',
        keys: {
          10: { s: 0.94, e: 'out' },
          24: { s: 1.02, e: 'settle' },
          60: { s: 1, e: 'out' },
        },
      },
      {
        on: 'trunk',
        draw: [12, 28],
        fill: [24, 32],
        width: 1.65,
      },
      {
        on: 'branch',
        draw: [20, 38],
        fill: [34, 42],
        width: 1.65,
      },
      {
        on: 'rootNode',
        keys: {
          10: { s: 0.2, o: 0, e: 'in' },
          18: { s: 1.25, o: 1, e: 'settle' },
          26: { s: 1, o: 1, e: 'out' },
        },
      },
      {
        on: 'headNode',
        keys: {
          22: { s: 0.2, o: 0, e: 'in' },
          32: { s: 1.25, o: 1, e: 'settle' },
          40: { s: 1, o: 1, e: 'out' },
        },
      },
      {
        on: 'branchNode',
        keys: {
          30: { s: 0.2, o: 0, e: 'in' },
          40: { s: 1.28, o: 1, e: 'settle' },
          48: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      // Glowing commit packet traveling from branch node back up to root/main
      {
        layer: 'over',
        svg: '<circle cx="14.6" cy="12.0" r="1.05" fill="#FDE047"/>',
        keys: {
          42: { x: 0, y: 0, s: 0.5, o: 0, e: 'out' },
          46: { x: 0, y: 0, s: 1.1, o: 1, e: 'inout' },
          58: { x: -4.9, y: -4.2, s: 1.0, o: 1, e: 'out' },
          64: { x: -4.9, y: -4.2, s: 1.5, o: 0, e: 'out' },
        },
      },
    ],
  },

  react: {
    story:
      'React nucleus pulses with a state update as its three electron orbits trace into place and spin smoothly in unison',
    groups: {
      nucleus: 0,
      orbits: [1, 2, 3],
    },
    tracks: [
      {
        on: 'nucleus',
        keys: {
          12: { s: 0.65, e: 'inout' },
          26: { s: 1.24, e: 'settle' },
          40: { s: 0.94, e: 'inout' },
          56: { s: 1.08, e: 'settle' },
          66: { s: 1, e: 'out' },
        },
      },
      {
        on: 'orbits',
        stagger: 4,
        draw: [10, 32],
        fill: [28, 36],
        width: 0.95,
      },
      {
        on: 'orbits',
        origin: [12, 12],
        end: { r: 180 },
        keys: {
          10: { r: 0, e: 'inout' },
          64: { r: 180, e: 'out' },
        },
      },
    ],
    props: [
      // Subtle state-change ripple expanding from the nucleus
      {
        layer: 'over',
        origin: [12, 12],
        svg: '<circle cx="12" cy="12" r="2.2" fill="none" stroke="#E0F7FF" stroke-width="0.6"/>',
        keys: {
          16: { s: 0.8, o: 0, e: 'out' },
          24: { s: 1.6, o: 0.9, e: 'out' },
          42: { s: 3.1, o: 0, e: 'out' },
        },
      },
    ],
  },

  typescript: {
    story:
      'TypeScript badge outlines and fills while T and S type-check into place, followed by a crisp sheen sweep and compiled check flash',
    groups: {
      badge: 0,
      t: 1,
      s: 2,
    },
    tracks: [
      {
        on: 'badge',
        draw: [8, 24],
        fill: [18, 28],
        width: 0.7,
        keys: {
          10: { s: 0.94, e: 'out' },
          26: { s: 1.02, e: 'settle' },
          40: { s: 1, e: 'out' },
        },
      },
      {
        on: 't',
        draw: [16, 34],
        fill: [28, 36],
        width: 0.65,
      },
      {
        on: 's',
        draw: [20, 38],
        fill: [32, 40],
        width: 0.65,
      },
    ],
    props: [
      // Crisp diagonal sheen across the badge once T & S lock in
      {
        layer: 'over',
        defs: '<clipPath id="ts_clip"><rect x="1.75" y="1.75" width="20.5" height="20.5" rx="2.4"/></clipPath>',
        svg: '<g clip-path="url(#ts_clip)"><polygon points="-4,1.5 1.5,1.5 -3.5,22.5 -9,22.5" fill="#FFFFFF" opacity="0.28"/></g>',
        keys: {
          44: { x: 0, o: 0, e: 'linear' },
          47: { x: 2, o: 1, e: 'inout' },
          62: { x: 30, o: 1, e: 'linear' },
          65: { x: 32, o: 0, e: 'out' },
        },
      },
      // Tiny green type-check spark in the upper-left corner of the badge
      {
        layer: 'over',
        svg: '<path d="M4.6 6.4 L5.8 7.6 L8.2 5.0" fill="none" stroke="#86EFAC" stroke-width="0.95" stroke-linecap="round" stroke-linejoin="round"/>',
        keys: {
          42: { s: 0.5, o: 0, e: 'out' },
          48: { s: 1.08, o: 1, e: 'settle' },
          58: { s: 1.0, o: 0.95, e: 'out' },
          66: { s: 0.85, o: 0, e: 'out' },
        },
      },
    ],
  },

  python: {
    story:
      'Dual blue and yellow Python snakes glide apart diagonally, trace their contours, and smoothly interlock back together',
    groups: {
      blue: 0,
      yellow: 1,
    },
    tracks: [
      {
        on: 'blue',
        draw: [10, 32],
        fill: [24, 34],
        width: 0.6,
        keys: {
          10: { x: -2.0, y: -2.0, e: 'inout' },
          36: { x: -1.4, y: -1.4, e: 'inout' },
          54: { x: 0.2, y: 0.2, e: 'settle' },
          64: { x: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'yellow',
        draw: [14, 36],
        fill: [28, 38],
        width: 0.6,
        keys: {
          10: { x: 2.0, y: 2.0, e: 'inout' },
          36: { x: 1.4, y: 1.4, e: 'inout' },
          54: { x: -0.2, y: -0.2, e: 'settle' },
          64: { x: 0, y: 0, e: 'out' },
        },
      },
    ],
  },

  postgresql: {
    story:
      'Slonik the PostgreSQL elephant traces its relational contour, gives a confident nod, and blinks as a query pulse confirms',
    groups: {
      body: 0,
      eyes: [1, 2],
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 60%',
        draw: [8, 34],
        fill: [26, 36],
        width: 0.55,
        keys: {
          32: { r: 0, y: 0, e: 'inout' },
          44: { r: -5, y: -0.4, e: 'inout' },
          54: { r: 3, y: 0.2, e: 'settle' },
          64: { r: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'eyes',
        each: true,
        keys: {
          40: { sy: 1, e: 'in' },
          45: { sy: 0.12, e: 'out' },
          51: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      // Subtle relational query ring pulsing around Slonik
      {
        layer: 'under',
        origin: [12, 12],
        svg: '<circle cx="12" cy="12" r="9.5" fill="none" stroke="#93C5FD" stroke-width="0.55"/>',
        keys: {
          34: { s: 0.85, o: 0, e: 'out' },
          46: { s: 1.12, o: 0.65, e: 'out' },
          62: { s: 1.24, o: 0, e: 'out' },
        },
      },
    ],
  },

  redis: {
    story:
      'Redis fires a sub-millisecond in-memory cache burst with a crisp lightning flash and energetic spring settle',
    tracks: [
      {
        on: 'all',
        origin: '50% 50%',
        keys: {
          12: { s: 0.88, r: -6, e: 'in' },
          24: { s: 1.09, r: 4, e: 'settle' },
          36: { s: 0.96, r: -2, e: 'inout' },
          48: { s: 1.04, r: 1, e: 'settle' },
          60: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      // High-speed read/write shockwave ring
      {
        layer: 'under',
        origin: [12, 12],
        svg: '<circle cx="12" cy="12" r="8.2" fill="none" stroke="#FCA5A5" stroke-width="0.7"/>',
        keys: {
          18: { s: 0.6, o: 0, e: 'out' },
          26: { s: 1.15, o: 0.85, e: 'out' },
          42: { s: 1.42, o: 0, e: 'out' },
        },
      },
      // Tiny golden cache-hit spark zipping across top-right
      {
        layer: 'over',
        svg: '<path d="M16.8 3.6 L15.2 6.8 L17.4 6.8 L15.8 9.8" fill="none" stroke="#FDE047" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>',
        keys: {
          20: { s: 0.4, o: 0, e: 'out' },
          26: { s: 1.1, o: 1, e: 'out' },
          38: { s: 0.95, o: 0.9, e: 'out' },
          48: { s: 0.6, o: 0, e: 'out' },
        },
      },
    ],
  },

  apachekafka: {
    story:
      'Event packets stream from producer nodes into the central Kafka broker and fan out to right-hand consumer partitions',
    tracks: [
      {
        on: 'all',
        keys: {
          12: { s: 0.98, e: 'inout' },
          34: { s: 1.03, e: 'settle' },
          58: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      // Producer packet 1: top node (8.96, 3.91) -> broker (8.96, 12.00)
      {
        layer: 'over',
        svg: '<circle cx="8.96" cy="3.91" r="1.05" fill="#38BDF8"/>',
        keys: {
          10: { x: 0, y: 0, s: 0.4, o: 0, e: 'out' },
          15: { x: 0, y: 0, s: 1.1, o: 1, e: 'inout' },
          30: { x: 0, y: 8.09, s: 1.0, o: 1, e: 'out' },
          35: { x: 0, y: 8.09, s: 0.3, o: 0, e: 'out' },
        },
      },
      // Producer packet 2: bottom node (8.96, 20.09) -> broker (8.96, 12.00)
      {
        layer: 'over',
        svg: '<circle cx="8.96" cy="20.09" r="1.05" fill="#38BDF8"/>',
        keys: {
          14: { x: 0, y: 0, s: 0.4, o: 0, e: 'out' },
          19: { x: 0, y: 0, s: 1.1, o: 1, e: 'inout' },
          34: { x: 0, y: -8.09, s: 1.0, o: 1, e: 'out' },
          39: { x: 0, y: -8.09, s: 0.3, o: 0, e: 'out' },
        },
      },
      // Broker pulse ring at (8.96, 12.00)
      {
        layer: 'over',
        origin: [8.96, 12.0],
        svg: '<circle cx="8.96" cy="12.0" r="1.95" fill="none" stroke="#FDE047" stroke-width="0.7"/>',
        keys: {
          28: { s: 0.7, o: 0, e: 'out' },
          35: { s: 1.25, o: 0.95, e: 'out' },
          46: { s: 1.75, o: 0, e: 'out' },
        },
      },
      // Consumer fan-out 1: broker (8.96, 12.00) -> top-right (15.85, 7.96)
      {
        layer: 'over',
        svg: '<circle cx="8.96" cy="12.0" r="1.0" fill="#4ADE80"/>',
        keys: {
          34: { x: 0, y: 0, s: 0.5, o: 0, e: 'out' },
          38: { x: 0, y: 0, s: 1.05, o: 1, e: 'inout' },
          56: { x: 6.89, y: -4.04, s: 1.05, o: 1, e: 'out' },
          64: { x: 6.89, y: -4.04, s: 1.5, o: 0, e: 'out' },
        },
      },
      // Consumer fan-out 2: broker (8.96, 12.00) -> bottom-right (15.85, 16.04)
      {
        layer: 'over',
        svg: '<circle cx="8.96" cy="12.0" r="1.0" fill="#4ADE80"/>',
        keys: {
          38: { x: 0, y: 0, s: 0.5, o: 0, e: 'out' },
          42: { x: 0, y: 0, s: 1.05, o: 1, e: 'inout' },
          60: { x: 6.89, y: 4.04, s: 1.05, o: 1, e: 'out' },
          68: { x: 6.89, y: 4.04, s: 1.5, o: 0, e: 'out' },
        },
      },
    ],
  },

  nodedotjs: {
    story:
      'Node.js hexagon traces its event-loop perimeter while the S core snaps in and a non-blocking tick pulses around the shell',
    groups: {
      hex: 0,
      core: 1,
    },
    tracks: [
      {
        on: 'hex',
        draw: [8, 34],
        fill: [26, 36],
        width: 0.65,
      },
      {
        on: 'core',
        keys: {
          16: { s: 0.6, o: 0, y: 1.2, e: 'in' },
          32: { s: 1.12, o: 1, y: -0.2, e: 'settle' },
          44: { s: 1, o: 1, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      // Event-loop tick dot pulsing along the outer hexagon
      {
        layer: 'over',
        origin: [12, 12],
        svg: '<polygon points="12,1.6 21,6.8 21,17.2 12,22.4 3,17.2 3,6.8" fill="none" stroke="#86EFAC" stroke-width="0.65" stroke-dasharray="5 58"/>',
        keys: {
          30: { r: 0, o: 0, e: 'linear' },
          36: { r: 20, o: 0.9, e: 'linear' },
          58: { r: 120, o: 0.85, e: 'out' },
          66: { r: 150, o: 0, e: 'out' },
        },
      },
    ],
  },

  figma: {
    story:
      'Design alignment guides briefly appear as Figma’s five geometric primitives snap cleanly onto the canvas grid',
    groups: {
      green: 0,
      orange: 1,
      cyan: 2,
      red: 3,
      purple: 4,
    },
    tracks: [
      {
        on: 'red',
        keys: {
          10: { x: -2.6, y: -2.0, o: 0.35, e: 'inout' },
          26: { x: 0.25, y: 0.15, o: 1, e: 'settle' },
          34: { x: 0, y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'orange',
        keys: {
          14: { x: 2.6, y: -2.0, o: 0.35, e: 'inout' },
          30: { x: -0.25, y: 0.15, o: 1, e: 'settle' },
          38: { x: 0, y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'purple',
        keys: {
          18: { x: -2.8, y: 0, o: 0.35, e: 'inout' },
          34: { x: 0.25, y: 0, o: 1, e: 'settle' },
          42: { x: 0, y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'cyan',
        keys: {
          22: { x: 2.8, y: 0, s: 0.65, o: 0.35, e: 'inout' },
          38: { x: -0.2, y: 0, s: 1.08, o: 1, e: 'settle' },
          46: { x: 0, y: 0, s: 1, o: 1, e: 'out' },
        },
      },
      {
        on: 'green',
        keys: {
          26: { x: -2.0, y: 2.4, o: 0.35, e: 'inout' },
          42: { x: 0.15, y: -0.2, o: 1, e: 'settle' },
          52: { x: 0, y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      // Crisp cyan design smart-guides flashing briefly during snap
      {
        layer: 'under',
        svg: '<g stroke="#38BDF8" stroke-width="0.35" stroke-dasharray="1.1 1.1"><line x1="12" y1="0.8" x2="12" y2="23.2"/><line x1="3.5" y1="8.35" x2="20.5" y2="8.35"/><line x1="3.5" y1="15.65" x2="20.5" y2="15.65"/></g>',
        keys: {
          10: { o: 0, e: 'out' },
          18: { o: 0.7, e: 'linear' },
          46: { o: 0.65, e: 'out' },
          58: { o: 0, e: 'out' },
        },
      },
    ],
  },

  rust: {
    story:
      'Rust gear winds back, drives forward with two crisp mechanical torque ratchets, throws brief forged sparks, and locks solidly',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          14: { r: -14, e: 'inout' },
          26: { r: 22, e: 'settle' },
          34: { r: 18, e: 'inout' },
          48: { r: 48, e: 'settle' },
          60: { r: -4, e: 'settle' },
          68: { r: 0, e: 'out' },
        },
      },
    ],
    props: [
      // Forged orange-gold sparks flying off upper-right gear teeth on torque step
      {
        layer: 'over',
        svg: '<g stroke="#FB923C" stroke-width="0.7" stroke-linecap="round"><line x1="19.2" y1="5.0" x2="21.0" y2="3.2"/><line x1="20.6" y1="7.2" x2="22.4" y2="6.4"/></g>',
        keys: {
          24: { x: -0.8, y: 0.8, s: 0.4, o: 0, e: 'out' },
          30: { x: 0.4, y: -0.4, s: 1.05, o: 1, e: 'out' },
          40: { x: 1.4, y: -1.4, s: 0.7, o: 0, e: 'out' },
        },
      },
      {
        layer: 'over',
        svg: '<g stroke="#FBBF24" stroke-width="0.7" stroke-linecap="round"><line x1="4.8" y1="19.0" x2="3.0" y2="20.8"/><line x1="3.4" y1="16.8" x2="1.6" y2="17.6"/></g>',
        keys: {
          44: { x: 0.8, y: -0.8, s: 0.4, o: 0, e: 'out' },
          50: { x: -0.4, y: 0.4, s: 1.05, o: 1, e: 'out' },
          60: { x: -1.4, y: 1.4, s: 0.7, o: 0, e: 'out' },
        },
      },
    ],
  },
};
