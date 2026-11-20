// Story-driven animation specs for all 44 icons in the "Embedded development" category.
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
  breathe,
} from '../motifs.mjs';

export default {
  arduino: {
    story:
      'Arduino infinity loop traces its closed circuit path while minus and plus voltage terminals pulse and exchange live current sparks',
    groups: {
      loop: 0,
      plus: 1,
      minus: 2,
    },
    tracks: [
      {
        on: 'loop',
        draw: [8, 30],
        fill: [24, 34],
        width: 0.7,
      },
      {
        on: 'minus',
        keys: heartbeat(18, 0.18),
      },
      {
        on: 'plus',
        keys: {
          24: { s: 0.7, r: -18, e: 'in' },
          36: { s: 1.22, r: 12, e: 'settle' },
          48: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(6.3, 11.9, 17.7, 11.9, '#2DD4BF', 22, 54, 0.95),
      spark(17.7, 8.8, 1.4, -1.6, '#5EEAD4', 32, 54),
      spark(6.3, 15.0, -1.4, 1.6, '#5EEAD4', 24, 46),
    ],
  },

  raspberrypi: {
    story:
      'Raspberry Pi berry pulses with an RP2040 boot heartbeat as its status badge lights up and GPIO signal LEDs blink along the header',
    groups: {
      berry: 0,
      dot: 1,
      badge: 2,
    },
    tracks: [
      {
        on: 'berry',
        draw: [8, 28],
        fill: [22, 32],
        width: 0.55,
        keys: heartbeat(16, 0.06),
      },
      {
        on: 'badge',
        keys: popIn(24, 0.45),
      },
      {
        on: 'dot',
        keys: heartbeat(28, 0.25),
      },
    ],
    props: [
      pulseRing(12, 12, 9.4, '#F43F5E', 24, 56),
      packet(4.0, 20.5, 4.0, 18.0, '#4ADE80', 22, 46, 0.8),
      packet(6.8, 20.5, 6.8, 18.0, '#FBBF24', 30, 54, 0.8),
      packet(9.6, 20.5, 9.6, 18.0, '#38BDF8', 38, 62, 0.8),
    ],
  },

  espressif: {
    story:
      'Espressif ESP32 radio beacon pulses at its lower-left emitter while concentric Wi-Fi and BLE wave arcs radiate diagonally outward',
    groups: {
      beacon: 4,
      waves: [0, 3, 1, 2],
    },
    tracks: [
      {
        on: 'beacon',
        keys: heartbeat(10, 0.22),
      },
      {
        on: 'waves',
        stagger: 5,
        each: true,
        keys: {
          12: { s: 0.9, o: 0.4, e: 'in' },
          24: { s: 1.06, o: 1, e: 'settle' },
          38: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(7.1, 17, 6.2, '#FB7185', 20, 52),
      pulseRing(7.1, 17, 10.2, '#FCA5A5', 30, 64),
    ],
  },

  arm: {
    story:
      'Arm RISC pipeline stages fetch, decode, and execute left-to-right across the a, r, and m letterforms while an instruction bus sweeps beneath',
    groups: {
      letters: [0, 1, 2],
    },
    tracks: [
      {
        on: 'letters',
        order: 'x',
        stagger: 6,
        each: true,
        draw: [10, 26],
        fill: [20, 30],
        width: 0.55,
        keys: slideIn(10, -1.8, 0),
      },
    ],
    props: [
      guides([[2.5, 17.5, 21.5, 17.5]], '#38BDF8', 12, 60),
      packet(2.5, 17.5, 21.5, 17.5, '#38BDF8', 18, 56, 0.9),
    ],
  },

  stmicroelectronics: {
    story:
      'STMicroelectronics STM32 monogram locks its bus traces into place as Cortex-M clock pulses sweep cleanly across the silicon die',
    groups: {
      top: 0,
      mid: 2,
      right: 1,
    },
    tracks: [
      {
        on: 'top',
        draw: [8, 28],
        fill: [22, 32],
        width: 0.55,
      },
      {
        on: 'mid',
        keys: slideIn(16, -2.0, 0.8),
      },
      {
        on: 'right',
        keys: slideIn(22, 2.0, -0.8),
      },
    ],
    props: [
      sheen('<rect x="0.5" y="5" width="23" height="14" rx="1"/>', 38, 64, 0.26),
      packet(3.0, 19.2, 21.0, 19.2, '#60A5FA', 20, 54, 0.85),
    ],
  },

  platformio: {
    story:
      'PlatformIO mascot snaps its dual cross-platform build halves together, blinks both eyes, and flashes a firmware-compiled checkmark',
    groups: {
      leftHalf: 1,
      rightHalf: 0,
      eyes: [2, 3],
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
        on: 'eyes',
        each: true,
        keys: {
          34: { sy: 1, e: 'in' },
          39: { sy: 0.12, e: 'out' },
          45: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#FDBA74', 22, 52), checkFlash(16.6, 5.2, '#86EFAC', 44, 66)],
  },

  freertos: {
    story:
      'FreeRTOS deterministic scheduler ticks around its green kernel badge as real-time tasks preempt and context-switch cleanly in the core',
    groups: {
      badge: 0,
      core: 1,
      ring: 2,
    },
    tracks: [
      {
        on: 'badge',
        keys: breathe(10, 0.04),
      },
      {
        on: 'ring',
        origin: [12, 12],
        keys: torque(12, 16, 32),
      },
      {
        on: 'core',
        keys: heartbeat(18, 0.14),
      },
    ],
    props: [radar(12, 12, 10.6, '#86EFAC', 12, 64, 120), checkFlash(16.5, 5.0, '#BBF7D0', 46, 68)],
  },

  riscv: {
    story:
      'RISC-V open ISA modules assemble from base and extension blocks as a clean vector instruction sweeps across the silicon die',
    groups: {
      left: 1,
      main: 0,
      ext: 2,
    },
    tracks: [
      {
        on: 'left',
        keys: dropIn(10, 2.6),
      },
      {
        on: 'main',
        draw: [14, 34],
        fill: [28, 38],
        width: 0.55,
      },
      {
        on: 'ext',
        keys: slideIn(26, 2.4, 1.8),
      },
    ],
    props: [
      guides(
        [
          [3, 4.5, 21, 4.5],
          [3, 19.5, 21, 19.5],
        ],
        '#93C5FD',
        12,
        56
      ),
      packet(3.5, 4.5, 20.5, 4.5, '#FBBF24', 34, 62, 0.9),
    ],
  },

  zephyr: {
    story:
      'Zephyr RTOS aerodynamic kite lifts on a brisk wind current while its inner kernel core glides forward and emits a low-power telemetry pulse',
    groups: {
      inner: 0,
      outer: 1,
    },
    tracks: [
      {
        on: 'outer',
        draw: [8, 28],
        fill: [22, 32],
        width: 0.55,
        keys: sway(10, 4.5, 0.6),
      },
      {
        on: 'inner',
        keys: {
          14: { x: -1.4, y: 1.4, e: 'inout' },
          34: { x: 0.8, y: -0.8, s: 1.06, e: 'settle' },
          54: { x: 0, y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [waveLine(20.4, '#7DD3FC', 14, 62), pulseRing(15.5, 8.5, 4.5, '#93C5FD', 32, 62)],
  },

  ros: {
    story:
      'ROS 3x3 node matrix awakens radially from its central master node as pub-sub sensor messages route across the robotic computation graph',
    groups: {
      center: 3,
      ring: [0, 1, 2, 4, 5, 6, 7, 8],
    },
    tracks: [
      {
        on: 'center',
        keys: heartbeat(10, 0.22),
      },
      {
        on: 'ring',
        order: 'a',
        stagger: 3.2,
        each: true,
        keys: popIn(14, 0.45),
      },
    ],
    props: [
      radar(12, 12, 10.2, '#94A3B8', 14, 64, 90),
      packet(4.1, 4.0, 12.0, 12.0, '#38BDF8', 18, 42, 0.95),
      packet(12.0, 12.0, 19.9, 20.0, '#4ADE80', 38, 64, 0.95),
    ],
  },

  kicad: {
    story:
      'KiCad schematic badge and PCB copper traces route cleanly across the board while a via pad flashes gold on DRC pass',
    groups: {
      via: 0,
      badge: [1, 2],
      letters: [4, 5, 3],
    },
    tracks: [
      {
        on: 'badge',
        draw: [8, 28],
        fill: [22, 32],
        width: 0.55,
      },
      {
        on: 'letters',
        order: 'x',
        stagger: 5,
        each: true,
        keys: riseIn(16, 2.2),
      },
      {
        on: 'via',
        keys: heartbeat(28, 0.35),
      },
    ],
    props: [
      guides(
        [
          [2, 18.2, 22, 18.2],
          [7.7, 4, 7.7, 18.2],
        ],
        '#60A5FA',
        10,
        58
      ),
      packet(2.5, 18.2, 21.5, 18.2, '#FBBF24', 24, 58, 0.9),
    ],
  },

  micropython: {
    story:
      'MicroPython compact chip outline traces its silicon perimeter as a REPL prompt pulse and bytecode spark flash on the microcontroller',
    tracks: [
      {
        on: 'all',
        keys: breathe(12, 0.06),
      },
      {
        on: 0,
        draw: [8, 34],
        fill: [26, 38],
        width: 0.55,
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#FACC15', 32, 64), boltFlash(17.5, 3.8, '#38BDF8', 24, 54)],
  },

  nordicsemiconductor: {
    story:
      'Nordic Semiconductor nRF ultra-low-power wireless arcs sweep into phase while top and bottom BLE antenna beacons ping',
    groups: {
      waves: [0, 2],
      beacons: [1, 3],
    },
    tracks: [
      {
        on: 'waves',
        stagger: 5,
        draw: [10, 32],
        fill: [26, 36],
        width: 0.55,
      },
      {
        on: 'beacons',
        stagger: 6,
        each: true,
        keys: popIn(20, 0.35),
      },
    ],
    props: [
      pulseRing(14.6, 4.9, 3.2, '#38BDF8', 24, 54),
      pulseRing(9.4, 19.0, 3.2, '#38BDF8', 32, 62),
    ],
  },

  texasinstruments: {
    story:
      'Texas Instruments analog-to-DSP signal chain steps up across the emblem while the crimson status node pulses with a C2000 clock burst',
    groups: {
      left: 0,
      stem: 1,
      dot: 2,
      bar: 3,
    },
    tracks: [
      {
        on: 'left',
        draw: [8, 28],
        fill: [22, 32],
        width: 0.6,
      },
      {
        on: 'stem',
        keys: riseIn(16, 2.4),
      },
      {
        on: 'dot',
        keys: {
          20: { y: -2.2, s: 0.6, e: 'in' },
          34: { y: 0.2, s: 1.18, e: 'settle' },
          46: { y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'bar',
        keys: riseIn(26, 2.8),
      },
    ],
    props: [waveLine(21.2, '#FCA5A5', 14, 62), pulseRing(16.1, 5.0, 3.4, '#EF4444', 30, 58)],
  },

  nxp: {
    story:
      'NXP automotive CAN-bus frames converge from N and P into the central X cross-switch, triggering a synchronized silicon bus pulse',
    groups: {
      n: 0,
      x: 2,
      p: 1,
    },
    tracks: [
      {
        on: 'n',
        keys: slideIn(10, -2.4, 0),
      },
      {
        on: 'p',
        keys: slideIn(10, 2.4, 0),
      },
      {
        on: 'x',
        keys: {
          18: { s: 0.82, r: -8, e: 'inout' },
          34: { s: 1.1, r: 4, e: 'settle' },
          48: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(3.5, 12.0, 12.0, 12.0, '#FBBF24', 20, 44, 0.9),
      packet(20.5, 12.0, 12.0, 12.0, '#38BDF8', 22, 46, 0.9),
      pulseRing(12.1, 12.0, 5.2, '#93C5FD', 38, 64),
    ],
  },

  infineon: {
    story:
      'Infineon crimson power-ring traces around the silicon wordmark while AURIX automotive control letters cascade into lockstep',
    groups: {
      ring: [0, 1],
      letters: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    },
    tracks: [
      {
        on: 'ring',
        stagger: 4,
        draw: [8, 30],
        fill: [24, 34],
        width: 0.55,
      },
      {
        on: 'letters',
        order: 'x',
        stagger: 2.2,
        each: true,
        keys: popIn(16, 0.65),
      },
    ],
    props: [
      boltFlash(19.5, 4.2, '#F87171', 34, 60),
      sheen('<rect x="0.5" y="6" width="23" height="12"/>', 42, 66, 0.24),
    ],
  },

  amd: {
    story:
      'AMD Zynq adaptive silicon letters lock in sequence while the iconic corner arrow punches diagonally outward with FPGA throughput',
    groups: {
      letters: [1, 2, 3],
      arrow: [0, 4],
    },
    tracks: [
      {
        on: 'letters',
        order: 'x',
        stagger: 5,
        each: true,
        keys: slideIn(10, -1.6, 0),
      },
      {
        on: 'arrow',
        keys: {
          24: { x: 0, y: 0, s: 0.9, e: 'in' },
          38: { x: 1.4, y: -1.4, s: 1.12, e: 'settle' },
          56: { x: 0, y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(21.2, 8.2, 1.8, -1.8, '#FCA5A5', 34, 56),
      spark(22.0, 10.6, 1.6, -0.6, '#FDE047', 38, 60),
    ],
  },

  intel: {
    story:
      'Intel silicon die square pops above the i-stem, cascading a high-clock instruction wave across the x86 and Quartus FPGA wordmark',
    groups: {
      dot: 1,
      letters: [5, 3, 2, 4, 0],
    },
    tracks: [
      {
        on: 'dot',
        keys: {
          10: { y: -2.5, s: 0.4, o: 0, e: 'in' },
          20: { y: 0.2, s: 1.3, o: 1, e: 'settle' },
          30: { y: 0, s: 1, o: 1, e: 'out' },
        },
      },
      {
        on: 'letters',
        order: 'x',
        stagger: 4,
        each: true,
        keys: riseIn(16, 1.8),
      },
    ],
    props: [
      pulseRing(1.3, 8.5, 2.4, '#60A5FA', 18, 46),
      packet(1.3, 8.5, 21.5, 8.5, '#38BDF8', 28, 56, 0.85),
    ],
  },

  qualcomm: {
    story:
      'Snapdragon wireless modem spiral winds up with a torque burst and radiates twin 5G millimeter-wave RF rings',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          12: { r: -16, s: 0.9, e: 'inout' },
          32: { r: 14, s: 1.08, e: 'settle' },
          50: { r: -4, s: 0.98, e: 'inout' },
          64: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 8.6, '#60A5FA', 22, 54), pulseRing(12, 12, 10.8, '#93C5FD', 32, 64)],
  },

  yocto: {
    story:
      'Yocto Project BitBake recipes layer into a custom embedded Linux image as the blue build indicator blinks and verifies',
    groups: {
      dot: 0,
      main: [1, 2, 4, 3],
      sub: [5, 11, 6, 7, 8, 9, 10],
    },
    tracks: [
      {
        on: 'main',
        order: 'x',
        stagger: 4,
        each: true,
        keys: dropIn(10, 2.0),
      },
      {
        on: 'sub',
        order: 'x',
        stagger: 2.2,
        each: true,
        keys: riseIn(24, 1.4),
      },
      {
        on: 'dot',
        keys: heartbeat(36, 0.35),
      },
    ],
    props: [
      guides([[1.5, 18.2, 22.5, 18.2]], '#4597D9', 14, 58),
      pulseRing(23.1, 11.1, 1.8, '#38BDF8', 38, 64),
    ],
  },

  homeassistant: {
    story:
      'Home Assistant smart house outlines its local-first roofline while three sensor nodes inside illuminate with live automation telemetry',
    tracks: [
      {
        on: 'all',
        keys: breathe(24, 0.04),
      },
      {
        on: 0,
        draw: [8, 32],
        fill: [24, 36],
        width: 0.55,
      },
    ],
    props: [
      packet(12.0, 18.0, 8.2, 13.5, '#FDE047', 24, 50, 0.85),
      packet(12.0, 18.0, 12.0, 9.8, '#4ADE80', 28, 54, 0.85),
      packet(12.0, 18.0, 15.8, 13.5, '#7DD3FC', 32, 58, 0.85),
      pulseRing(12, 11.5, 9.6, '#38BDF8', 36, 66),
    ],
  },

  esphome: {
    story:
      'ESPHome OTA firmware flashes wirelessly to the smart-home node with an expanding Wi-Fi halo and confirmation check',
    tracks: [
      {
        on: 'all',
        keys: {
          12: { s: 0.92, y: 0.8, e: 'inout' },
          28: { s: 1.05, y: -0.5, e: 'settle' },
          46: { s: 0.99, y: 0.1, e: 'inout' },
          60: { s: 1, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 8.8, '#38BDF8', 18, 50),
      packet(12.0, 20.5, 12.0, 11.5, '#FDE047', 22, 48, 0.95),
      checkFlash(16.2, 5.4, '#86EFAC', 44, 66),
    ],
  },

  nodered: {
    story:
      'Node-RED event payload enters the left input node, streams along both curved wires, and triggers the right-hand output nodes',
    groups: {
      inNode: 2,
      upperWire: 0,
      lowerWire: 3,
      outTop: 1,
      outBot: 4,
    },
    tracks: [
      {
        on: 'inNode',
        keys: heartbeat(10, 0.2),
      },
      {
        on: 'upperWire',
        draw: [14, 34],
        fill: [28, 38],
        width: 0.6,
      },
      {
        on: 'lowerWire',
        draw: [18, 38],
        fill: [32, 42],
        width: 0.6,
      },
      {
        on: 'outTop',
        keys: popIn(34, 0.7),
      },
      {
        on: 'outBot',
        keys: popIn(38, 0.7),
      },
    ],
    props: [
      packet(3.3, 12.1, 16.4, 7.7, '#FDE047', 16, 44, 0.95),
      packet(3.3, 12.1, 20.7, 15.9, '#FB7185', 22, 52, 0.95),
    ],
  },

  mqtt: {
    story:
      'MQTT publish-subscribe waves ripple diagonally from the bottom-left broker corner out through concentric topic bands to the subscriber',
    groups: {
      bands: [0, 1, 2, 3],
    },
    tracks: [
      {
        on: 'bands',
        stagger: 5,
        each: true,
        keys: heartbeat(10, 0.08),
      },
    ],
    props: [
      packet(4.5, 19.5, 19.1, 4.8, '#E879F9', 16, 52, 1.0),
      pulseRing(19.1, 4.8, 3.2, '#F0ABFC', 42, 68),
    ],
  },

  bluetooth: {
    story:
      'Bluetooth rune traces its dual-triangle GATT antenna while short-range BLE advertising pings radiate left and right',
    groups: {
      rune: 0,
      upper: 1,
      lower: 2,
    },
    tracks: [
      {
        on: 'rune',
        draw: [8, 30],
        fill: [24, 34],
        width: 0.6,
      },
      {
        on: 'upper',
        keys: popIn(22, 0.5),
      },
      {
        on: 'lower',
        keys: popIn(28, 0.5),
      },
    ],
    props: [
      pulseRing(12, 12, 9.2, '#60A5FA', 26, 58),
      spark(20.2, 8.2, 1.6, -0.8, '#93C5FD', 32, 54),
      spark(3.8, 15.8, -1.6, 0.8, '#93C5FD', 36, 58),
    ],
  },

  zigbee: {
    story:
      'Zigbee interlocking mesh halves snap into a self-healing 802.15.4 ring while a low-power hop packet zips across the Z bridge',
    groups: {
      top: 0,
      bot: 1,
    },
    tracks: [
      {
        on: 'top',
        draw: [10, 30],
        fill: [24, 34],
        width: 0.55,
        keys: slideIn(10, 2.0, -1.6),
      },
      {
        on: 'bot',
        draw: [14, 34],
        fill: [28, 38],
        width: 0.55,
        keys: slideIn(14, -2.0, 1.6),
      },
    ],
    props: [
      packet(6.5, 17.5, 17.5, 6.5, '#FDA4AF', 30, 58, 0.95),
      pulseRing(12, 12, 9.6, '#FB7185', 36, 66),
    ],
  },

  matter: {
    story:
      'Matter three interoperability prongs converge inward from distinct smart-home ecosystems to lock into a unified IP fabric',
    groups: {
      top: 2,
      left: 1,
      right: 0,
    },
    tracks: [
      {
        on: 'top',
        keys: slideIn(10, 0, -2.4),
      },
      {
        on: 'left',
        keys: slideIn(14, -2.2, 1.6),
      },
      {
        on: 'right',
        keys: slideIn(18, 2.2, 1.6),
      },
    ],
    props: [
      radar(12, 12.8, 9.8, '#94A3B8', 14, 64, 120),
      pulseRing(12, 12.8, 4.2, '#38BDF8', 32, 62),
    ],
  },

  thread: {
    story:
      'Thread IPv6 mesh loop traces its continuous border-router perimeter while the inner node beacon pings across the low-power fabric',
    groups: {
      loop: 0,
      node: 1,
    },
    tracks: [
      {
        on: 'loop',
        draw: [8, 36],
        fill: [28, 40],
        width: 0.6,
      },
      {
        on: 'node',
        keys: heartbeat(22, 0.3),
      },
    ],
    props: [
      radar(12, 12, 10.6, '#94A3B8', 14, 64, 90),
      pulseRing(15.2, 8.6, 3.6, '#38BDF8', 28, 60),
    ],
  },

  adafruit: {
    story:
      'Adafruit circuit flower spins with maker energy as its five petals bloom and radiate open-hardware STEMMA sensor sparks',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          12: { r: -24, s: 0.88, e: 'inout' },
          34: { r: 48, s: 1.06, e: 'settle' },
          54: { r: -6, s: 0.98, e: 'settle' },
          66: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#38BDF8', 26, 58),
      spark(18.5, 5.5, 1.8, -1.8, '#FDE047', 30, 52),
      spark(5.5, 18.5, -1.8, 1.8, '#F472B6', 36, 58),
    ],
  },

  sparkfun: {
    story:
      'SparkFun soldering flame flickers upward from its base, popping bright Qwiic prototyping sparks into the air',
    tracks: [
      {
        on: 'all',
        origin: '50% 85%',
        keys: {
          10: { r: -5, sy: 0.92, sx: 1.05, e: 'inout' },
          26: { r: 6, sy: 1.08, sx: 0.95, e: 'settle' },
          42: { r: -4, sy: 1.04, sx: 0.98, e: 'inout' },
          58: { r: 2, sy: 0.99, sx: 1.01, e: 'settle' },
          66: { r: 0, sy: 1, sx: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(15.2, 4.4, 1.8, -2.0, '#FDE047', 20, 44),
      spark(8.8, 6.0, -1.6, -1.8, '#FB923C', 30, 54),
      boltFlash(17.6, 8.2, '#FBBF24', 34, 60),
    ],
  },

  balena: {
    story:
      'balena container cube assembles its layered OS facets on the left while an OTA fleet update cascades across the wordmark',
    groups: {
      cube: [0, 1, 2, 3, 4, 5],
      word: [6, 7, 8, 9, 10, 11],
    },
    tracks: [
      {
        on: 'cube',
        order: 'y',
        stagger: 3,
        each: true,
        keys: popIn(10, 0.45),
      },
      {
        on: 'word',
        order: 'x',
        stagger: 3.2,
        each: true,
        keys: riseIn(24, 1.6),
      },
    ],
    props: [
      pulseRing(3.4, 11.5, 4.0, '#00A275', 22, 52),
      packet(4.5, 10.2, 21.5, 10.2, '#48C0ED', 32, 60, 0.85),
    ],
  },

  px4: {
    story:
      'PX4 drone flight controller banks into a stabilized attitude hover while autopilot telemetry locks on across the HUD',
    groups: {
      main: [0, 1, 2, 3],
      sub: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    },
    tracks: [
      {
        on: 'main',
        origin: [12, 10.5],
        keys: {
          12: { y: -1.6, r: -4, e: 'inout' },
          32: { y: -2.2, r: 4, e: 'inout' },
          50: { y: 0.2, r: -1, e: 'settle' },
          62: { y: 0, r: 0, e: 'out' },
        },
      },
      {
        on: 'sub',
        order: 'x',
        stagger: 2,
        each: true,
        keys: popIn(20, 0.6),
      },
    ],
    props: [
      guides(
        [
          [2, 6.2, 22, 6.2],
          [12, 4.2, 12, 8.2],
        ],
        '#38BDF8',
        12,
        58
      ),
      packet(3.0, 6.2, 21.0, 6.2, '#4ADE80', 18, 52, 0.85),
    ],
  },

  qmk: {
    story:
      'QMK mechanical keycap depresses with a crisp tactile switch actuation, fires a key-matrix scan pulse, and rebounds cleanly',
    tracks: [
      {
        on: 'all',
        origin: '50% 60%',
        keys: {
          12: { y: 0, s: 1, e: 'in' },
          20: { y: 2.0, s: 0.93, e: 'out' },
          30: { y: -0.4, s: 1.03, e: 'settle' },
          40: { y: 1.5, s: 0.95, e: 'out' },
          52: { y: -0.2, s: 1.02, e: 'settle' },
          62: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.6, '#38BDF8', 20, 48), pulseRing(12, 12, 9.6, '#F472B6', 40, 66)],
  },

  klipper: {
    story:
      'Klipper high-speed 3D printer gantry glides left-to-right laying down a heated filament bead while precision stepper pulses lock in',
    groups: {
      gantry: [0, 9],
      letters: [3, 1, 2, 10, 4, 5, 6, 7, 8],
    },
    tracks: [
      {
        on: 'gantry',
        keys: {
          12: { x: -1.8, e: 'inout' },
          28: { x: 1.8, e: 'inout' },
          44: { x: -0.8, e: 'inout' },
          58: { x: 0, e: 'out' },
        },
      },
      {
        on: 'letters',
        order: 'x',
        stagger: 2.2,
        each: true,
        keys: riseIn(18, 1.5),
      },
    ],
    props: [
      guides([[3, 14.5, 21, 14.5]], '#EF4444', 12, 54),
      packet(4.0, 14.5, 20.0, 14.5, '#FB923C', 14, 48, 0.9),
    ],
  },

  easyeda: {
    story:
      'EasyEDA web schematic traces its copper-blue silhouette while SPICE simulation waves and a PCB signal packet glide across',
    tracks: [
      {
        on: 'all',
        keys: breathe(24, 0.05),
      },
      {
        on: 0,
        draw: [8, 34],
        fill: [26, 38],
        width: 0.55,
      },
    ],
    props: [
      waveLine(19.8, '#60A5FA', 14, 62),
      packet(3.5, 12.0, 20.5, 12.0, '#FDE047', 28, 58, 0.9),
    ],
  },

  microchip: {
    story:
      'Microchip PIC/AVR red emblem pulses with a hardware clock cycle while the semiconductor wordmark cascades cleanly beneath',
    groups: {
      emblem: [0, 1],
      word: [10, 9, 7, 6, 5, 2, 4, 8, 3],
    },
    tracks: [
      {
        on: 'emblem',
        draw: [10, 30],
        fill: [24, 34],
        width: 0.5,
        keys: heartbeat(10, 0.12),
      },
      {
        on: 'word',
        order: 'x',
        stagger: 2.2,
        each: true,
        keys: riseIn(20, 1.4),
      },
    ],
    props: [pulseRing(12, 10, 6.2, '#F87171', 22, 54), boltFlash(18.5, 5.5, '#FDE047', 34, 60)],
  },

  beagleboard: {
    story:
      'BeagleBoard open-hardware Linux board and PRU real-time units pulse in alternating dual-core sync with a warm GPIO signal sweep',
    groups: (parts) => ({
      warm: parts.filter((p) => p.center[0] < 12).map((p) => p.i),
      bright: parts.filter((p) => p.center[0] >= 12).map((p) => p.i),
    }),
    tracks: [
      {
        on: 'warm',
        origin: [7, 12],
        keys: heartbeat(10, 0.08),
      },
      {
        on: 'bright',
        origin: [17, 12],
        keys: heartbeat(22, 0.08),
      },
    ],
    props: [
      guides([[3, 16.5, 22, 16.5]], '#A97F2C', 12, 58),
      packet(3.5, 16.5, 21.5, 16.5, '#F26322', 16, 52, 0.85),
    ],
  },

  seeedstudio: {
    story:
      'Seeed Studio XIAO and Grove ecosystem sprouts across the mark with a fresh green edge-AI pulse and I2C sensor packet',
    groups: (parts) => ({
      left: parts.filter((p) => p.box && p.box.width > 0 && p.center[0] < 12).map((p) => p.i),
      right: parts.filter((p) => p.box && p.box.width > 0 && p.center[0] >= 12).map((p) => p.i),
    }),
    tracks: [
      {
        on: 'left',
        keys: slideIn(10, -1.6, 0),
      },
      {
        on: 'right',
        keys: slideIn(18, 1.6, 0),
      },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#8DC21F', 24, 58),
      packet(2.5, 16.5, 21.5, 16.5, '#A3E635', 22, 54, 0.85),
    ],
  },

  broadcom: {
    story:
      'Broadcom high-speed RF carrier wave traces its crimson signal peak above the SoC base while gigabit packets streak across',
    groups: {
      wave: 0,
      base: 1,
    },
    tracks: [
      {
        on: 'wave',
        draw: [8, 32],
        fill: [26, 36],
        width: 0.65,
        keys: {
          30: { y: 0, s: 1, e: 'inout' },
          42: { y: -1.0, s: 1.04, e: 'settle' },
          56: { y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'base',
        keys: riseIn(14, 1.8),
      },
    ],
    props: [
      packet(2.5, 10.5, 21.5, 10.5, '#FCA5A5', 28, 56, 0.9),
      pulseRing(12, 12, 9.8, '#FB7185', 34, 64),
    ],
  },

  tinygo: {
    story:
      'TinyGo microcontroller gopher blinks inside its cyan QFN silicon package as all sixteen IC pins fire compiled Go goroutine pulses',
    groups: (parts) => ({
      pkg: 0,
      die: 1,
      eyes: [2, 3],
      pins: parts.filter((p) => p.i >= 4).map((p) => p.i),
    }),
    tracks: [
      {
        on: 'pkg',
        keys: breathe(10, 0.05),
      },
      {
        on: 'die',
        keys: heartbeat(14, 0.08),
      },
      {
        on: 'eyes',
        each: true,
        keys: {
          32: { sy: 1, e: 'in' },
          37: { sy: 0.12, e: 'out' },
          43: { sy: 1, e: 'out' },
        },
      },
      {
        on: 'pins',
        order: 'a',
        stagger: 2.0,
        each: true,
        keys: popIn(12, 0.55),
      },
    ],
    props: [pulseRing(12, 12, 9.6, '#38BDF8', 26, 58), boltFlash(19.2, 3.6, '#FDE047', 38, 62)],
  },

  lorawan: {
    story:
      'LoRaWAN chirp-spread-spectrum arcs radiate vertically from the radio emblem as a long-range LPWAN beacon propagates across the wordmark',
    groups: (parts) => ({
      arcs: [4, 5, 6, 7, 8, 9],
      word: parts.filter((p) => p.i < 4 || p.i > 9).map((p) => p.i),
    }),
    tracks: [
      {
        on: 'arcs',
        order: 'r',
        stagger: 3.5,
        each: true,
        keys: popIn(12, 0.45),
      },
      {
        on: 'word',
        keys: {
          14: { s: 0.96, e: 'inout' },
          34: { s: 1.03, e: 'settle' },
          54: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(3.3, 12.0, 5.2, '#38BDF8', 22, 56),
      packet(3.3, 12.0, 21.5, 12.0, '#7DD3FC', 26, 60, 0.9),
    ],
  },

  thethingsnetwork: {
    story:
      'The Things Network community LoRaWAN gateway broadcasts long-range uplink packets from its left emblem across the global network',
    groups: (parts) => ({
      gateway: parts.filter((p) => p.center[0] < 10).map((p) => p.i),
      label: parts.filter((p) => p.center[0] >= 10).map((p) => p.i),
    }),
    tracks: [
      {
        on: 'gateway',
        keys: heartbeat(10, 0.12),
      },
      {
        on: 'label',
        keys: slideIn(16, 1.8, 0),
      },
    ],
    props: [
      pulseRing(5.5, 12.0, 5.6, '#38BDF8', 18, 52),
      packet(5.5, 12.0, 21.5, 12.0, '#4ADE80', 26, 58, 0.85),
    ],
  },

  autodeskeagle: {
    story:
      'Autodesk EAGLE autorouter sweeps copper PCB traces across its winged mark while alignment grid guides snap components into place',
    tracks: [
      {
        on: 'all',
        keys: sway(24, 3.5, 0.4),
      },
      {
        on: 0,
        draw: [8, 34],
        fill: [26, 38],
        width: 0.55,
      },
    ],
    props: [
      guides(
        [
          [2, 8.5, 22, 8.5],
          [2, 15.5, 22, 15.5],
          [12, 3, 12, 21],
        ],
        '#60A5FA',
        12,
        58
      ),
      packet(3.0, 15.5, 21.0, 8.5, '#FBBF24', 24, 56, 0.9),
    ],
  },

  openwrt: {
    story:
      'OpenWrt embedded router core pulses at its antenna center as three Wi-Fi broadcast arcs radiate upward and the gateway ring stabilizes',
    groups: {
      dot: 4,
      arcs: [3, 1, 0],
      chassis: 2,
    },
    tracks: [
      {
        on: 'chassis',
        keys: breathe(10, 0.05),
      },
      {
        on: 'dot',
        keys: heartbeat(10, 0.25),
      },
      {
        on: 'arcs',
        stagger: 6,
        each: true,
        keys: popIn(14, 0.55),
      },
    ],
    props: [
      pulseRing(12, 14, 7.8, '#38BDF8', 28, 60),
      packet(6.5, 15.7, 17.5, 15.7, '#4ADE80', 22, 54, 0.85),
    ],
  },
};
