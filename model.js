const mongoose = require("mongoose");
const ShortUniqueId = require("short-unique-id");

mongoose
  .connect("mongodb://localhost:27017/polly")
  .then(() => {
    console.log("Successfully Connected to MongoDB Polly 🚀🚀");
  })
  .catch(err => {
    console.log("Database Connection error ", err);
  });

const userSchema = new mongoose.Schema({
  username: String,
  polls: Array
});

// TODO: Implement image schema and figure out how Mongo works with references
// const imageSchema = new mongoose.Schema({
//   image_url: String,
//   votes: Number,
//   names: Array
// });

const pollSchema = new mongoose.Schema({
  shortUrl: String,
  images: Array,
  // images: [imageSchema], /* this is part of the Mongo reference - see above */
  title: String,
  description: String,
  published_at: Date,
  user_id: String
});

const User = mongoose.model("User", userSchema);
const Poll = mongoose.model("Poll", pollSchema);
// const Image = mongoose.model("Image", imageSchema); /* Mongo reference */

// Todo: refactor to async await for consistency,
//  find commented out code at the end of file. And dont forget 'return await' again!!!
exports.createUser = username => {
  return new Promise((resolve, reject) => {
    const user = new User({
      polls: [],
      username: username
    });
    user.save((err, user) => {
      if (err) {
        console.log("User could not be saved");
        reject(err);
      }
      console.log("User saved: ", user);
      resolve(user);
    });
  });
};

// Todo: refactor to async await for consistency, commented code at the end of file
exports.createPoll = pollData => {
  return new Promise((resolve, reject) => {
    const shortUrl = new ShortUniqueId().randomUUID(5).toLowerCase();

    const poll = new Poll({
      shortUrl,
      images: pollData.images,
      title: pollData.title,
      description: pollData.description,
      user_id: pollData.user_id,
      published_at: Date.now()
    });

    poll.save(async (err, poll) => {
      if (err) {
        console.log("Poll not saved, error: ", err);
        return err;
      }
      const query = { _id: poll.user_id };
      await User.findOneAndUpdate(query, { $push: { polls: poll._id } }).then(
        () => {
          console.log("Poll saved: ", poll);
          resolve(poll);
        }
      );
    });
  });
};

exports.getPoll = async shortUrl => {
  try {
    return Poll.findOne({ shortUrl: shortUrl });
  } catch (err) {
    console.log("Poll not found");
    return err;
  }
};

// Todo: figure out how to query and update nested arrays directly
//  and avoid Poll.findOne(...)
exports.vote = async (shortUrl, voteObj) => {
  try {
    const poll = await Poll.findOne({ shortUrl: shortUrl });
    const imageIndex = poll.images.findIndex(
      obj => obj.image_id === voteObj.image_id
    );
    const query = poll._id;
    poll.images[imageIndex] = voteObj;
    return await Poll.findByIdAndUpdate(query, { images: poll.images }).then(
      doc => {
        console.log("saved doc ", doc);
        return doc;
      }
    );
  } catch (err) {
    console.log("saving vote did not work", err);
    return err;
  }
};

exports.getUser = async user_id => {
  try {
    console.log("this is the model ", user_id);
    return await User.findOne({ _id: user_id });
  } catch (err) {
    console.log("User not found");
    return err;
  }
};

exports.getUserPolls = async user_id => {
  try {
    return await Poll.find({ user_id: user_id });
  } catch (err) {
    console.log("UserPolls not found");
    return err;
  }
};

//   try {
//     const user = new User({
//       polls: [],
//       username: username
//     });
//     await user.save().then(user => {
//       console.log("User created, ", user);
//       return user;
//     });
//   } catch (err) {
//     console.log("Creating User failed", err);
//   }
// };

// async pollData => {
// // {images, title, description, user_id } = pollData;
// try {
//   const shortUrl = new ShortUniqueId().randomUUID(5).toLowerCase();
//
//   const poll = new Poll({
//     shortUrl,
//     images: pollData.images,
//     title: pollData.title,
//     description: pollData.description,
//     user_id: pollData.user_id,
//     published_at: Date.now()
//   });
//
//   await poll.save(async (err, doc) => {
//     if (err) {
//       return console.log("Poll not saved, error: ", err);
//     }
//     const query = { _id: doc.user_id };
//     await User.findOneAndUpdate(query, { $push: { polls: poll._id } });
//     console.log("Poll saved: ", doc);
//     return doc;
//   });
// } catch (err) {
//   console.log("Creating Poll failed", err);
// }
// };
