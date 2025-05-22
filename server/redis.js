import _ from "lodash";
import { client, isRedisConnected } from "./redisCommon.js";

const _setKey = async ({ key, value }) => {
  await client.set(key, value);
  await client.expire(key, 24 * 60 * 60); // expire after 1d
};

const putJson = async ({ key, jsonVal }) => {
  try {
    // eslint-disable-next-line
    jsonVal.timestamp = Date.now();
    await _setKey({ key, value: JSON.stringify(jsonVal) });
  } catch (err) {
    console.log("Error setting JSON in Redis:", err);
    return null;
  }
};

const getJson = async (key) => {
  try {
    const jsonStr = await client.get(key);
    if (!jsonStr) {
      return null;
    }
    const result = JSON.parse(jsonStr);
    return result;
  } catch (err) {
    console.error("Error parsing JSON from Redis:", err);
    return null;
  }
};

const getSingleValue = async (key) => {
  const jsonObj = await getJson(key);
  return _.get(jsonObj, "val");
};

const putSingleValue = async (key, val) => {
  await putJson({ key, jsonVal: { val } });
};

const initSettingValue = async (key, val) => {
  const currentVal = await getSingleValue(key);
  if (!currentVal) {
    await putSingleValue(key, val);
  }
};

const deleteKey = async (key) => client.del(key);
const expireKey = async (key, seconds) => {
  if (!isRedisConnected()) {
    return;
  }
  await client.expire(key, seconds || 5 * 60);
};

export default {
  putJson,
  getJson,
  initSettingValue,
  getSingleValue,
  putSingleValue,
  isRedisConnected,
  deleteKey,
  client,
  expireKey,
};
