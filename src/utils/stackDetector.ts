import { TechItem } from '../types/stack';

/**
 * Curated dependency/image/package -> canonical catalog ID mappings for
 * common package.json, requirements.txt, pyproject.toml, Dockerfile, go.mod,
 * Cargo.toml, composer.json, and Gemfile ecosystems.
 */
const PACKAGE_TO_ID: Record<string, string> = {
  // JS / TS / Frontend
  react: 'react',
  'react-dom': 'react',
  'react-native': 'reactnative',
  next: 'nextdotjs',
  nuxt: 'nuxt',
  vue: 'vuedotjs',
  svelte: 'svelte',
  '@sveltejs/kit': 'svelte',
  '@angular/core': 'angular',
  astro: 'astro',
  solid: 'solid',
  'solid-js': 'solid',
  qwik: 'qwik',
  '@builder.io/qwik': 'qwik',
  preact: 'preact',
  htmx: 'htmx',
  'htmx.org': 'htmx',
  alpinejs: 'alpinedotjs',
  tailwindcss: 'tailwindcss',
  '@tailwindcss/vite': 'tailwindcss',
  typescript: 'typescript',
  vite: 'vite',
  vitest: 'vitest',
  webpack: 'webpack',
  esbuild: 'esbuild',
  rollup: 'rollupdotjs',
  '@swc/core': 'swc',
  turbo: 'turborepo',
  eslint: 'eslint',
  prettier: 'prettier',
  '@biomejs/biome': 'biome',
  jest: 'jest',
  '@playwright/test': 'playwright',
  playwright: 'playwright',
  cypress: 'cypress',
  storybook: 'storybook',
  '@storybook/react': 'storybook',
  three: 'threedotjs',
  gsap: 'greensock',
  'framer-motion': 'framer',
  '@reduxjs/toolkit': 'redux',
  redux: 'redux',
  '@tanstack/react-query': 'tanstack',
  '@trpc/server': 'trpc',
  '@trpc/client': 'trpc',
  graphql: 'graphql',
  '@apollo/client': 'apollographql',
  'socket.io': 'socketdotio',
  sass: 'sass',
  'styled-components': 'styledcomponents',
  '@mui/material': 'mui',
  '@chakra-ui/react': 'chakraui',
  antd: 'antdesign',
  bootstrap: 'bootstrap',
  electron: 'electron',
  '@tauri-apps/api': 'tauri',
  expo: 'expo',
  d3: 'd3',
  'chart.js': 'chartdotjs',
  pinia: 'pinia',
  swr: 'swr',
  xstate: 'xstate',
  mobx: 'mobx',
  zod: 'zod',
  'lucide-react': 'lucide',
  lucide: 'lucide',
  '@base-ui-components/react': 'baseui',
  effect: 'effect',
  nanostores: 'nanostores',
  'react-router': 'reactrouter',
  'react-router-dom': 'reactrouter',
  'react-hook-form': 'reacthookform',
  formik: 'formik',
  chromatic: 'chromatic',
  oxlint: 'oxc',
  rolldown: 'rolldown',
  gulp: 'gulp',
  grunt: 'grunt',
  nextra: 'nextra',
  h3: 'h3',
  '@scalar/api-reference': 'scalar',

  // Backend & Databases (JS/TS)
  express: 'express',
  fastify: 'fastify',
  '@nestjs/core': 'nestjs',
  hono: 'hono',
  elysia: 'elysia',
  prisma: 'prisma',
  '@prisma/client': 'prisma',
  'drizzle-orm': 'drizzle',
  typeorm: 'typeorm',
  sequelize: 'sequelize',
  mongoose: 'mongoose',
  mongodb: 'mongodb',
  pg: 'postgresql',
  postgres: 'postgresql',
  mysql2: 'mysql',
  mysql: 'mysql',
  redis: 'redis',
  ioredis: 'redis',
  '@supabase/supabase-js': 'supabase',
  firebase: 'firebase',
  'firebase-admin': 'firebase',
  kafkajs: 'apachekafka',
  amqplib: 'rabbitmq',
  bullmq: 'redis',
  '@clerk/nextjs': 'clerk',
  '@clerk/clerk-react': 'clerk',
  'better-auth': 'betterauth',
  lucia: 'lucia',
  stripe: 'stripe',
  '@stripe/stripe-js': 'stripe',
  resend: 'resend',
  'pusher-js': 'pusher',
  'livekit-client': 'livekit',
  'livekit-server-sdk': 'livekit',
  convex: 'convex',
  sst: 'sst',
  '@medusajs/medusa': 'medusa',
  wrangler: 'cloudflareworkers',
  '@prismicio/client': 'prismic',
  storyblok: 'storyblok',
  tinacms: 'tina',
  sidekiq: 'sidekiq',
  auth0: 'auth0',
  passport: 'passport',
  strapi: 'strapi',
  '@strapi/strapi': 'strapi',
  sanity: 'sanity',
  payload: 'payloadcms',
  '@sentry/node': 'sentry',
  '@sentry/react': 'sentry',
  '@opentelemetry/api': 'opentelemetry',
  openai: 'openai',
  '@anthropic-ai/sdk': 'anthropic',
  '@google/genai': 'googlegemini',
  '@modelcontextprotocol/sdk': 'modelcontextprotocol',
  langchain: 'langchain',
  '@langchain/core': 'langchain',
  n8n: 'n8n',
  elevenlabs: 'elevenlabs',
  '@elevenlabs/elevenlabs-js': 'elevenlabs',
  vllm: 'vllm',
  modal: 'modal',
  dify: 'dify',

  // Python / AI / Data
  fastapi: 'fastapi',
  django: 'django',
  flask: 'flask',
  aiohttp: 'aiohttp',
  celery: 'celery',
  sqlalchemy: 'sqlalchemy',
  psycopg2: 'postgresql',
  'psycopg2-binary': 'postgresql',
  psycopg: 'postgresql',
  pymongo: 'mongodb',
  torch: 'pytorch',
  pytorch: 'pytorch',
  tensorflow: 'tensorflow',
  keras: 'keras',
  'scikit-learn': 'scikitlearn',
  sklearn: 'scikitlearn',
  numpy: 'numpy',
  pandas: 'pandas',
  polars: 'polars',
  scipy: 'scipy',
  plotly: 'plotly',
  jupyter: 'jupyter',
  jupyterlab: 'jupyter',
  streamlit: 'streamlit',
  gradio: 'gradio',
  transformers: 'huggingface',
  diffusers: 'huggingface',
  'opencv-python': 'opencv',
  spacy: 'spacy',
  mlflow: 'mlflow',
  wandb: 'weightsandbiases',
  ray: 'ray',
  onnx: 'onnx',
  onnxruntime: 'onnx',
  pyspark: 'apachespark',
  'apache-airflow': 'apacheairflow',
  duckdb: 'duckdb',
  pydantic: 'python',
  pytest: 'python',
  uvicorn: 'python',
  'snowflake-connector-python': 'snowflake',

  // Go / Rust / PHP / Ruby / Java / Docker images
  'github.com/gin-gonic/gin': 'gin',
  'github.com/gofiber/fiber': 'fiber',
  'github.com/labstack/echo': 'echo',
  'google.golang.org/grpc': 'grpc',
  'actix-web': 'actix',
  axum: 'rust',
  tokio: 'rust',
  serde: 'rust',
  'laravel/framework': 'laravel',
  'symfony/framework-bundle': 'symfony',
  rails: 'rubyonrails',
  'spring-boot': 'springboot',
  node: 'nodedotjs',
  python: 'python',
  golang: 'go',
  rust: 'rust',
  nginx: 'nginx',
  caddy: 'caddy',
  traefik: 'traefikproxy',
  alpine: 'alpinelinux',
  ubuntu: 'ubuntu',
  debian: 'debian',
  clickhouse: 'clickhouse',
  elasticsearch: 'elasticsearch',
  rabbitmq: 'rabbitmq',
  nats: 'natsdotio',
  prometheus: 'prometheus',
  grafana: 'grafana',
  minio: 'minio',
  bun: 'bun',
  deno: 'deno',
};

