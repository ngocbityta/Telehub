import _ from "lodash";
import User from "../../models";
import redisClient from "../redis.js";

const userCacheKey = `userJSON_`;

const getUserWithCache = async ({ userId }) => {
  const key = `${userCacheKey}_${userId}`;

  if (redisClient.isRedisConnected()) {
    const userVal = await redisClient.getJson(key);
    const user = _.get(userVal, "user");
    if (!_.isEmpty(user)) {
      return user;
    }
  }

  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  const userJSON = user.toJSON();
  if (redisClient.isRedisConnected()) {
    await redisClient.putJson({ key, jsonVal: { user: userJSON } });
    await redisClient.expireKey(key, 7200);
  }
  return userJSON;
};

module.exports = {
  getUserWithCache,
};
