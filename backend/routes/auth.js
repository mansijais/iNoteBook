const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');  //EXPRESS VALIDATOR PACKAGE
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser')
const JWT_SECRET = "yovro!"   //for jwt token, used at line 41    

//ROUTE 1:Create a user with POST "/api/auth/createUser".(No login required)
router.post('/createUser', [
  body('name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password').isLength({ min: 5 }),
], async (req, res) => {
  let success = false;
  // if there are errors, return bad request and the errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  //check whether the user with email already exists
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ success, error: "sorry a user with same email already exists" })
    }
    // create a user
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
})

//ROUTE 2:Authenticate a user with POST "/api/auth/login".No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Passwords can not be blank').exists(),
], async (req, res) => {
  let success = false;
  // if there are errors, return bad request and the errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;  //destructuring
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Please try with correct credentials" })

    }
    const comparePass = await bcrypt.compare(password, user.password)
    if (!comparePass) {
      success = false;
      return res.status(400).json({ success, error: "Please try with correct credentials" })
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
})

//ROUTE 3:Get logged in user details with POST "/api/auth/getUser".Login required
router.post('/getUser', fetchUser, async (req, res) => {
  try {
   var userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
})
module.exports = router;