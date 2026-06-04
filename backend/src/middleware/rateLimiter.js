import rateLimit from 'express-rate-limit';

export const chatLimiter = rateLimit({ windowMs: 60_000, max: 20 });
export const ingestLimiter = rateLimit({ windowMs: 60_000, max: 5 });
