const { redisClient } = require("../config/redisClient");

const cacheMiddleware = (keyPrefix) => async (req, res, next) => {
  const userId = req.user.id;
  const cacheKey = `${keyPrefix}:${userId}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit!");
      return res.status(200).json(JSON.parse(cachedData));
    }
    console.log("Cache miss!");
    res.locals.cacheKey = cacheKey;
    next();
  } catch (err) {
    console.error("Redis error in cache middleware:", err);
    next();
  }
};

module.exports = { cacheMiddleware };
