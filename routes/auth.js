const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const requireLogin = require("../middleware/requireLogin");
const { SENDGRID_API, EMAIL } = require("../config/keys");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API,
    },
  })
);

router.post("/resetpassword", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "Please Check Email No User Exists with that Email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 1800000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "rs8instagram@gmail.com",
          subject: "Reset Password",
          html: `
                    <p>You Requested for Reset Password </p>
                    <h4>click on this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h4>
                    `,
        });
        res.json({ message: "Reset Password Link Shared Check Your Mailbox" });
      });
    });
  });
});

router.post("/newpassword", (req, res) => {
  const newpassword = req.body.password;
  const newpassword2 = req.body.password2;
  const token = req.body.token;

  if (!newpassword || !newpassword2) {
    return res.status(422).json({ error: "Please add all the Fields" });
  }
  if (newpassword != newpassword2) {
    return res.status(400).json({ error: "Please enter same Password" });
  }

  User.findOne({ resetToken: token, expireToken: { $gt: Date.now() } }).then(
    (user) => {
      if (!user) {
        return res.status(422).json({ error: "Session Expired Try Again" });
      }
      bcrypt
        .hash(newpassword, 16)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.password2 = hashedPassword;
          user.resetToken = undefined;
          user.expireToken = undefined;
          user.save().then((saveduser) => {
            res.json({ message: "Password Updated Successfully" });
            transporter.sendMail({
              to: user.email,
              from: "rs8instagram@gmail.com",
              subject: "Password Update",
              html: "<h1>Your Password has been updated Successfully</h1>",
            });
          });
        })
        .catch((err) => console.log(err));
    }
  );
});

router.post("/updatepassword", requireLogin, (req, res) => {
  const updatepassword = req.body.password;
  const updatepassword2 = req.body.password2;

  if (!updatepassword || !updatepassword2) {
    return res.status(422).json({ error: "Please add all the Fields" });
  }
  if (updatepassword != updatepassword2) {
    return res.status(400).json({ error: "Please enter same Password" });
  }

  User.findOne({ _id: req.user._id }).then((user) => {
    if (!user) {
      return res.status(422).json({ error: "Please Login Again" });
    }
    bcrypt
      .hash(updatepassword, 16)
      .then((hashedPassword) => {
        (user.password = hashedPassword), (user.password2 = hashedPassword);
        user.save().then((saveduser) => {
          res.json({ message: "Password Updated Successfully" });
          transporter.sendMail({
            to: user.email,
            from: "rs8instagram@gmail.com",
            subject: "Password Update",
            html: "<h1>Your Password has been updated Successfully</h1>",
          });
        });
      })
      .catch((err) => console.log(err));
  });
});

router.post("/signup", (req, res) => {
  const { name, email, password, password2, pic, bio } = req.body;

  if (!email || !name || !password || !password2) {
    return res.status(422).json({ error: "Please add all the Fields" });
  }
  if (password != password2) {
    return res.status(400).json({ error: "Please enter same Password" });
  }

  User.findOne({ name: name })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User Already Exists with that Name" });
      }

      User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
          return res
            .status(422)
            .json({ error: "User Already Exists with that Email" });
        }

        bcrypt.hash(password, 16).then((hashedPassword) => {
          const user = new User({
            email,
            name,
            password: hashedPassword,
            password2: hashedPassword,
            pic,
            bio,
          });

          user
            .save()
            .then((user) => {
              transporter.sendMail({
                to: user.email,
                from: "rs8instagram@gmail.com",
                subject: "Signup Successfully",
                html: "<h1>Welcome to Instagram</h1>",
              });
              res.json({ message: "Signup Successfully now you can Login" });
            })
            .catch((err) => console.error(err));
        });
      });
    })

    .catch((err) => console.error(err));
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please add Email or Password" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const {
              _id,
              name,
              email,
              pic,
              bio,
              followers,
              following,
            } = savedUser;
            res.json({
              token,
              user: { _id, name, email, pic, bio, followers, following },
            });
          } else {
            return res.status(422).json({ error: "Invalid Credentials" });
          }
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
});

module.exports = router;
