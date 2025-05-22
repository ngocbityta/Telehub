import _ from "lodash";
import Group from "../models/group.model.js";
import redisClient from "../redis.js";

const userCacheKey = `userJSON_`;

const getGroupsWithCache = async ({ userId }) => {
  const key = `${userCacheKey}_${userId}`;

  if (redisClient.isRedisConnected()) {
    const groupsVal = await redisClient.getJson(key);
    const groups = _.get(groupsVal, "groups");
    if (!_.isEmpty(groups)) {
      return groups;
    }
  }

  const groups = await Group.find({ owner: userId }).populate("members");
  if (!groups) {
    return null;
  }

  const groupJSONs = _.map(groups, (group) => group.toJSON());

  if (redisClient.isRedisConnected()) {
    await redisClient.putJson({ key, jsonVal: { groups: groupJSONs } });
    await redisClient.expireKey(key, 7200); // 2 giờ
  }

  return groupJSONs;
};

export {
  getGroupsWithCache,
};
