// Define a Map to store tokens for each IP address
const tokenBucketMap = new Map();

// Middleware function to enforce rate limiting
export async function middleware (req, res) {
    const ip = req.headers.get("x-forwarded-for");

  // Check if token bucket exists for the IP address
  if (!tokenBucketMap.has(ip)) {
    // If token bucket doesn't exist, create one with initial tokens
    tokenBucketMap.set(ip, {
      tokens: 5, // Initial number of tokens
      lastRefillTime: Date.now(), // Last time tokens were refilled
    });
  }

  const tokenBucket = tokenBucketMap.get(ip);
  const now = Date.now();
  const elapsedTime = now - tokenBucket.lastRefillTime;

  // Refill tokens based on elapsed time
  const refillAmount = Math.floor(elapsedTime / 10000) * 1; // Refill 5 second per token
  tokenBucket.tokens = Math.min(tokenBucket.tokens + refillAmount, 5); // Cap tokens at 5

  // Check if tokens are available
  if (tokenBucket.tokens >= 1) {
    // Consume one token
    tokenBucket.tokens--;
    tokenBucketMap.set(ip, tokenBucket);
    // Proceed to the actual request handler
    return handler(req, res);
  } else {
    // If no tokens available, return error response
    res.status(429).json({ error: 'Rate limit exceeded' });
  }
};
