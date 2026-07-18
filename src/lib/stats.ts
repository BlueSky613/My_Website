// Server-only stats store: Upstash Redis on Vercel, JSON file locally.
//
// Keeps two global counters — total site visits and total downloads.
// On Vercel the filesystem is ephemeral, so Redis is required in production.
// Locally, falls back to .data/stats.json when Redis env vars are not set.

import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";

export type Stats = {
  visits: number;
  downloads: number;
};

const VISITS_KEY = "portfolio:stats:visits";
const DOWNLOADS_KEY = "portfolio:stats:downloads";

const DATA_DIR = process.env.STATS_DIR || path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "stats.json");

const EMPTY: Stats = { visits: 0, downloads: 0 };

let redisClient: Redis | null | undefined;
let writeLock: Promise<unknown> = Promise.resolve();

export function isRedisConfigured(): boolean {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return Boolean(url && token);
}

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;

  if (!isRedisConfigured()) {
    redisClient = null;
    if (process.env.VERCEL) {
      console.warn(
        "[stats] Upstash Redis is not configured on Vercel. " +
          "Visit/download counts will not persist. " +
          "Add the Upstash Redis integration and set UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN."
      );
    }
    return null;
  }

  redisClient = Redis.fromEnv();
  return redisClient;
}

function toCount(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

async function readFromFile(): Promise<Stats> {
  try {
    const text = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(text) as Partial<Stats>;
    return {
      visits: toCount(parsed.visits),
      downloads: toCount(parsed.downloads),
    };
  } catch {
    return { ...EMPTY };
  }
}

async function writeToFile(stats: Stats): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(stats), "utf8");
}

async function readFromRedis(redis: Redis): Promise<Stats> {
  const [visits, downloads] = await Promise.all([
    redis.get<number>(VISITS_KEY),
    redis.get<number>(DOWNLOADS_KEY),
  ]);
  return {
    visits: toCount(visits),
    downloads: toCount(downloads),
  };
}

export async function readStats(): Promise<Stats> {
  try {
    const redis = getRedis();
    if (redis) return await readFromRedis(redis);
    // On Vercel the filesystem is read-only — never touch disk without Redis.
    if (process.env.VERCEL) return { ...EMPTY };
    return await readFromFile();
  } catch (err) {
    console.error("[stats] readStats failed:", err);
    return { ...EMPTY };
  }
}

async function incrementInRedis(
  redis: Redis,
  field: keyof Stats
): Promise<Stats> {
  const key = field === "visits" ? VISITS_KEY : DOWNLOADS_KEY;
  const otherKey = field === "visits" ? DOWNLOADS_KEY : VISITS_KEY;

  const updated = await redis.incr(key);
  const other = await redis.get<number>(otherKey);

  return field === "visits"
    ? { visits: toCount(updated), downloads: toCount(other) }
    : { visits: toCount(other), downloads: toCount(updated) };
}

async function incrementInFile(field: keyof Stats): Promise<Stats> {
  const run = writeLock.then(async () => {
    const current = await readFromFile();
    const next: Stats = { ...current, [field]: current[field] + 1 };
    await writeToFile(next);
    return next;
  });
  writeLock = run.catch(() => undefined);
  return run;
}

async function increment(field: keyof Stats): Promise<Stats> {
  try {
    const redis = getRedis();
    if (redis) return await incrementInRedis(redis, field);
    if (process.env.VERCEL) {
      // Avoid EROFS on the serverless read-only filesystem.
      return { ...EMPTY };
    }
    return await incrementInFile(field);
  } catch (err) {
    console.error(`[stats] increment(${field}) failed:`, err);
    return { ...EMPTY };
  }
}

export function incrementVisits(): Promise<Stats> {
  return increment("visits");
}

export function incrementDownloads(): Promise<Stats> {
  return increment("downloads");
}
