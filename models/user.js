const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  password2: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/dsicbm1ar/image/upload/v1604643472/LOGIN-10-512_r6no5l.png",
  },
  bio: {
    type: String,
    default: " ",
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
  resetToken: String,
  expireToken: Date,
});

mongoose.model("User", userSchema);
