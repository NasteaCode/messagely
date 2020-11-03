"use strict";

const request = require("supertest");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");

let u1Token;
let u2Token;
let u1;
let u2;
describe("Test User Routes", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");

    u1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155550000",
    });
    u1Token = jwt.sign({ username: "test1" }, SECRET_KEY);

    u2 = await User.register({
      username: "test2",
      password: "password",
      first_name: "Test2",
      last_name: "Testy2",
      phone: "+5555555555",
    });
    u2Token = jwt.sign({ username: "test2" }, SECRET_KEY);

  });


  describe(" / GET all users", function () {
    test("should work when logged in", async function () {
      const response = await request(app).get("/users/").send({
        _token: u1Token
      });
      const userList = response.body;
      expect(userList).toEqual({
        users: [
          {
            username: u1.username,
            first_name: u1.first_name,
            last_name: u1.last_name
          },
          {
            username: u2.username,
            first_name: u2.first_name,
            last_name: u2.last_name
          }
        ]
      });
    });
    test("not logged in, should fail", async function () {
      const response = await request(app).get("/users/");
      const status = response.status;
      expect(status).toEqual(401);
    });

  });

  xdescribe("/:username GET user details", function () {
    test();

  });

});
