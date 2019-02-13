// TODO: Implement Authorisation

const monk = require("monk");
const db = monk("localhost:27017/polly");
const User = db.get("users");

const authorize = async (ctx, next) => {
  const [strategy, token] = ctx.headers.authorization.split(" ");
  if (strategy === "Bearer") {
    const user = await User.findOne({ auth_token: token });
    ctx.user = user;
  }

  if (!ctx.user) {
    ctx.status = 401;
    return;
  }

  await next();
};

module.exports = authorize;
