const Koa = require("koa");
const cors = require("koa-cors");
const bodyParser = require("koa-bodyparser");
const router = require("./router");

const app = new Koa();

app.use(cors());
app.use(bodyParser());
app.use(router.routes());

app.listen(3000, err => {
  if (err)
    return console.log(
      "The current error occurs during the connection: 🧨",
      err
    );
  console.log("Server running on port 3000! 🚀");
});
