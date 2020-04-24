const request = require("supertest");
const server = require("./server.js");
const db = require("../database/dbConfig");

describe("server", function () {
  describe("GET status /", function () {
    it("should return 200 OK", function () {
      // make a GET request to / endpoint on the server
      return request(server) // return the async call to let jest know it should wait
        .get("/")
        .then((res) => {
          // assert that the HTTP status code is 200
          expect(res.status).toBe(200);
        });
    });
  });

  describe("GET response /", function () {
    it("should return 'up'", function () {
      return request(server)
        .get("/")
        .then((res) => {
          expect(res.body.api).toBe("up");
        });
    });
  });
});

describe("server register", function () {
  beforeEach(async () => {
    await db("users").truncate();
  });
  describe("post success status /register", function () {
    it("return 201 on success", function () {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "gavin", password: "gavin" })
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });
  });

  describe("user created status /register", function () {
    it("registered a new user", async function () {
      const existing = await db("users");

      await request(server)
        .post("/api/auth/register")
        .send({ username: "gavin", password: "gavin" })
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });

    it("returns the user information", async function () {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "gavin", password: "gavin" })
        .then((res) => {
          expect(res.body.username).toBe("gavin");
        });
    });
  });
});

describe("server login", function () {
  describe("login success", function () {
    it("should return 200 on success", function () {
      return request(server)
        .post("/api/auth/login")
        .send({ username: "gavin", password: "gavin" })
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });
  });
  describe("login success message", function () {
    it("should welcome user in response", function () {
        return request(server)
        .post("/api/auth/login")
        .send({ username: "gavin", password: "gavin" })
        .then((res) => {
          expect(res.body.message).toBe("Welcome gavin");
        });
    });
  });
});
