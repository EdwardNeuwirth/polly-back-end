const Model = require("./model");

exports.createUser = async ctx => {
  // const userData = JSON.parse(ctx.request.body);
  const userData = ctx.request.body;
  try {
    console.log("controller getUser");
    ctx.body = await Model.createUser(userData.username);
    ctx.status = 201;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err };
  }
};

exports.createPoll = async ctx => {
  const pollData = ctx.request.body;
  try {
    ctx.body = await Model.createPoll(pollData);

    ctx.status = 201;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err };
  }
};

exports.getUser = async ctx => {
  const _id = ctx.request.body._id;
  try {
    ctx.status = 200;
    ctx.body = await Model.getUser(_id);
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err };
  }
};

exports.getUserPolls = async ctx => {
  const _id = ctx.params.id;
  try {
    ctx.body = await Model.getUserPolls(_id);
    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err };
  }
};

exports.getPoll = async ctx => {
  try {
    console.log(ctx.params.id);
    ctx.body = await Model.getPoll(ctx.params.id);
    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err };
  }
};

exports.vote = async ctx => {
  try {
    ctx.body = await Model.vote(ctx.params.id, ctx.request.body);
    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err };
  }
};
