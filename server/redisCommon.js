import redis from "redis";
let client = null;

let connected = false;
const _setupRedis = async () => {
  client = redis.createClient({
    url: `redis://localhost:8000/6379`,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 20) {
          return new Error("Too many retries for redis connection");
        }
        return retries * 500;
      },
      connectTimeout: 10000, // timeout after 10s
    },
  });
  client.on("error", function (err) {
    const message = `error connectting redis. ${err.stack}`;
    console.log(message);
    connected = false;
  });
  client.on("ready", () => {
    console.log("connected to redis and ready");
    connected = true;
  });
  client.connect().then(() => console.log("start connect to redis"));
};

_setupRedis();

const isRedisConnected = () => {
  return connected;
};

export { client, isRedisConnected };
