import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  console.log("verifying JWTs");
  // extracing token from header
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const tokenInAuthHeader = authHeader?.split(" ")[1];

  const tokenInBearerHeader = req.headers["bearer"];

  if (!tokenInAuthHeader && !tokenInBearerHeader) {
    console.log("No JWT");
    return res.status(401).send("No authorization header");
  }
  jwt.verify(
    tokenInAuthHeader || tokenInBearerHeader,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).send("Error verifying JWTs");
      }
      req.username = decoded.UserInfo.username;
      req.userId = decoded.UserInfo.userId;
      console.log("JWT Verified");
      next();
    }
  );
};

export default verifyJWT;
