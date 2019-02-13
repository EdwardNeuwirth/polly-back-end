const Router = require("koa-router");
const router = new Router();
const authMiddleware = require("./middlewares/authorization");
const controller = require("./controller");

router.get("/getUser", controller.getUser);
router.get("/getUserPolls/:id", controller.getUserPolls);

router.post("/createUser", controller.createUser);
router.post("/createPoll", controller.createPoll);

router.post("/vote/:id", controller.vote); // place vote based on shortUrl
router.get("/poll/:id", controller.getPoll); // get poll based on shortUrl
// 404
router.get("*", ctx => {
  ctx.status = 404;
  ctx.body = "<h1>Sorry, this URL does not exist</h1>";
});

module.exports = router;