/**
 * Detects canonical catalog technology IDs from a pasted or uploaded project file
 * (package.json, requirements.txt, pyproject.toml, Dockerfile, go.mod, Cargo.toml,
 * composer.json, Gemfile, etc.).
 */
export function detectStackFromFileContent(
  content: string,
  catalog: TechItem[],
  filename = ''
): string[] {
  const trimmed = content.trim();
  if (!trimmed) return [];

  const validIds = new Set(catalog.map((item) => item.id));
  const aliasToId = new Map<string, string>();
  for (const item of catalog) {
    aliasToId.set(item.id.toLowerCase(), item.id);
    for (const alias of item.aliases || []) {
      const key = String(alias).toLowerCase().trim();
      if (key.length >= 3 && !aliasToId.has(key)) {
        aliasToId.set(key, item.id);
      }
    }
  }

  const found: string[] = [];
  const add = (id: string | undefined) => {
    if (id && validIds.has(id) && !found.includes(id)) {
      found.push(id);
    }
  };

  const lowerName = filename.toLowerCase();
  if (lowerName.includes('dockerfile')) add('docker');
  if (lowerName === 'cargo.toml') add('rust');
  if (lowerName === 'go.mod') add('go');
  if (lowerName === 'requirements.txt' || lowerName === 'pyproject.toml') add('python');
  if (lowerName === 'composer.json') add('php');
  if (lowerName === 'gemfile') add('ruby');

  // 1. Try JSON (package.json / composer.json)
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as Record<string, unknown>;
      const sections = [
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'require',
        'require-dev',
      ];
      let hasNodeSections = false;
      for (const key of sections) {
        const block = parsed[key];
        if (block && typeof block === 'object') {
          if (key === 'dependencies' || key === 'devDependencies') hasNodeSections = true;
          for (const dep of Object.keys(block as Record<string, unknown>)) {
            const norm = dep.toLowerCase().trim();
            add(PACKAGE_TO_ID[norm] || aliasToId.get(norm));
          }
        }
      }
      if (hasNodeSections && !found.includes('nodedotjs')) {
        add('nodedotjs');
      }
      if (found.length > 0) return found;
    } catch {
      // Fall through to text scanning
    }
  }

  // 2. Dockerfile FROM instructions
  const fromMatches = trimmed.matchAll(/^\s*FROM\s+(?:--platform=\S+\s+)?([a-z0-9._/-]+)/gim);
  for (const match of fromMatches) {
    add('docker');
    const rawImage = match[1].split('/').pop()?.split(':')[0]?.toLowerCase() || '';
    const baseName = rawImage.replace(/-(alpine|slim|bullseye|bookworm).*$/, '');
    add(PACKAGE_TO_ID[rawImage] || PACKAGE_TO_ID[baseName] || aliasToId.get(baseName));
  }

  // 3. Line-based package extraction (requirements.txt, pyproject.toml, Cargo.toml, go.mod, Gemfile)
  const lines = trimmed.split(/\r?\n/);
  for (const line of lines) {
    const clean = line.replace(/#.*$/, '').trim();
    if (!clean) continue;

    // go.mod module path
    const goMatch = clean.match(/([a-z0-9.-]+\/[a-z0-9._/-]+)/i);
    if (goMatch) {
      const mod = goMatch[1].toLowerCase();
      for (const [pkg, id] of Object.entries(PACKAGE_TO_ID)) {
        if (pkg.includes('/') && mod.startsWith(pkg)) add(id);
      }
    }

    // Quoted or bare package name at start of line / assignment
    const tokenMatch = clean.match(/^(?:gem\s+)?["']?([@a-z0-9_.-]+(?:\/[a-z0-9_.-]+)?)["']?/i);
    if (tokenMatch) {
      const tok = tokenMatch[1].toLowerCase();
      add(PACKAGE_TO_ID[tok] || aliasToId.get(tok));
    }
  }

  return found;
}
