const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const User = mongoose.model("User");
const Post = mongoose.model("Post");

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .select("-password2")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, post) => {
          if (err) {
            return res.status(400).json({ error: err });
          }
          res.json({ user, post });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User Not Found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .select("-password2")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .select("-password2")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true }
  )
    .select("-password")
    .select("-password2")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      res.json(result);
    });
});

router.put("/updatebio", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { bio: req.body.bio } },
    { new: true }
  )
    .select("-password")
    .select("-password2")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      res.json(result);
    });
});

router.post("/searchuser", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ name: { $regex: userPattern } })
    .select("_id name pic")
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
