// Databases category stories: 47 bespoke, domain-grounded SVG animations.
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
  sqlite: {
    story:
      'SQLite’s quill feather dips and writes a crisp local transactional SQL stroke onto its self-contained single-file page, sealing with a commit check',
    groups: {
      feather: 0,
      page: 1,
    },
    tracks: [
      {
        on: 'page',
        draw: [8, 28],
        fill: [22, 32],
        width: 0.55,
      },
      {
        on: 'feather',
        origin: [14.5, 22],
        keys: {
          14: { r: -10, x: -0.6, y: -0.5, e: 'inout' },
          26: { r: 6, x: 0.4, y: 0.2, e: 'inout' },
          38: { r: -5, x: -0.3, y: -0.2, e: 'inout' },
          50: { r: 2, x: 0.1, y: 0, e: 'settle' },
          60: { r: 0, x: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      {
        layer: 'over',
        origin: '0% 50%',
        svg: '<path d="M5.2 15.5 Q8.7 14.7 12.2 15.4" fill="none" stroke="#BAE6FD" stroke-width="0.7" stroke-linecap="round"/>',
        keys: {
          20: { sx: 0.1, o: 0, e: 'out' },
          34: { sx: 1, o: 0.9, e: 'out' },
          52: { sx: 1, o: 0.75, e: 'out' },
          62: { sx: 1, o: 0, e: 'out' },
        },
      },
      checkFlash(5.0, 7.6, '#7DD3FC', 42, 66),
    ],
  },

  mysql: {
    story:
      'Sakila the MySQL dolphin leaps gracefully over an ocean query wave while the M-y-S-Q-L letters ripple in sequence below',
    groups: {
      dolphin: [6, 0],
      wordmark: [1, 2, 5, 4, 3],
    },
    tracks: [
      {
        on: 'dolphin',
        origin: [18.8, 12],
        keys: {
          12: { r: -10, y: 0.8, e: 'inout' },
          28: { r: 10, y: -2.0, e: 'out' },
          44: { r: -4, y: 0.3, e: 'settle' },
          58: { r: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'wordmark',
        order: 'x',
        each: true,
        stagger: 2.5,
        keys: {
          18: { y: 0, e: 'inout' },
          28: { y: -1.4, e: 'out' },
          38: { y: 0.25, e: 'settle' },
          48: { y: 0, e: 'out' },
        },
      },
    ],
    props: [waveLine(13.2, '#7DD3FC', 10, 62), spark(20.6, 5.4, 1.4, -1.2, '#BAE6FD', 24, 46)],
  },

  mongodb: {
    story:
      'MongoDB’s emerald leaf sways organically from its stem as JSON document packets sync into the replica set and pulse outward',
    tracks: [
      {
        on: 'all',
        origin: '50% 92%',
        keys: sway(10, 6.5, 0.5),
      },
    ],
    props: [
      packet(3.8, 7.2, 12.0, 12.0, '#86EFAC', 14, 44, 0.95),
      packet(20.2, 16.4, 12.0, 12.0, '#4ADE80', 20, 50, 0.95),
      pulseRing(12, 12, 9.6, '#4ADE80', 34, 66),
    ],
  },

  supabase: {
    story:
      'Supabase’s emerald lightning bolt charges up and strikes with an instant PostgreSQL real-time broadcast ripple and auth spark',
    tracks: [
      {
        on: 'all',
        origin: '50% 50%',
        keys: {
          12: { s: 0.9, r: -4.5, e: 'in' },
          24: { s: 1.09, r: 3.5, e: 'settle' },
          38: { s: 0.97, r: -1.5, e: 'inout' },
          52: { s: 1.03, r: 0.5, e: 'settle' },
          62: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.4, '#6EE7B7', 22, 56),
      boltFlash(17.8, 3.6, '#A7F3D0', 20, 48),
      packet(6.0, 18.0, 12.0, 12.0, '#34D399', 12, 38, 0.9),
    ],
  },

  prisma: {
    story:
      'Prisma’s geometric 3D prism traces its schema facets, tilts to refract a query beam into type-safe models, and sweeps a crisp metallic sheen',
    tracks: [
      {
        on: 0,
        origin: '50% 55%',
        draw: [8, 28],
        fill: [22, 32],
        width: 0.55,
        keys: {
          26: { r: -4.5, s: 0.97, e: 'inout' },
          42: { r: 3.5, s: 1.04, e: 'settle' },
          58: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      sheen('<rect x="2.5" y="1" width="19" height="22" rx="2"/>', 40, 66, 0.3),
      spark(17.8, 9.2, 2.2, -1.2, '#E2E8F0', 30, 52),
      spark(18.6, 13.6, 2.2, 0.8, '#93C5FD', 34, 56),
    ],
  },

  elasticsearch: {
    story:
      'Elasticsearch’s three inverted-index arcs fan out and lock back into alignment while a distributed search radar sweeps for matching documents',
    groups: {
      top: 0,
      mid: 1,
      bot: 2,
    },
    tracks: [
      {
        on: 'top',
        keys: slideIn(10, 2.8, -1.4),
      },
      {
        on: 'mid',
        keys: slideIn(15, -3.0, 0),
      },
      {
        on: 'bot',
        keys: slideIn(20, 2.8, 1.4),
      },
    ],
    props: [
      radar(12, 12, 10.4, '#FBBF24', 14, 64, 140),
      spark(18.6, 5.2, 1.6, -1.2, '#FDE047', 38, 58),
    ],
  },

  mariadb: {
    story:
      'MariaDB’s sea lion glides smoothly through an open-source relational current, nodding as a transaction wave crests beneath it',
    tracks: [
      {
        on: 'all',
        origin: '50% 65%',
        keys: {
          12: { r: -4.5, y: 0.8, e: 'inout' },
          30: { r: 3.5, y: -0.7, e: 'inout' },
          48: { r: -1.5, y: 0.3, e: 'settle' },
          62: { r: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      waveLine(19.8, '#7DD3FC', 10, 62),
      pulseRing(18.0, 6.2, 2.0, '#BAE6FD', 24, 52, { layer: 'over', s0: 0.5, s1: 1.5 }),
    ],
  },

  microsoftsqlserver: {
    story:
      'SQL Server’s enterprise cylinder traces its relational contour, locks in with transactional weight, and confirms an ACID commit ring',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        fill: [24, 34],
        width: 0.55,
        keys: heartbeat(24, 0.06),
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#FCA5A5', 28, 60), checkFlash(16.4, 5.0, '#FCA5A5', 42, 66)],
  },

  amazondynamodb: {
    story:
      'DynamoDB snaps with single-digit millisecond key-value throughput as partition bolts fire and a low-latency shockwave expands',
    tracks: [
      {
        on: 'all',
        origin: '50% 50%',
        keys: {
          12: { s: 0.9, r: -4, e: 'in' },
          24: { s: 1.08, r: 3, e: 'settle' },
          38: { s: 0.96, r: -1.5, e: 'inout' },
          52: { s: 1.03, r: 0.5, e: 'settle' },
          62: { s: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [boltFlash(17.4, 4.0, '#93C5FD', 18, 46), pulseRing(12, 12, 9.6, '#818CF8', 22, 56)],
  },

  firebase: {
    story:
      'Firebase’s layered flame ignites from its ember base upward, flickering warmly as real-time document sync sparks rise off the tip',
    groups: {
      base: 0,
      leftFlame: 1,
      innerFlame: 2,
      mainFlame: 3,
    },
    tracks: [
      {
        on: 'base',
        keys: heartbeat(10, 0.09),
      },
      {
        on: 'leftFlame',
        origin: '50% 95%',
        keys: {
          12: { sy: 0.72, r: -4, e: 'inout' },
          28: { sy: 1.08, r: 3, e: 'inout' },
          44: { sy: 0.95, r: -2, e: 'settle' },
          58: { sy: 1, r: 0, e: 'out' },
        },
      },
      {
        on: 'innerFlame',
        origin: '50% 95%',
        keys: {
          16: { sy: 0.78, r: 4, e: 'inout' },
          32: { sy: 1.1, r: -3, e: 'inout' },
          48: { sy: 0.96, r: 1.5, e: 'settle' },
          62: { sy: 1, r: 0, e: 'out' },
        },
      },
      {
        on: 'mainFlame',
        origin: '50% 95%',
        keys: {
          20: { sy: 0.85, r: -3, e: 'inout' },
          36: { sy: 1.08, r: 2.5, e: 'inout' },
          52: { sy: 0.98, r: -1, e: 'settle' },
          64: { sy: 1, r: 0, e: 'out' },
        },
      },
    ],
    props: [
      spark(13.6, 3.2, -0.8, -1.8, '#FDE047', 24, 48),
      spark(16.0, 4.4, 1.0, -1.6, '#FB923C', 32, 56),
    ],
  },

  duckdb: {
    story:
      'DuckDB’s in-process duck bobs briskly inside its yellow badge and quacks twice as vectorized OLAP analytics bars surge in',
    groups: {
      badge: 0,
      head: 1,
      beak: 2,
    },
    tracks: [
      {
        on: 'badge',
        keys: breathe(10, 0.05),
      },
      {
        on: 'head',
        origin: '50% 55%',
        keys: {
          14: { y: -0.7, r: -5, e: 'inout' },
          28: { y: 0.35, r: 3, e: 'inout' },
          44: { y: -0.45, r: -3, e: 'settle' },
          58: { y: 0, r: 0, e: 'out' },
        },
      },
      {
        on: 'beak',
        origin: '0% 50%',
        keys: {
          18: { x: 0.6, sy: 1.28, e: 'out' },
          26: { x: 0, sy: 0.92, e: 'in' },
          36: { x: 0.7, sy: 1.3, e: 'out' },
          46: { x: 0, sy: 1, e: 'settle' },
        },
      },
    ],
    props: [
      spark(19.4, 10.6, 1.6, -0.9, '#FEF08A', 20, 40),
      spark(19.6, 13.2, 1.6, 0.9, '#FEF08A', 36, 56),
    ],
  },

  clickhouse: {
    story:
      'ClickHouse’s five yellow columnar storage bars surge upward left-to-right like real-time OLAP telemetry ingesting millions of rows per second',
    groups: {
      cols: [3, 4, 2, 1, 0],
    },
    tracks: [
      {
        on: 'cols',
        order: 'x',
        each: true,
        origin: '50% 100%',
        stagger: 3.2,
        keys: {
          10: { sy: 0.2, o: 0.35, e: 'in' },
          24: { sy: 1.1, o: 1, e: 'settle' },
          36: { sy: 0.95, o: 1, e: 'inout' },
          46: { sy: 1, o: 1, e: 'out' },
        },
      },
    ],
    props: [packet(2.3, 3.0, 21.7, 10.2, '#FEF08A', 26, 58, 0.95)],
  },

  drizzle: {
    story:
      'Drizzle ORM’s four neon-lime diagonal raindrops fall crisply in a zero-overhead SQL shower and lock onto the typed schema grid',
    groups: {
      drops: [0, 3, 1, 2],
    },
    tracks: [
      {
        on: 'drops',
        order: 'x',
        each: true,
        stagger: 3.5,
        keys: {
          10: { x: 2.0, y: -3.2, o: 0, e: 'in' },
          15: { x: 1.3, y: -2.1, o: 1, e: 'out' },
          30: { x: -0.2, y: 0.3, o: 1, e: 'settle' },
          40: { x: 0, y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      guides(
        [
          [2.0, 12.0, 22.0, 12.0],
          [12.0, 4.0, 12.0, 20.0],
        ],
        '#BEF264',
        12,
        56
      ),
    ],
  },

  neo4j: {
    story:
      'Neo4j’s connected graph clusters breathe apart and pull back together as Cypher traversal packets zip back and forth along the relationship edge',
    groups: {
      leftCluster: 0,
      rightCluster: 1,
    },
    tracks: [
      {
        on: 'leftCluster',
        keys: {
          12: { x: -1.3, y: 1.0, s: 0.94, e: 'inout' },
          36: { x: -0.7, y: 0.5, s: 1.04, e: 'inout' },
          54: { x: 0.15, y: -0.1, s: 1, e: 'settle' },
          64: { x: 0, y: 0, s: 1, e: 'out' },
        },
      },
      {
        on: 'rightCluster',
        keys: {
          12: { x: 1.3, y: -1.0, s: 0.94, e: 'inout' },
          36: { x: 0.7, y: -0.5, s: 1.04, e: 'inout' },
          54: { x: -0.15, y: 0.1, s: 1, e: 'settle' },
          64: { x: 0, y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(6.8, 15.4, 15.6, 9.3, '#7DD3FC', 14, 42, 1.0),
      packet(15.6, 9.3, 6.8, 15.4, '#FDE047', 34, 62, 1.0),
      pulseRing(15.6, 9.3, 3.2, '#93C5FD', 34, 58),
    ],
  },

  apachecassandra: {
    story:
      'Apache Cassandra’s all-seeing eye blinks calmly while its iris scans across peer-to-peer ring nodes, keeping masterless replicas in sync',
    groups: {
      lids: [4, 10],
      iris: [0, 1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13],
    },
    tracks: [
      {
        on: 'lids',
        origin: [12, 11.2],
        keys: {
          18: { sy: 1, e: 'in' },
          24: { sy: 0.18, e: 'out' },
          32: { sy: 1.04, e: 'settle' },
          40: { sy: 1, e: 'out' },
        },
      },
      {
        on: 'iris',
        origin: [12, 11.2],
        keys: {
          34: { x: 0, e: 'inout' },
          44: { x: -1.2, e: 'inout' },
          54: { x: 1.2, e: 'inout' },
          64: { x: 0, e: 'out' },
        },
      },
    ],
    props: [radar(12, 12, 10.6, '#38BDF8', 12, 64, 120)],
  },

  cockroachlabs: {
    story:
      'CockroachDB’s resilient emblem rides out a simulated zone-failure tremor, shrugs it off with a recovery pulse, and confirms Raft consensus',
    tracks: [
      {
        on: 'all',
        origin: '50% 50%',
        keys: {
          12: { r: -6, x: -0.6, s: 0.94, e: 'in' },
          20: { r: 5.5, x: 0.6, s: 0.96, e: 'inout' },
          28: { r: -3.5, x: -0.3, s: 1.06, e: 'settle' },
          40: { r: 1.5, x: 0.1, s: 1.02, e: 'inout' },
          54: { r: 0, x: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 9.8, '#A78BFA', 26, 60), checkFlash(16.6, 4.8, '#C4B5FD', 42, 66)],
  },

  planetscale: {
    story:
      'PlanetScale’s planet separates along its Vitess shard seam to spin up a non-blocking schema branch, then merges smoothly back into production',
    groups: {
      planet: 0,
      shard: 1,
    },
    tracks: [
      {
        on: 'planet',
        keys: {
          12: { x: -1.0, y: -1.0, e: 'inout' },
          36: { x: -0.8, y: -0.8, e: 'inout' },
          54: { x: 0.15, y: 0.15, e: 'settle' },
          64: { x: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'shard',
        keys: {
          12: { x: 1.8, y: 1.8, e: 'inout' },
          36: { x: 1.4, y: 1.4, e: 'inout' },
          54: { x: -0.2, y: -0.2, e: 'settle' },
          64: { x: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [
      radar(12, 12, 10.8, '#CBD5E1', 12, 64, 110),
      packet(17.1, 17.1, 11.6, 11.6, '#FDE047', 34, 58, 0.9),
    ],
  },

  turso: {
    story:
      'Turso’s edge-native libSQL mark floats weightlessly while emitting low-latency replication pings outward to global edge PoPs',
    tracks: [
      {
        on: 'all',
        origin: '50% 50%',
        keys: {
          12: { y: -1.1, s: 0.97, e: 'inout' },
          32: { y: 0.6, s: 1.05, e: 'inout' },
          50: { y: -0.3, s: 0.99, e: 'settle' },
          62: { y: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 8.8, '#5EEAD4', 16, 50), pulseRing(12, 12, 10.4, '#2DD4BF', 28, 64)],
  },

  influxdb: {
    story:
      'InfluxDB’s seven faceted time-series polyhedron faces assemble radially while high-throughput IoT metrics pulse through its core',
    groups: {
      facets: [0, 1, 2, 3, 4, 5, 6],
    },
    tracks: [
      {
        on: 'facets',
        order: 'a',
        each: true,
        stagger: 2.5,
        keys: popIn(10, 0.55),
      },
    ],
    props: [
      telemetryBar(3.2, 17.4, 1.3, 3.8, '#7DD3FC', 22, 56),
      telemetryBar(5.2, 15.8, 1.3, 5.4, '#38BDF8', 26, 60),
      pulseRing(12, 12, 10.4, '#38BDF8', 36, 66),
    ],
  },

  timescale: {
    story:
      'TimescaleDB’s golden hypertable chunks cascade chronologically into alignment as a continuous time-series query sweeps the timeline',
    tracks: [
      {
        on: (parts) => parts.map((p) => p.i),
        order: 'y',
        each: true,
        stagger: 1.0,
        keys: {
          10: { y: -1.6, o: 0.35, e: 'in' },
          24: { y: 0.18, o: 1, e: 'settle' },
          34: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [waveLine(21.0, '#FDE047', 16, 62), pulseRing(12, 12, 10.4, '#FBBF24', 36, 66)],
  },

  meilisearch: {
    story:
      'Meilisearch’s three slanted speed-stripes streak into frame left-to-right at instant search-as-you-type velocity with a match spark',
    groups: {
      stripes: [2, 0, 1],
    },
    tracks: [
      {
        on: 'stripes',
        order: 'x',
        each: true,
        stagger: 4,
        keys: slideIn(10, -3.4, 1.4),
      },
    ],
    props: [boltFlash(18.6, 3.8, '#F9A8D4', 30, 58), pulseRing(12, 12, 10.0, '#F472B6', 36, 64)],
  },

  algolia: {
    story:
      'Algolia’s search stopwatch ticks sharply forward and locks onto a millisecond discovery result with a crisp radar sweep',
    tracks: [
      {
        on: 'all',
        origin: '50% 50%',
        keys: {
          12: { r: -9, s: 0.94, e: 'inout' },
          26: { r: 7, s: 1.05, e: 'settle' },
          40: { r: -2.5, s: 0.99, e: 'inout' },
          54: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      radar(12, 12, 10.6, '#93C5FD', 12, 62, 150),
      spark(18.8, 5.2, 1.5, -1.5, '#BFDBFE', 28, 50),
    ],
  },

  opensearch: {
    story:
      'OpenSearch’s three modular lens arcs converge around the focal point to lock onto distributed log analytics and fire a discovery sweep',
    groups: {
      leftArc: 2,
      topArc: 1,
      handle: 0,
    },
    tracks: [
      {
        on: 'leftArc',
        keys: slideIn(10, -2.6, 0.8),
      },
      {
        on: 'topArc',
        keys: slideIn(15, 0.8, -2.6),
      },
      {
        on: 'handle',
        keys: slideIn(20, 2.4, 2.4),
      },
    ],
    props: [radar(11.4, 11.4, 9.8, '#60A5FA', 18, 64, 120)],
  },

  couchbase: {
    story:
      'Couchbase’s enterprise NoSQL shield traces its perimeter and pulses with memory-first resilience while cluster sync packets converge',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        fill: [24, 34],
        width: 0.55,
        keys: heartbeat(26, 0.06),
      },
    ],
    props: [
      packet(3.4, 12.0, 12.0, 12.0, '#FCA5A5', 14, 42, 0.9),
      packet(20.6, 12.0, 12.0, 12.0, '#FCA5A5', 18, 46, 0.9),
      pulseRing(12, 12, 10.2, '#FCA5A5', 32, 64),
    ],
  },

  apachecouchdb: {
    story:
      'Apache CouchDB’s relaxing red couch assembles base, armrests, backrest, and plush cushion while multi-master JSON sync hums overhead',
    groups: {
      base: 1,
      leftArm: 3,
      rightArm: 2,
      back: 4,
      seat: 0,
    },
    tracks: [
      {
        on: 'base',
        keys: riseIn(10, 2.2),
      },
      {
        on: 'leftArm',
        keys: slideIn(14, -2.4, 0),
      },
      {
        on: 'rightArm',
        keys: slideIn(14, 2.4, 0),
      },
      {
        on: 'back',
        keys: dropIn(18, 2.4),
      },
      {
        on: 'seat',
        keys: dropIn(24, 2.6),
      },
    ],
    props: [waveLine(3.8, '#FCA5A5', 34, 64)],
  },

  appwrite: {
    story:
      'Appwrite’s main backend frame draws into place while its right-hand API bar slides in to lock auth, storage, and database services together',
    groups: {
      frame: 0,
      bar: 1,
    },
    tracks: [
      {
        on: 'frame',
        draw: [8, 30],
        fill: [22, 32],
        width: 0.55,
      },
      {
        on: 'bar',
        keys: slideIn(22, 3.2, 0),
      },
    ],
    props: [checkFlash(17.2, 5.2, '#FDA4AF', 42, 66), pulseRing(12, 12, 10.2, '#FB7185', 36, 64)],
  },

  pocketbase: {
    story:
      'PocketBase’s compact single-binary panels snap together diagonally, tucking embedded SQLite and real-time subscriptions into one Go file',
    groups: {
      topLeft: [2, 0],
      botRight: [3, 1],
    },
    tracks: [
      {
        on: 'topLeft',
        keys: slideIn(10, -2.2, -2.2),
      },
      {
        on: 'botRight',
        keys: slideIn(16, 2.2, 2.2),
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#BAE6FD', 34, 62),
      sheen('<rect x="2" y="2" width="20" height="20" rx="3"/>', 42, 66, 0.26),
    ],
  },

  surrealdb: {
    story:
      'SurrealDB’s neon-magenta multi-model S-curves unfurl in opposition and interlock, unifying SQL, graph, and document queries in one loop',
    groups: {
      lower: 0,
      upper: 1,
      outer: 2,
    },
    tracks: [
      {
        on: 'outer',
        keys: breathe(10, 0.05),
      },
      {
        on: 'upper',
        keys: slideIn(12, 1.8, -1.8),
      },
      {
        on: 'lower',
        keys: slideIn(16, -1.8, 1.8),
      },
    ],
    props: [
      pulseRing(12, 12, 10.4, '#F472B6', 26, 60),
      spark(18.2, 4.8, 1.5, -1.2, '#F9A8D4', 34, 56),
    ],
  },

  arangodb: {
    story:
      'ArangoDB’s multi-model emblem sways gently as its document core and graph node pulse in concert across a shared AQL query hop',
    groups: {
      body: 0,
      rightNode: 1,
      leftNode: 2,
    },
    tracks: [
      {
        on: 'body',
        origin: '50% 60%',
        keys: sway(10, 4.5, 0.45),
      },
      {
        on: 'leftNode',
        keys: heartbeat(16, 0.12),
      },
      {
        on: 'rightNode',
        keys: heartbeat(24, 0.14),
      },
    ],
    props: [
      packet(8.4, 12.0, 16.1, 10.8, '#FEF08A', 20, 50, 0.95),
      pulseRing(16.1, 10.8, 3.0, '#ECFCCB', 42, 64),
    ],
  },

  dgraph: {
    story:
      'Dgraph’s GraphQL graph emblem traces its bold magenta contour while distributed query packets resolve across connected vertices',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        fill: [24, 34],
        width: 0.55,
        keys: heartbeat(26, 0.06),
      },
    ],
    props: [
      packet(5.6, 5.4, 17.8, 12.0, '#F9A8D4', 18, 46, 0.95),
      packet(17.8, 12.0, 5.6, 18.6, '#F472B6', 34, 62, 0.95),
      pulseRing(12, 12, 9.8, '#F472B6', 32, 64),
    ],
  },

  milvus: {
    story:
      'Milvus’s sleek vector-search bird banks smoothly in flight while its core embedding ring locks onto nearest neighbors and fires a vector tip',
    groups: {
      core: 0,
      tip: 1,
      wing: 2,
    },
    tracks: [
      {
        on: 'wing',
        origin: '45% 50%',
        keys: {
          12: { r: -6, y: 0.7, e: 'inout' },
          30: { r: 4.5, y: -0.6, e: 'inout' },
          48: { r: -1.5, y: 0.2, e: 'settle' },
          60: { r: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'core',
        keys: heartbeat(18, 0.14),
      },
      {
        on: 'tip',
        keys: {
          20: { x: 0, e: 'out' },
          32: { x: 1.6, e: 'settle' },
          46: { x: -0.2, e: 'settle' },
          58: { x: 0, e: 'out' },
        },
      },
    ],
    props: [radar(11.5, 12, 9.6, '#38BDF8', 16, 62, 120)],
  },

  qdrant: {
    story:
      'Qdrant’s Rust-powered outer vector cube traces into position while its inner similarity core rotates and emits an HNSW proximity pulse',
    groups: {
      core: 0,
      outer: 1,
    },
    tracks: [
      {
        on: 'outer',
        draw: [8, 30],
        fill: [24, 34],
        width: 0.55,
      },
      {
        on: 'core',
        origin: [12, 12],
        keys: {
          14: { r: -24, s: 0.72, e: 'inout' },
          34: { r: 12, s: 1.15, e: 'settle' },
          50: { r: -3, s: 0.98, e: 'inout' },
          62: { r: 0, s: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 9.8, '#FB7185', 28, 60),
      spark(18.6, 5.4, 1.5, -1.2, '#FDA4AF', 32, 54),
    ],
  },

  typeorm: {
    story:
      'TypeORM’s TypeScript entity block and relational table block slide together and snap into a strongly typed data-mapper binding',
    groups: {
      rightBlock: 0,
      leftBlock: 1,
    },
    tracks: [
      {
        on: 'leftBlock',
        keys: slideIn(12, -2.8, 0),
      },
      {
        on: 'rightBlock',
        keys: slideIn(16, 2.8, 0),
      },
    ],
    props: [
      guides(
        [
          [11.2, 3.2, 11.2, 20.8],
          [2.4, 12.0, 21.6, 12.0],
        ],
        '#FB923C',
        10,
        52
      ),
      checkFlash(10.0, 4.4, '#FB923C', 40, 64),
    ],
  },

  sequelize: {
    story:
      'Sequelize’s isometric blue hex-cube assembles facet by facet from its foundation upward, binding JavaScript models to SQL dialect tables',
    tracks: [
      {
        on: (parts) => parts.map((p) => p.i),
        order: '-y',
        each: true,
        stagger: 0.75,
        keys: {
          10: { y: 1.8, o: 0.25, e: 'in' },
          24: { y: -0.18, o: 1, e: 'settle' },
          34: { y: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [pulseRing(12, 12, 10.6, '#7DD3FC', 36, 66)],
  },

  hibernate: {
    story:
      'Hibernate’s four folded gold-and-slate JPA ribbon facets unfold briefly and snap back into a unified object-relational mapping diamond',
    groups: {
      leftSlate: 0,
      rightSlate: 1,
      topGold: 3,
      botGold: 4,
    },
    tracks: [
      {
        on: 'topGold',
        keys: slideIn(10, 0, -2.0),
      },
      {
        on: 'botGold',
        keys: slideIn(14, 0, 2.0),
      },
      {
        on: 'leftSlate',
        keys: slideIn(18, -2.0, 0),
      },
      {
        on: 'rightSlate',
        keys: slideIn(22, 2.0, 0),
      },
    ],
    props: [pulseRing(12, 12, 10.2, '#D4C68E', 34, 64)],
  },

  sqlalchemy: {
    story:
      'SQLAlchemy’s SQL toolkit glyphs step into sequence while its crimson alchemical crest ignites on the right, transmuting Python into SQL',
    groups: {
      glyphs: [0, 2, 3, 1],
      crest: 4,
    },
    tracks: [
      {
        on: 'glyphs',
        order: 'x',
        each: true,
        stagger: 3,
        keys: riseIn(10, 2.2),
      },
      {
        on: 'crest',
        origin: '50% 50%',
        keys: {
          24: { s: 0.65, r: -12, o: 0.3, e: 'in' },
          38: { s: 1.15, r: 6, o: 1, e: 'settle' },
          52: { s: 1, r: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      spark(21.4, 7.6, 1.4, -1.4, '#FCA5A5', 32, 54),
      sheen('<rect x="0.5" y="7" width="23" height="10" rx="1"/>', 44, 66, 0.25),
    ],
  },

  mongoose: {
    story:
      'Mongoose’s sleek Node.js schema mark dashes swiftly across the frame while its accent dot stamps schema validation onto MongoDB documents',
    groups: {
      body: 0,
      accent: 2,
    },
    tracks: [
      {
        on: 'body',
        keys: slideIn(10, -2.6, 0),
      },
      {
        on: 'accent',
        keys: popIn(24, 0.35),
      },
    ],
    props: [waveLine(18.0, '#FCA5A5', 14, 58), checkFlash(17.4, 5.2, '#FCA5A5', 38, 64)],
  },

  flyway: {
    story:
      'Flyway’s version-control shield traces solidly while its inner migration wing steps forward in crisp increments to apply sequential SQL versions',
    groups: {
      shield: 0,
      wing: 1,
    },
    tracks: [
      {
        on: 'shield',
        draw: [8, 28],
        fill: [22, 32],
        width: 0.55,
      },
      {
        on: 'wing',
        keys: {
          14: { x: -2.2, o: 0.35, e: 'out' },
          26: { x: -0.9, o: 1, e: 'settle' },
          38: { x: 0.4, o: 1, e: 'settle' },
          52: { x: 0, o: 1, e: 'out' },
        },
      },
    ],
    props: [
      packet(4.4, 12.0, 17.6, 12.0, '#FCA5A5', 20, 48, 0.9),
      checkFlash(16.8, 5.0, '#FCA5A5', 42, 66),
    ],
  },

  liquibase: {
    story:
      'Liquibase’s four stacked changeset layers drop sequentially into place from foundation to top, rolling out automated CI/CD schema updates',
    groups: {
      layers: [3, 1, 2, 0],
    },
    tracks: [
      {
        on: 'layers',
        order: '-y',
        each: true,
        stagger: 4,
        keys: dropIn(10, 2.8),
      },
    ],
    props: [checkFlash(17.4, 4.6, '#93C5FD', 46, 68), pulseRing(12, 12, 10.2, '#60A5FA', 38, 66)],
  },

  azuresqldatabase: {
    story:
      'Azure SQL Database’s managed cloud cylinder swells softly while the crisp white S, Q, and L glyphs pop in left-to-right query execution order',
    groups: {
      cloud: 0,
      sql: [2, 3, 1],
    },
    tracks: [
      {
        on: 'cloud',
        keys: breathe(10, 0.05),
      },
      {
        on: 'sql',
        order: 'x',
        each: true,
        stagger: 4.5,
        keys: popIn(14, 0.4),
      },
    ],
    props: [pulseRing(12, 12, 10.6, '#60A5FA', 34, 64)],
  },

  neon: {
    story:
      'Neon’s serverless Postgres N-frame wakes instantaneously from scale-to-zero, flaring to life with a copy-on-write branch pulse',
    tracks: [
      {
        on: 0,
        draw: [8, 28],
        fill: [22, 32],
        width: 0.55,
        keys: {
          18: { s: 0.9, e: 'in' },
          32: { s: 1.07, e: 'settle' },
          48: { s: 1, e: 'out' },
        },
      },
    ],
    props: [
      pulseRing(12, 12, 10.4, '#6EE7B7', 24, 58),
      spark(18.8, 4.6, 1.5, -1.4, '#A7F3D0', 28, 52),
    ],
  },

  tidb: {
    story:
      'TiDB’s hexagonal HTAP prism traces and locks into place as transactional OLTP and analytical OLAP packets converge inside one distributed engine',
    tracks: [
      {
        on: 0,
        origin: [12, 12],
        draw: [8, 30],
        fill: [24, 34],
        width: 0.55,
        keys: {
          24: { r: -8, e: 'inout' },
          42: { r: 5, e: 'settle' },
          58: { r: 0, e: 'out' },
        },
      },
    ],
    props: [
      packet(3.8, 7.0, 12.0, 12.0, '#FCA5A5', 16, 44, 0.95),
      packet(20.2, 17.0, 12.0, 12.0, '#FDE047', 20, 48, 0.95),
      pulseRing(12, 12, 10.2, '#FCA5A5', 36, 64),
    ],
  },

  oracle: {
    story:
      'Oracle’s six crimson letterforms ripple left-to-right in a coordinated enterprise transaction wave before locking solidly under a metallic sheen',
    groups: {
      letters: [3, 2, 0, 4, 1, 5],
    },
    tracks: [
      {
        on: 'letters',
        order: 'x',
        each: true,
        stagger: 2.8,
        keys: {
          10: { y: 0, e: 'inout' },
          22: { y: -1.6, e: 'out' },
          34: { y: 0.25, e: 'settle' },
          44: { y: 0, e: 'out' },
        },
      },
    ],
    props: [sheen('<rect x="0.2" y="9.5" width="23.6" height="5" rx="1"/>', 44, 66, 0.3)],
  },

  fauna: {
    story:
      'Fauna’s crystalline serverless mark traces its faceted wing and glides smoothly into global consistency with a calm lavender quorum ring',
    tracks: [
      {
        on: 0,
        origin: '50% 55%',
        draw: [8, 30],
        fill: [24, 34],
        width: 0.55,
        keys: sway(14, 5, 0.5),
      },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#C4B5FD', 28, 62),
      spark(18.0, 5.2, 1.5, -1.2, '#DDD6FE', 34, 56),
    ],
  },

  baserow: {
    story:
      'Baserow’s five no-code spreadsheet cells slide neatly into their three-row grid layout, snapping together like live collaborative database rows',
    groups: {
      cells: [0, 1, 2, 3, 4],
    },
    tracks: [
      {
        on: 'cells',
        order: 'y',
        each: true,
        stagger: 3.5,
        keys: slideIn(10, -2.8, 0),
      },
    ],
    props: [
      guides(
        [
          [1.6, 8.2, 22.4, 8.2],
          [1.6, 15.8, 22.4, 15.8],
        ],
        '#93C5FD',
        10,
        54
      ),
    ],
  },

  upstash: {
    story:
      'Upstash’s twin serverless edge arcs separate briefly to route an HTTP Redis cache burst, then snap back into a tight low-latency loop',
    groups: {
      upper: 0,
      lower: 1,
    },
    tracks: [
      {
        on: 'upper',
        keys: {
          12: { x: 1.2, y: -1.4, e: 'inout' },
          32: { x: 0.8, y: -0.9, e: 'inout' },
          48: { x: -0.15, y: 0.15, e: 'settle' },
          60: { x: 0, y: 0, e: 'out' },
        },
      },
      {
        on: 'lower',
        keys: {
          12: { x: -1.2, y: 1.4, e: 'inout' },
          32: { x: -0.8, y: 0.9, e: 'inout' },
          48: { x: 0.15, y: -0.15, e: 'settle' },
          60: { x: 0, y: 0, e: 'out' },
        },
      },
    ],
    props: [boltFlash(17.6, 4.2, '#6EE7B7', 22, 50), pulseRing(12, 12, 9.8, '#34D399', 26, 58)],
  },

  knexdotjs: {
    story:
      'Knex.js’s terracotta query-builder badge traces its fluent chain contour and pulses as chained SQL clauses compile cleanly for any dialect',
    tracks: [
      {
        on: 0,
        draw: [8, 30],
        fill: [24, 34],
        width: 0.55,
        keys: heartbeat(26, 0.07),
      },
    ],
    props: [
      packet(4.4, 12.0, 12.0, 12.0, '#FDBA74', 16, 40, 0.9),
      packet(12.0, 12.0, 19.6, 12.0, '#FED7AA', 32, 56, 0.9),
      checkFlash(16.8, 5.0, '#FDBA74', 42, 66),
    ],
  },

  scylladb: {
    story:
      'ScyllaDB sea-monster emblem surges with shard-per-core C++ velocity while its glowing eye locks on and a low-latency cyan pulse radiates outward',
    groups: { body: 0, accent: 1, head: 2, eye: 3 },
    tracks: [
      { on: 'body', origin: '50% 60%', keys: sway(10, 5, 0.6) },
      { on: 'eye', keys: popIn(22, 0.4) },
    ],
    props: [
      pulseRing(12, 12, 10.2, '#67E8F9', 20, 56, { layer: 'under', sw: 0.6 }),
      boltFlash(17.8, 4.4, '#FDE047', 30, 58),
    ],
  },

  victoriametrics: {
    story:
      'VictoriaMetrics three stacked time-series V-chevrons drop into tight telemetry alignment while live metric bars pulse beside them',
    tracks: [{ on: [0, 1, 2], order: 'y', each: true, stagger: 5, keys: dropIn(10, 2.4) }],
    props: [
      pulseRing(12, 12, 10.2, '#D8B4FE', 30, 62, { layer: 'under', sw: 0.55 }),
      packet(4.0, 12.0, 20.0, 12.0, '#38BDF8', 28, 56, 0.9),
    ],
  },

  hivemq: {
    story:
      'HiveMQ golden honeycomb MQTT broker pulses twice as IoT telemetry rings expand outward and its twin bee antennae pop alertly',
    groups: { outer: 0, inner: 1, eyes: [2, 3] },
    tracks: [
      { on: 'outer', keys: heartbeat(10, 0.06) },
      { on: 'eyes', each: true, stagger: 3, keys: popIn(22, 0.4) },
    ],
    props: [
      pulseRing(12, 12, 9.6, '#FDE047', 18, 52, { layer: 'under', sw: 0.6 }),
      pulseRing(12, 12, 10.5, '#FDBA74', 30, 64, { layer: 'under', sw: 0.45 }),
    ],
  },

  minio: {
    story:
      'MinIO sleek crimson bird-wing mark glides upward with high-throughput S3 object-storage momentum and sweeps a crisp highlight',
    tracks: [{ on: 0, draw: [8, 32], fill: [24, 36], width: 0.65, keys: riseIn(10, 2.4) }],
    props: [
      sheen('<rect x="5" y="1" width="14" height="22" rx="2"/>', 34, 62, 0.3),
      spark(17.4, 5.0, 1.6, -1.6, '#FCA5A5', 38, 60),
    ],
  },

  ceph: {
    story:
      'Ceph octopus tentacles expand around its central storage core as replicated object packets pulse evenly across the distributed cluster',
    groups: { outer: 0, inner: 1, eye: 2 },
    tracks: [
      { on: 'outer', origin: [12, 12], keys: breathe(10, 0.07) },
      { on: 'inner', keys: popIn(16, 0.72) },
      { on: 'eye', keys: heartbeat(24, 0.14) },
    ],
    props: [pulseRing(12, 12, 10.2, '#FCA5A5', 22, 58, { layer: 'under', sw: 0.55 })],
  },

  longhorn: {
    story:
      'Longhorn cloud-native block storage horns tilt with steady resilience while its center core locks in and a replication ring expands',
    groups: { horns: 0, core: 1 },
    tracks: [
      { on: 'horns', origin: '50% 60%', keys: nod(10, 5.5) },
      { on: 'core', keys: popIn(20, 0.4) },
    ],
    props: [pulseRing(12, 12, 10.2, '#F0ABFC', 26, 60, { layer: 'under', sw: 0.55 })],
  },

  rook: {
    story:
      'Rook storage orchestrator chess crown lowers onto its fortified base as the inner Kubernetes volume core snaps into lock',
    groups: { crown: 0, base: 1, core: 2 },
    tracks: [
      { on: 'base', keys: riseIn(10, 2.0) },
      { on: 'crown', keys: dropIn(16, 2.6) },
      { on: 'core', keys: popIn(24, 0.4) },
    ],
    props: [checkFlash(16.8, 5.0, '#7DD3FC', 40, 66)],
  },
};
