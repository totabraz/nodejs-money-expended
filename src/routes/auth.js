const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Validation
const { registerValidation, loginValidation } = require("../schema/users");

router.post("/register", async (req, res) => {
  // Validating data
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error?.details?.[0]?.message });
  }

  // Checking if email exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send({ message: "email all ready exist" });
  }

  // HASHing the password
  const salt = bcrypt.getSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error to register" });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ message: "Email or password is wrong" });
  }

  // Validating data
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error?.details?.[0]?.message });
  }

  // Validating password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send({ message: "Email or password is wrong" });
  }

  // Create and assign a token
  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.TOKEN_SECRET,
    { expiresIn: "30d" }
  );
  res.header("auth-token", token).send(token);
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

module.exports = router;
