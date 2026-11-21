// AI & Machine Learning stories: bespoke story-driven animations for all 49 icons.
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
  heartbeat,
  nod,
  breathe,
} from '../motifs.mjs';

export default {
  pytorch: {
    story:
      'PyTorch flame ring ignites and flickers with dynamic autograd energy while its floating spark dot hops upward and fires a bright tensor burst',
    groups: {
      flame: 0,
      dot: 1,
    },
    tracks: [
      {
        on: 'flame',
        origin: '50% 75%',
        draw: [8, 28],
        width: 0.65,
        keys: {
          12: { r: -4, s: 0.95, e: 'inout' },
          30: { r: 3.5, s: 1.05, e: 'settle' },
          48: { r: -2, s: 0.99, e: 'inout' },
          62: { r: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'dot',
        keys: {
          14: { s: 0.45, y: 1.2, o: 0.2, e: 'in' },
          28: { s: 1.32, y: -1.8, o: 1, e: 'settle' },
          44: { s: 0.94, y: 0.25, o: 1, e: 'inout' },
          58: { s: 1, y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(15.3, 5.8, 2.2, '#FB923C', 24, 52, { layer: 'over', sw: 0.65 }),
      spark(16.6, 4.4, 2.0, -1.8, '#FDE047', 26, 48),
      spark(13.8, 3.8, -1.4, -1.8, '#F97316', 30, 52),
    ],
  },

  openai: {
    story:
      'OpenAI hexagonal blossom blooms and rotates smoothly as reasoning tokens radiate outward from its neural core',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        draw: [8, 28],
        width: 0.55,
        keys: {
          10: { r: -14, s: 0.92, e: 'inout' },
          34: { r: 36, s: 1.05, e: 'inout' },
          54: { r: -4, s: 0.99, e: 'settle' },
          66: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 5.2, '#34D399', 18, 52, { layer: 'under', sw: 0.65 }),
      packet(12, 12, 12, 3.0, '#6EE7B7', 24, 54, 0.9),
      packet(12, 12, 19.6, 16.4, '#34D399', 28, 58, 0.9),
      packet(12, 12, 4.4, 16.4, '#A7F3D0', 32, 62, 0.9),
    ],
  },

  huggingface: {
    story:
      'Hugging Face mascot beams with a friendly bounce while both open-source hands wave outward to welcome new transformer weights from the hub',
    groups: {
      face: 0,
      leftHand: 1,
      rightHand: 2,
    },
    tracks: [
      {
        on: 'face',
        origin: '50% 60%',
        keys: {
          12: { y: 0.5, s: 0.96, e: 'in' },
          28: { y: -0.9, s: 1.05, e: 'settle' },
          46: { y: 0.2, s: 0.99, e: 'inout' },
          60: { y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'leftHand',
        origin: '80% 75%',
        keys: {
          14: { r: -16, x: -0.8, e: 'inout' },
          28: { r: 10, x: 0.4, e: 'inout' },
          42: { r: -12, x: -0.5, e: 'inout' },
          58: { r: 0, x: 0, e: 'out' },
        },
      },
      {
        on: 'rightHand',
        origin: '20% 75%',
        keys: {
          14: { r: 16, x: 0.8, e: 'inout' },
          28: { r: -10, x: -0.4, e: 'inout' },
          42: { r: 12, x: 0.5, e: 'inout' },
          58: { r: 0, x: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#FDE047', 16, 54, { layer: 'under', sw: 0.55 }),
      spark(5.0, 5.2, -1.6, -1.6, '#FEF08A', 22, 46),
      spark(19.0, 5.2, 1.6, -1.6, '#FEF08A', 26, 50),
    ],
  },

  tensorflow: {
    story:
      'TensorFlow twin isometric 3D T and F blocks fold apart along the tensor axis, pass glowing gradient pulses across the graph, and lock back into formation',
    groups: {
      left: 0,
      right: 1,
    },
    tracks: [
      {
        on: 'left',
        draw: [8, 28],
        width: 0.6,
        keys: {
          10: { x: -1.7, y: -1.1, e: 'inout' },
          34: { x: -0.9, y: -0.6, e: 'inout' },
          50: { x: 0.25, y: 0.15, e: 'settle' },
          62: { x: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'right',
        draw: [12, 32],
        width: 0.6,
        keys: {
          10: { x: 1.7, y: 1.1, e: 'inout' },
          34: { x: 0.9, y: 0.6, e: 'inout' },
          50: { x: -0.25, y: -0.15, e: 'settle' },
          62: { x: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(6.9, 8.2, 17.1, 12.2, '#FDE047', 26, 54, 1.0),
      packet(17.1, 15.8, 6.9, 12.0, '#FB923C', 34, 62, 0.9),
    ],
  },

  scikitlearn: {
    story:
      'scikit-learn blue and orange data clusters converge across a dashed decision boundary while the predictive wordmark snaps into focus',
    groups: {
      orangeCluster: 0,
      blueCluster: 1,
      ribbon: 2,
      letters: [3, 4, 5, 6, 7, 8, 9, 10],
    },
    tracks: [
      {
        on: 'blueCluster',
        keys: slideIn(10, -2.6, 1.2),
      },
      {
        on: 'orangeCluster',
        keys: popIn(12, 0.72),
      },
      {
        on: 'ribbon',
        keys: slideIn(18, 2.2, 0),
      },
      {
        on: 'letters',
        order: 'x',
        stagger: 1.8,
        each: true,
        keys: popIn(22, 0.35),
      },
    ],
    props: [
      guides([[9.6, 4.0, 7.6, 20.4]], '#38BDF8', 14, 56),
      packet(4.1, 14.5, 14.4, 12.0, '#FDE047', 24, 54, 0.9),
    ],
  },

  langchain: {
    story:
      'LangChain interlocking prompt and tool links uncouple slightly to snap together as an agent context packet chains across the bridge',
    groups: {
      topLink: 0,
      bottomLink: 1,
    },
    tracks: [
      {
        on: 'topLink',
        draw: [8, 28],
        width: 0.6,
        keys: {
          10: { x: 1.6, y: -1.6, e: 'inout' },
          36: { x: 0.8, y: -0.8, e: 'inout' },
          52: { x: -0.2, y: 0.2, e: 'settle' },
          62: { x: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'bottomLink',
        draw: [12, 32],
        width: 0.6,
        keys: {
          10: { x: -1.6, y: 1.6, e: 'inout' },
          36: { x: -0.8, y: 0.8, e: 'inout' },
          52: { x: 0.2, y: -0.2, e: 'settle' },
          62: { x: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(8.5, 16.5, 15.5, 7.5, '#FDE047', 28, 56, 1.0),
      pulseRing(12, 12, 3.2, '#7FC8FF', 36, 62, { layer: 'over', sw: 0.65 }),
    ],
  },

  anthropic: {
    story:
      'Anthropic twin geometric A and diagonal strokes trace cleanly into alignment and radiate a calm constitutional-AI pulse of clarity',
    groups: {
      leftA: 1,
      rightSlash: 0,
    },
    tracks: [
      {
        on: 'leftA',
        draw: [8, 28],
        width: 0.6,
        keys: slideIn(10, -2.0, 0),
      },
      {
        on: 'rightSlash',
        draw: [14, 34],
        width: 0.6,
        keys: slideIn(16, 2.0, 0),
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#D97757', 24, 58, { layer: 'under', sw: 0.6 }),
      sheen('<rect x="1.5" y="3.5" width="21" height="17" rx="1"/>', 38, 64, 0.24),
    ],
  },

  googlegemini: {
    story:
      'Gemini four-point multimodal star flares outward with a crisp celestial glint while companion modality sparks flash around its core',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        keys: {
          10: { s: 0.72, r: -18, e: 'in' },
          26: { s: 1.12, r: 12, e: 'settle' },
          44: { s: 0.96, r: -4, e: 'inout' },
          62: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 8.6, '#C084FC', 18, 52, { layer: 'under', sw: 0.6 }),
      spark(18.5, 5.5, 1.6, -1.6, '#60A5FA', 22, 46),
      spark(5.5, 18.5, -1.6, 1.6, '#F472B6', 26, 50),
    ],
  },

  ollama: {
    story:
      'Ollama friendly local llama perks its head with an attentive nod and double-blink while offline inference tokens rise silently from its ears',
    groups: {
      body: 4,
      eyes: [0, 1],
      snout: [2, 3],
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 80%',
        keys: nod(14, 5.5),
      },
      {
        on: 'eyes',
        each: true,
        keys: {
          26: { sy: 1, e: 'in' },
          30: { sy: 0.12, e: 'out' },
          35: { sy: 1, e: 'linear' },
          46: { sy: 1, e: 'in' },
          50: { sy: 0.12, e: 'out' },
          55: { sy: 1, e: 'out' },
        },
      },
      {
        on: 'snout',
        keys: {
          18: { y: -0.35, e: 'inout' },
          34: { y: 0.2, e: 'settle' },
          50: { y: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#94A3B8', 18, 54, { layer: 'under', sw: 0.55 }),
      packet(6.5, 4.5, 6.5, 1.6, '#38BDF8', 22, 48, 0.75),
      packet(17.5, 4.5, 17.5, 1.6, '#34D399', 28, 54, 0.75),
    ],
  },

  opencv: {
    story:
      'OpenCV three vision-channel rings lock onto a target with a rotating optical radar sweep and bounding-box crosshair flash',
    groups: {
      rings: [0, 1, 2],
    },
    tracks: [
      {
        on: 'rings',
        stagger: 5,
        each: true,
        keys: {
          10: { s: 0.76, r: -24, e: 'inout' },
          28: { s: 1.08, r: 8, e: 'settle' },
          44: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      radar(12, 13.5, 9.6, '#818CF8', 12, 64, 140),
      {
        layer: 'over',
        svg: '<g stroke="#34D399" stroke-width="0.65" fill="none" stroke-linecap="round"><path d="M5.2 5.2 h2.4 M5.2 5.2 v2.4"/><path d="M18.8 5.2 h-2.4 M18.8 5.2 v2.4"/><path d="M5.2 19.6 h2.4 M5.2 19.6 v-2.4"/><path d="M18.8 19.6 h-2.4 M18.8 19.6 v-2.4"/></g>',
        keys: {
          24: { s: 1.18, o: 0, e: 'out' },
          34: { s: 1.0, o: 0.95, e: 'settle' },
          50: { s: 1.0, o: 0.85, e: 'out' },
          60: { s: 0.92, o: 0, e: 'out' },
        },
      },
    ],
  },

  numpy: {
    story:
      'NumPy isometric N-dimensional array cube slices its matrix facets apart along tensor axes and snaps them back into contiguous memory',
    groups: {
      topFace: [0, 1, 2, 3],
      rightFace: [4, 5, 6, 7],
      leftN: 8,
    },
    tracks: [
      {
        on: 'topFace',
        stagger: 2.5,
        each: true,
        keys: {
          10: { y: -2.2, o: 0.35, e: 'inout' },
          26: { y: 0.25, o: 1, e: 'settle' },
          36: { y: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'rightFace',
        stagger: 2.5,
        each: true,
        keys: {
          18: { x: 2.0, o: 0.35, e: 'inout' },
          34: { x: -0.2, o: 1, e: 'settle' },
          44: { x: 0, o: 1, e: 'out' },
        },
      },
      {
        on: 'leftN',
        draw: [12, 34],
        width: 0.55,
      },
    ],
    props: [
      guides(
        [
          [12, 1.5, 12, 22.5],
          [2.5, 12, 21.5, 12],
        ],
        '#38BDF8',
        12,
        56
      ),
    ],
  },

  pandas: {
    story:
      'Pandas DataFrame columns cascade vertically into aligned tabular series while index cells highlight with a fast vectorized sort',
    groups: {
      rails: [4, 0],
      cells: [7, 5, 6, 2, 1, 3],
    },
    tracks: [
      {
        on: 'rails',
        stagger: 4,
        each: true,
        keys: riseIn(10, 2.8),
      },
      {
        on: 'cells',
        order: 'x',
        stagger: 3.2,
        each: true,
        keys: {
          14: { sy: 0.2, y: -1.8, o: 0.2, e: 'in' },
          28: { sy: 1.08, y: 0.2, o: 1, e: 'settle' },
          38: { sy: 1, y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [packet(6.3, 19.5, 17.7, 4.5, '#F472B6', 32, 62, 0.9)],
  },

  jupyter: {
    story:
      'Jupyter three kernel moons orbit around the twin planetary notebook rings as interactive code cells execute in sequence',
    groups: {
      arcs: [1, 2],
      moons: [0, 3, 4],
    },
    tracks: [
      {
        on: 'arcs',
        stagger: 4,
        draw: [8, 28],
        width: 0.6,
        keys: breathe(12, 0.05),
      },
      {
        on: 'moons',
        origin: [12, 12],
        stagger: 4,
        keys: {
          10: { r: 0, s: 0.72, e: 'inout' },
          36: { r: 28, s: 1.18, e: 'inout' },
          56: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 8.8, '#FB923C', 20, 56, { dash: '4 7', sw: 0.55 })],
  },

  keras: {
    story:
      'Keras traces its crisp neural-layer badge and fires multi-backend tensor signals cleanly across the K architecture',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        width: 0.6,
        keys: {
          10: { s: 0.93, e: 'out' },
          28: { s: 1.04, e: 'settle' },
          46: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="1.75" y="1.75" width="20.5" height="20.5" rx="1.5"/>', 38, 64, 0.25),
      packet(6.5, 6.5, 17.5, 6.5, '#FDE047', 22, 46, 0.85),
      packet(6.5, 17.5, 17.5, 17.5, '#F87171', 28, 52, 0.85),
    ],
  },

  nvidia: {
    story:
      'NVIDIA iconic green eye spiral focuses with parallel CUDA intensity as tensor-core energy pulses radiate from the pupil',
    groups: {
      pupil: 0,
      outerRight: 1,
      leftArcs: [2, 3],
    },
    tracks: [
      {
        on: 'pupil',
        origin: [12.4, 11],
        keys: {
          12: { s: 0.72, r: -28, e: 'inout' },
          34: { s: 1.12, r: 16, e: 'settle' },
          56: { s: 1, r: 0, e: 'out' },
        },
      },
      {
        on: 'outerRight',
        draw: [10, 32],
        width: 0.55,
      },
      {
        on: 'leftArcs',
        stagger: 5,
        each: true,
        keys: slideIn(14, -2.0, 0),
      },
    ],
    props: [
      pulseRing(12.4, 11, 6.5, '#A3E635', 22, 56, { layer: 'under', sw: 0.6 }),
      boltFlash(17.8, 3.6, '#BEF264', 26, 52),
    ],
  },

  polars: {
    story:
      'Polars 47 columnar polar-bear barcode slices sweep left-to-right in a blazing Rust-powered vectorized scan wave',
    tracks: [
      {
        on: (parts) => parts.map((p) => p.i),
        order: 'x',
        stagger: 0.45,
        each: true,
        keys: {
          10: { sy: 0.35, o: 0.35, e: 'in' },
          24: { sy: 1.15, o: 1, e: 'settle' },
          36: { sy: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(2.5, 12, 21.5, 12, '#38BDF8', 12, 56, 0.9),
      boltFlash(18.5, 3.2, '#7DD3FC', 34, 60),
    ],
  },

  apachespark: {
    story:
      'Apache Spark asymmetric star ignites with a distributed shuffle spin and throws hot amber cluster sparks from its tips',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        draw: [8, 28],
        width: 0.6,
        keys: {
          12: { r: -16, s: 0.86, e: 'in' },
          30: { r: 22, s: 1.1, e: 'settle' },
          48: { r: -6, s: 0.98, e: 'inout' },
          62: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(18.2, 4.8, 2.0, -1.8, '#FDE047', 24, 46),
      spark(5.4, 18.4, -1.8, 1.8, '#FB923C', 30, 52),
      pulseRing(12, 12, 8.6, '#FDBA74', 22, 54, { layer: 'under', sw: 0.6 }),
    ],
  },

  streamlit: {
    story:
      'Streamlit three crown facets unfurl left-to-right like an instant reactive Python dashboard rerunning live telemetry on save',
    groups: {
      leftBase: 2,
      midPeak: 1,
      rightPeak: 0,
    },
    tracks: [
      { on: 'leftBase', keys: riseIn(10, 2.6) },
      { on: 'midPeak', keys: riseIn(16, 3.2) },
      { on: 'rightPeak', keys: riseIn(22, 2.6) },
    ],
    props: [
      telemetryBar(6.5, 18.2, 2.2, 2.8, '#FCA5A5', 26, 56),
      telemetryBar(10.9, 17.4, 2.2, 3.6, '#FF4B4B', 30, 60),
      telemetryBar(15.3, 18.0, 2.2, 3.0, '#FDE047', 34, 64),
    ],
  },

  gradio: {
    story:
      'Gradio interlocking input-output diamonds trace their interactive demo loop as a live inference payload flows across the interface',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        width: 0.6,
        keys: {
          12: { sx: 0.9, e: 'inout' },
          34: { sx: 1.06, e: 'settle' },
          56: { sx: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(4.2, 12, 19.8, 12, '#FDE047', 22, 50, 1.0),
      packet(19.8, 12, 4.2, 12, '#FB923C', 34, 62, 0.9),
    ],
  },

  mlflow: {
    story:
      'MLflow dual lifecycle arcs circulate around the central hub as an experiment run logs metrics and promotes a model to production',
    groups: {
      topArc: 0,
      bottomArc: 1,
    },
    tracks: [
      {
        on: 'topArc',
        origin: [12, 12],
        draw: [8, 28],
        width: 0.6,
        keys: {
          10: { r: -20, e: 'inout' },
          36: { r: 18, e: 'inout' },
          58: { r: 0, e: 'out' },
        },
      },
      {
        on: 'bottomArc',
        origin: [12, 12],
        draw: [12, 32],
        width: 0.6,
        keys: {
          14: { r: -20, e: 'inout' },
          40: { r: 18, e: 'inout' },
          62: { r: 0, e: 'out' },
        },
      },
    ],
    props: [checkFlash(16.2, 5.2, '#38BDF8', 40, 66)],
  },

  weightsandbiases: {
    story:
      'Weights & Biases twelve hyperparameter sweep nodes pulse in a live evaluation cascade while metric rings confirm the best run',
    tracks: [
      {
        on: (parts) => parts.map((p) => p.i),
        order: 'y',
        stagger: 2.2,
        each: true,
        keys: {
          10: { s: 0.45, o: 0.3, e: 'in' },
          24: { s: 1.24, o: 1, e: 'settle' },
          36: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(3.9, 8.4, 3.2, '#FBBF24', 18, 48, { layer: 'under', sw: 0.6 }),
      pulseRing(12, 15.6, 3.6, '#FEF08A', 28, 58, { layer: 'under', sw: 0.6 }),
    ],
  },

  ray: {
    story:
      'Ray dispatches parallel task beams outward from its unified compute core to scale distributed Python actors across the cluster',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        width: 0.55,
        keys: heartbeat(14, 0.08),
      },
    ],
    props: [
      packet(12, 12, 20.5, 5.5, '#7DD3FC', 22, 50, 0.9),
      packet(12, 12, 20.5, 18.5, '#38BDF8', 26, 54, 0.9),
      packet(12, 12, 3.5, 5.5, '#60A5FA', 30, 58, 0.9),
    ],
  },

  onnx: {
    story:
      'ONNX outlines its cross-framework neural exchange graph while a compiled model packet bridges cleanly between runtimes',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        width: 0.55,
        keys: breathe(14, 0.06),
      },
    ],
    props: [
      packet(4.5, 12, 19.5, 12, '#93C5FD', 26, 54, 0.95),
      pulseRing(12, 12, 9.4, '#3B82F6', 22, 58, { layer: 'under', sw: 0.55 }),
    ],
  },

  openvino: {
    story:
      'OpenVINO edge-inference wordmark snaps through a quantized optimization pass between its twin optical node endpoints',
    groups: {
      leftNode: [8, 9],
      rightNode: [10, 11],
      letters: [2, 3, 4, 5, 6, 7],
    },
    tracks: [
      { on: 'leftNode', keys: popIn(10, 0.5) },
      {
        on: 'letters',
        order: 'x',
        stagger: 2.5,
        each: true,
        keys: dropIn(14, 2.0),
      },
      { on: 'rightNode', keys: popIn(26, 0.5) },
    ],
    props: [packet(2.3, 11.5, 21.3, 11.5, '#A78BFA', 34, 64, 0.9)],
  },

  scipy: {
    story:
      'SciPy scientific waveform emblem traces its harmonic curve and oscillates gently through an integral convergence cycle',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        width: 0.55,
        keys: sway(12, 5.5, 0.5),
      },
    ],
    props: [
      waveLine(19.5, '#93C5FD', 14, 62),
      pulseRing(12, 12, 9.8, '#BFDBFE', 20, 56, { layer: 'under', sw: 0.55 }),
    ],
  },

  plotly: {
    story:
      'Plotly interactive chart bars grow dynamically from the baseline while teal scatter points pop onto the coordinate grid',
    groups: {
      card: 0,
      dots: [1, 2, 3, 4, 5, 6],
      bars: [7, 9, 8, 10],
    },
    tracks: [
      {
        on: 'card',
        keys: {
          10: { s: 0.95, e: 'out' },
          26: { s: 1.02, e: 'settle' },
          44: { s: 1, e: 'out' },
        },
      },
      {
        on: 'bars',
        order: 'x',
        stagger: 4,
        each: true,
        origin: '50% 100%',
        keys: {
          12: { sy: 0.15, e: 'in' },
          28: { sy: 1.08, e: 'settle' },
          40: { sy: 1, e: 'out' },
        },
      },
      {
        on: 'dots',
        order: 'x',
        stagger: 2.5,
        each: true,
        keys: popIn(22, 0.25),
      },
    ],
    props: [packet(6.4, 10.1, 17.5, 6.6, '#7FCFBD', 40, 66, 0.85)],
  },

  anaconda: {
    story:
      'Anaconda coiled serpent ring breathes as its sixteen polygonal environment scales ripple into place along the arc',
    groups: {
      coil: 0,
      scales: (parts) =>
        parts
          .slice(1)
          .filter((p) => p.box)
          .map((p) => p.i),
    },
    tracks: [
      {
        on: 'coil',
        draw: [8, 30],
        width: 0.55,
        keys: breathe(12, 0.05),
      },
      {
        on: 'scales',
        order: 'y',
        stagger: 1.5,
        each: true,
        keys: {
          12: { s: 0.4, o: 0.2, e: 'in' },
          26: { s: 1.15, o: 1, e: 'settle' },
          36: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.0, '#4ADE80', 22, 58, { layer: 'under', sw: 0.55 })],
  },

  spacy: {
    story:
      'spaCy tokenizes each character left-to-right with crisp NLP dependency arcs hopping across the wordmark',
    tracks: [
      {
        on: [0, 1, 2, 3, 4],
        order: 'x',
        stagger: 4.5,
        each: true,
        keys: {
          10: { y: -2.2, s: 0.8, o: 0.3, e: 'in' },
          24: { y: 0.3, s: 1.08, o: 1, e: 'settle' },
          34: { y: 0, s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      {
        layer: 'over',
        svg: '<path d="M4.5 7.5 Q12 2.5 19.5 7.5" fill="none" stroke="#38BDF8" stroke-width="0.7" stroke-linecap="round" stroke-dasharray="1.8 1.4"/>',
        keys: {
          26: { s: 0.85, o: 0, e: 'out' },
          36: { s: 1.02, o: 0.9, e: 'settle' },
          54: { s: 1.0, o: 0.8, e: 'out' },
          64: { s: 0.95, o: 0, e: 'out' },
        },
      },
      packet(2.3, 12, 21.6, 12, '#7DD3FC', 26, 58, 0.8),
    ],
  },

  kaggle: {
    story:
      'Kaggle iconic cyan K traces upward like a leaderboard climb and flashes a gold-medal spark at its summit',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        width: 0.65,
        keys: riseIn(10, 2.2),
      },
    ],
    props: [
      spark(16.8, 4.6, 1.8, -1.8, '#FDE047', 34, 58),
      checkFlash(15.2, 6.4, '#38BDF8', 38, 66),
    ],
  },

  dvc: {
    story:
      'DVC three owl-badge shards assemble from left, center, and right to commit a versioned dataset snapshot',
    groups: {
      left: 0,
      mid: 1,
      right: 2,
    },
    tracks: [
      { on: 'left', keys: slideIn(10, -2.6, -1.2) },
      { on: 'mid', keys: riseIn(16, 2.8) },
      { on: 'right', keys: slideIn(22, 2.6, -1.2) },
    ],
    props: [checkFlash(10.2, 5.2, '#67E8F9', 42, 66)],
  },

  apacheairflow: {
    story:
      'Apache Airflow four-blade DAG pinwheel spins up smoothly around its central scheduler hub as task ticks orbit the rim',
    groups: {
      blades: [0, 1, 2, 3, 4, 5, 6, 7],
      hub: 8,
    },
    tracks: [
      {
        on: 'blades',
        origin: [12, 12],
        keys: {
          10: { r: -18, e: 'inout' },
          38: { r: 90, e: 'inout' },
          58: { r: -6, e: 'settle' },
          68: { r: 0, e: 'out' },
        },
      },
      {
        on: 'hub',
        keys: heartbeat(14, 0.2),
      },
    ],
    props: [radar(12, 12, 10.4, '#38BDF8', 12, 64, 150)],
  },

  snowflake: {
    story:
      'Snowflake six crystalline cloud-warehouse arms crystallize radially from its central diamond with an icy shimmer',
    groups: {
      core: 6,
      arms: [2, 3, 4, 5, 7, 8],
    },
    tracks: [
      { on: 'core', keys: popIn(10, 0.4) },
      {
        on: 'arms',
        order: 'a',
        stagger: 3.2,
        each: true,
        keys: {
          12: { s: 0.45, o: 0.25, e: 'in' },
          26: { s: 1.1, o: 1, e: 'settle' },
          38: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(11.5, 12, 9.6, '#7DD3FC', 22, 58, { layer: 'under', sw: 0.55 }),
      spark(4.2, 4.2, -1.4, -1.4, '#BAE6FD', 34, 58),
    ],
  },

  databricks: {
    story:
      'Databricks stacked lakehouse layers trace out cleanly and spring upward as Delta records stream into the unified platform',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        width: 0.6,
        keys: {
          10: { y: 1.8, s: 0.92, e: 'inout' },
          32: { y: -0.6, s: 1.05, e: 'settle' },
          54: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(4.5, 15.5, 12.0, 5.5, '#FDE047', 26, 54, 0.95),
      packet(19.5, 15.5, 12.0, 5.5, '#FCA5A5', 32, 60, 0.85),
    ],
  },

  apacheflink: {
    story:
      'Apache Flink agile squirrel dashes forward with an energetic tail flick while stateful stream events zip cleanly underneath',
    groups: {
      head: [1, 2, 4, 11],
      tail: [0, 3, 7],
      body: [5, 6, 8, 9, 10],
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 70%',
        keys: {
          12: { x: -1.4, r: -4, e: 'inout' },
          34: { x: 1.2, r: 3, e: 'settle' },
          56: { x: 0, r: 0, e: 'out' },
        },
      },
      {
        on: 'tail',
        origin: '70% 75%',
        keys: sway(10, 10, 0.4),
      },
      {
        on: 'head',
        origin: '40% 75%',
        keys: nod(18, 6),
      },
    ],
    props: [
      waveLine(20.6, '#FB7185', 14, 62),
      packet(3.0, 19.8, 21.0, 19.8, '#FDE047', 22, 54, 0.9),
    ],
  },

  perplexity: {
    story:
      'Perplexity faceted knowledge prism expands and traces its citation facets while real-time web-grounded answer rays pulse outward',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        width: 0.55,
        keys: {
          12: { s: 0.86, r: -8, e: 'inout' },
          34: { s: 1.07, r: 6, e: 'settle' },
          58: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#22D3EE', 18, 54, { layer: 'under', sw: 0.6 }),
      spark(18.5, 5.0, 1.8, -1.6, '#67E8F9', 26, 50),
      spark(5.5, 19.0, -1.8, 1.6, '#67E8F9', 30, 54),
    ],
  },

  mistralai: {
    story:
      'Mistral AI pixel-crafted M snaps forward with a crisp aerodynamic wind-gust tilt and fires fast open-weight token streaks',
    tracks: [
      {
        on: 0,
        draw: [8, 28],
        width: 0.6,
        keys: {
          10: { x: -2.0, s: 0.92, e: 'in' },
          28: { x: 0.6, s: 1.05, e: 'settle' },
          48: { x: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(3.0, 4.2, 4.0, 0, '#FDE047', 20, 44),
      spark(16.0, 4.2, 4.0, 0, '#FB923C', 24, 48),
      spark(9.5, 19.8, 4.5, 0, '#F97316', 28, 52),
    ],
  },

  replicate: {
    story:
      'Replicate three nested L-brackets cascade outward in sequence like spinning up replicated GPU model containers on demand',
    groups: {
      outer: 2,
      mid: 1,
      inner: 0,
    },
    tracks: [
      { on: 'outer', keys: slideIn(10, -2.0, -2.0) },
      { on: 'mid', keys: slideIn(18, -1.6, -1.6) },
      { on: 'inner', keys: slideIn(26, -1.2, -1.2) },
    ],
    props: [pulseRing(16.9, 16.4, 4.5, '#94A3B8', 32, 62, { layer: 'under', sw: 0.6 })],
  },

  meta: {
    story:
      'Meta continuous infinity ribbon traces its Möbius figure-eight as open-weight Llama attention tokens traverse both loops',
    tracks: [
      {
        on: 0,
        draw: [8, 34],
        width: 0.6,
        keys: breathe(12, 0.06),
      },
    ],
    props: [
      packet(6.2, 12, 17.8, 12, '#60A5FA', 24, 52, 1.0),
      packet(17.8, 12, 6.2, 12, '#93C5FD', 34, 62, 0.9),
    ],
  },

  googledataflow: {
    story:
      'Google Dataflow polygonal pipeline facets assemble symmetrically while four circular transform nodes pulse with streaming batch packets',
    groups: {
      facets: [0, 1, 2, 3, 4, 5, 6, 7],
      nodes: [8, 9, 10, 11],
    },
    tracks: [
      {
        on: 'facets',
        order: 'y',
        stagger: 2.2,
        each: true,
        keys: {
          10: { s: 0.72, o: 0.35, e: 'in' },
          24: { s: 1.06, o: 1, e: 'settle' },
          36: { s: 1, o: 1, e: 'out' },
        },
      },
      {
        on: 'nodes',
        order: 'x',
        stagger: 3.5,
        each: true,
        keys: popIn(24, 0.35),
      },
    ],
    props: [packet(5.3, 11.9, 18.7, 12.0, '#FDE047', 34, 64, 0.9)],
  },

  bentoml: {
    story:
      'BentoML packaged model mascot hops with a crisp serving bounce and blinks its twin eyes as an inference request clears',
    groups: {
      box: 2,
      eyes: [0, 1],
    },
    tracks: [
      {
        on: 'box',
        origin: '50% 80%',
        keys: {
          12: { y: 0.6, sy: 0.94, e: 'in' },
          26: { y: -1.4, sy: 1.05, e: 'out' },
          40: { y: 0.25, sy: 0.97, e: 'settle' },
          54: { y: 0, sy: 1, e: 'out' },
        },
      },
      {
        on: 'eyes',
        each: true,
        keys: {
          34: { sy: 1, e: 'in' },
          40: { sy: 0.12, e: 'out' },
          46: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [checkFlash(16.6, 4.4, '#86EFAC', 38, 66)],
  },

  apachearrow: {
    story:
      'Apache Arrow three zero-copy columnar chevrons surge forward in rapid left-to-right succession with minimal-overhead momentum',
    tracks: [
      {
        on: [0, 1, 2],
        order: 'x',
        stagger: 5,
        each: true,
        keys: {
          10: { x: -2.4, o: 0.3, e: 'in' },
          26: { x: 1.0, o: 1, e: 'settle' },
          40: { x: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [packet(3.0, 12, 21.5, 12, '#38BDF8', 22, 54, 0.95)],
  },

  apachehadoop: {
    story:
      'Apache Hadoop sturdy elephant stomps with distributed HDFS weight while sharded data details settle cleanly across its frame',
    groups: {
      body: 1,
      details: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 80%',
        keys: {
          12: { r: -4, y: -0.7, e: 'inout' },
          28: { r: 3, y: 0.4, e: 'settle' },
          44: { r: -1.5, y: -0.2, e: 'inout' },
          60: { r: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'details',
        stagger: 1.6,
        each: true,
        keys: {
          14: { s: 0.7, e: 'in' },
          28: { s: 1.12, e: 'settle' },
          40: { s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 14, 9.6, '#FDE047', 22, 56, { layer: 'under', sw: 0.55 })],
  },

  apachehive: {
    story:
      'Apache Hive yellow data-warehouse bee hums with a crisp wing-flutter vibration as partitioned SQL queries buzz into the hive',
    groups: {
      body: 0,
      stripes: [2, 3, 4, 5, 7, 8, 9],
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 60%',
        keys: sway(10, 5, 0.7),
      },
      {
        on: 'stripes',
        order: 'y',
        stagger: 2.2,
        each: true,
        keys: {
          14: { x: 0.9, s: 0.85, e: 'inout' },
          28: { x: -0.4, s: 1.08, e: 'settle' },
          40: { x: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(18.5, 6.0, 12.0, 12.0, '#FEF08A', 20, 48, 0.85),
      pulseRing(12, 12, 9.5, '#FACC15', 28, 60, { layer: 'under', sw: 0.55 }),
    ],
  },

  trino: {
    story:
      'Trino Commander Bun Bun mascot perks up for a federated lakehouse sprint while high-speed magenta query sparks flash past',
    groups: {
      rabbit: 2,
      dots: [0, 1],
    },
    tracks: [
      {
        on: 'rabbit',
        origin: '50% 85%',
        keys: {
          10: { y: 0.5, sy: 0.95, e: 'in' },
          24: { y: -1.6, r: -4, sy: 1.05, e: 'out' },
          40: { y: 0.2, r: 2, sy: 0.98, e: 'settle' },
          56: { y: 0, r: 0, sy: 1, e: 'out' },
        },
      },
      {
        on: 'dots',
        stagger: 4,
        each: true,
        keys: popIn(20, 0.4),
      },
    ],
    props: [
      boltFlash(18.2, 4.2, '#F472B6', 22, 50),
      pulseRing(12, 12, 9.6, '#EC4899', 26, 58, { layer: 'under', sw: 0.55 }),
    ],
  },

  apachedoris: {
    story:
      'Apache Doris three geometric MPP shards interlock rapidly into a faceted D as real-time analytical bars surge upward',
    groups: {
      top: 0,
      left: 1,
      main: 2,
    },
    tracks: [
      { on: 'top', keys: dropIn(10, 2.4) },
      { on: 'left', keys: slideIn(15, -2.4, 0) },
      { on: 'main', keys: slideIn(20, 2.2, 1.4) },
    ],
    props: [
      telemetryBar(16.6, 4.2, 1.8, 3.6, '#818CF8', 30, 58),
      telemetryBar(19.2, 3.2, 1.8, 4.6, '#38BDF8', 34, 62),
    ],
  },

  airbyte: {
    story:
      'Airbyte ELT connector silhouette pulses as its inner sync swirl rotates to replicate fresh source records to the warehouse',
    groups: {
      outer: 0,
      inner: 1,
    },
    tracks: [
      {
        on: 'outer',
        draw: [8, 28],
        width: 0.55,
        keys: breathe(12, 0.05),
      },
      {
        on: 'inner',
        origin: [12.7, 14.7],
        keys: {
          14: { r: -24, s: 0.88, e: 'inout' },
          38: { r: 24, s: 1.08, e: 'settle' },
          60: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(4.0, 12, 20.0, 12, '#A5B4FC', 22, 54, 0.95),
      checkFlash(16.2, 5.2, '#86EFAC', 42, 66),
    ],
  },

  prefect: {
    story:
      'Prefect resilient isometric P ribbon traces its workflow path and confirms a clean, fault-tolerant flow run with a check flash',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        width: 0.6,
        keys: {
          10: { y: -1.4, e: 'inout' },
          32: { y: 0.35, e: 'settle' },
          52: { y: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(7.5, 4.5, 16.5, 11.0, '#38BDF8', 24, 50, 0.9),
      checkFlash(15.8, 16.5, '#4ADE80', 40, 66),
    ],
  },

  metabase: {
    story:
      'Metabase 22 BI dot-matrix nodes illuminate in a crisp left-to-right analytical wave like live dashboard tiles refreshing',
    tracks: [
      {
        on: (parts) => parts.map((p) => p.i),
        order: 'x',
        stagger: 1.0,
        each: true,
        keys: {
          10: { s: 0.35, o: 0.25, e: 'in' },
          24: { s: 1.28, o: 1, e: 'settle' },
          36: { s: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#7DD3FC', 24, 60, { layer: 'under', sw: 0.55 })],
  },

  apachesuperset: {
    story:
      'Apache Superset fluid infinity-wave ribbon traces its exploratory analytics curve while live chart bars and packets glide across its loops',
    tracks: [
      {
        on: 0,
        draw: [8, 34],
        width: 0.6,
        keys: sway(12, 4, 0.5),
      },
    ],
    props: [
      packet(4.2, 12, 19.8, 12, '#67E8F9', 24, 52, 0.95),
      telemetryBar(9.2, 4.0, 1.8, 3.2, '#22D3EE', 30, 58),
      telemetryBar(12.2, 3.2, 1.8, 4.0, '#38BDF8', 34, 62),
    ],
  },

  claude: {
    story:
      'Claude warm terracotta sunburst blooms and rotates smoothly like a reasoning star while sending out an amber thought pulse and twin sparks',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          10: { r: -18, s: 0.92, e: 'inout' },
          36: { r: 24, s: 1.06, e: 'inout' },
          54: { r: -4, s: 1.01, e: 'settle' },
          66: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#FDBA74', 20, 58, { layer: 'under', sw: 0.6 }),
      spark(18.6, 5.4, 1.6, -1.6, '#FDE68A', 28, 50),
      spark(5.4, 18.6, -1.6, 1.6, '#FDBA74', 34, 56),
    ],
  },

  deepseek: {
    story:
      'DeepSeek blue whale glides gracefully over an ocean swell while deep-reasoning sonar rings ripple outward from its silhouette',
    tracks: [
      {
        on: 'all',
        origin: '50% 60%',
        keys: sway(10, 5.5, 0.9),
      },
    ],
    props: [
      waveLine(21.0, '#60A5FA', 10, 64),
      pulseRing(12, 11.5, 9.2, '#93C5FD', 22, 58, { layer: 'under', sw: 0.55 }),
    ],
  },

  modelcontextprotocol: {
    story:
      'Model Context Protocol host arch and tool bridge trace and interlock cleanly as bidirectional JSON-RPC packets cross between assistant and tools',
    groups: {
      outer: 0,
      bridge: 1,
    },
    tracks: [
      {
        on: 'outer',
        draw: [8, 32],
        fill: [24, 34],
        width: 0.6,
      },
      {
        on: 'bridge',
        draw: [14, 38],
        fill: [30, 40],
        width: 0.6,
        keys: {
          14: { s: 0.9, e: 'inout' },
          40: { s: 1.05, e: 'settle' },
          56: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(5.5, 16.5, 18.5, 7.5, '#38BDF8', 24, 52, 0.95),
      packet(18.5, 7.5, 5.5, 16.5, '#FDE047', 36, 64, 0.95),
    ],
  },

  vllm: {
    story:
      'vLLM twin PagedAttention wings sweep in from opposite flanks to form the V-mark as high-throughput token streams rocket upward between them',
    groups: {
      rightWing: 0,
      leftWing: 1,
    },
    tracks: [
      {
        on: 'leftWing',
        keys: slideIn(10, -2.6, -1.2),
      },
      {
        on: 'rightWing',
        keys: slideIn(14, 2.6, -1.2),
      },
    ],
    props: [
      packet(11.6, 19.5, 11.6, 4.2, '#7DD3FC', 22, 48, 0.95),
      packet(13.2, 18.5, 13.2, 3.8, '#FDE047', 30, 56, 0.9),
      boltFlash(19.0, 3.8, '#FDE047', 34, 60),
    ],
  },

  n8n: {
    story:
      'n8n workflow graph traces its automation edges as trigger packets flow from the left node through the hub and branch out to parallel actions',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        fill: [24, 34],
        width: 0.6,
      },
    ],
    props: [
      packet(3.2, 12.0, 12.2, 12.0, '#FDA4AF', 22, 42, 1.0),
      packet(12.2, 12.0, 20.4, 8.6, '#FDE047', 38, 60, 0.95),
      packet(12.2, 12.0, 20.4, 15.4, '#4ADE80', 42, 64, 0.95),
    ],
  },

  dify: {
    story:
      'Dify four modular wordmark blocks cascade left-to-right into an agentic pipeline while the i-dot hops crisply onto its stem',
    groups: {
      d: 1,
      mid: 2,
      dot: 3,
      y: 0,
    },
    tracks: [
      { on: 'd', keys: riseIn(10, 2.4) },
      { on: 'mid', keys: riseIn(16, 2.4) },
      { on: 'y', keys: riseIn(22, 2.4) },
      { on: 'dot', keys: dropIn(26, 3.0) },
    ],
    props: [
      packet(4.5, 16.5, 20.0, 16.5, '#93C5FD', 32, 58, 0.85),
      pulseRing(12, 12, 10.2, '#818CF8', 38, 64, { layer: 'under', sw: 0.5 }),
    ],
  },

  modal: {
    story:
      'Modal serverless GPU mark cold-starts in milliseconds with a crisp scale-up pop, neon-lime compute ring, and twin accelerator sparks',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: popIn(10, 0.62),
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#86EFAC', 18, 52, { layer: 'under', sw: 0.65 }),
      spark(19.2, 5.2, 1.6, -1.6, '#BEF264', 26, 48),
      spark(4.8, 18.8, -1.6, 1.6, '#4ADE80', 32, 54),
    ],
  },

  openrouter: {
    story:
      'OpenRouter traces its unified API gateway as incoming prompts split from the left ingress and fan out simultaneously to multiple LLM endpoints',
    tracks: [
      {
        on: 0,
        draw: [8, 32],
        fill: [24, 34],
        width: 0.6,
      },
    ],
    props: [
      packet(3.0, 12.0, 11.2, 12.0, '#38BDF8', 22, 40, 0.95),
      packet(11.2, 12.0, 20.2, 6.2, '#A78BFA', 36, 58, 0.95),
      packet(11.2, 12.0, 20.2, 17.8, '#4ADE80', 40, 62, 0.95),
    ],
  },

  elevenlabs: {
    story:
      'ElevenLabs twin voice bars oscillate out of phase like stereo audio equalizer levels while warm acoustic soundwave rings radiate outward',
    groups: {
      left: 0,
      right: 1,
    },
    tracks: [
      {
        on: 'left',
        origin: '50% 50%',
        keys: {
          10: { sy: 0.62, e: 'inout' },
          24: { sy: 1.08, e: 'inout' },
          38: { sy: 0.74, e: 'inout' },
          52: { sy: 1.04, e: 'settle' },
          64: { sy: 1, e: 'out' },
        },
      },
      {
        on: 'right',
        origin: '50% 50%',
        keys: {
          14: { sy: 1.06, e: 'inout' },
          28: { sy: 0.64, e: 'inout' },
          42: { sy: 1.08, e: 'inout' },
          56: { sy: 0.96, e: 'settle' },
          66: { sy: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.4, '#CBD5E1', 20, 54, { layer: 'under', sw: 0.55 }),
      pulseRing(12, 12, 10.4, '#38BDF8', 32, 64, { layer: 'under', sw: 0.45 }),
    ],
  },

  suno: {
    story:
      'Suno split-sun vinyl emblem spins smoothly with harmonic groove momentum while golden and violet audio ripples radiate outward',
    tracks: [
      {
        on: 'all',
        origin: [12, 12],
        keys: {
          10: { r: -14, s: 0.94, e: 'inout' },
          36: { r: 22, s: 1.04, e: 'inout' },
          56: { r: -3, s: 1.01, e: 'settle' },
          66: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.5, '#FDE047', 18, 52, { layer: 'under', sw: 0.6 }),
      pulseRing(12, 12, 10.4, '#C084FC', 30, 62, { layer: 'under', sw: 0.5 }),
    ],
  },
};
