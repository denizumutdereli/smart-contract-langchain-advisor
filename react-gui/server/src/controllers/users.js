const User = require("../models/user");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;

const { v4: uuidv4 } = require("uuid");

module.exports = {
  signup,
  login,
  testServer,
};

async function signup(req, res) {
  const user = new User(req.body);

  try {
    await user.save();
    const token = createJWT(user); 
    res.json({ token });
  } catch (err) {
    console.log("===============================");
    console.log(err, " <- error during database saving");
    console.log("===============================");
    res.status(400).json({
      error: "Error during database saving, check your console",
    });
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(401).json({ err: "bad credentials" });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch) {
        const token = createJWT(user);
        res.json({ token });
      } else {
        return res.status(401).json({ err: "bad credentials" });
      }
    });
  } catch (err) {
    return res.status(401).json(err);
  }
}

async function testServer(req, res) {
  res.status(200).json({ message: "server is running" });
}

function createJWT(user) {
  return jwt.sign(
    { user },
    SECRET,
    { expiresIn: "24h" }
  );
}
