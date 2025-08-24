import type { PackResult } from '../types.js';
import { RequestCache } from './cache.js';
import { RateLimiter } from './rateLimit.js';

// Create shared instances
export const cache = new RequestCache<PackResult>(180); // 3 minutes cache
export const rateLimiter = new RateLimiter(60_000, process.env.NODE_ENV === 'development' ? 10 : 3); // 10 requests per minute in dev, 3 in production
