"use strict";

const db = require("../db");
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const { BadRequestError } = require("../expressError");

const Router = require("express").Router;
const router = new Router();

/** POST /login: {username, password} => {token} */
router.post("/login", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    if (await User.authenticate(username, password)) {
      await User.updateLoginTimestamp(username);
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token });
    }
    throw new BadRequestError();
  } catch (err) {
    return next(err);
  }
})

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */
router.post("/register", async function (req, res, next) {
  try {
    await User.register(req.body);
    const token = jwt.sign({ username: req.body.username }, SECRET_KEY);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
})

module.exports = router;