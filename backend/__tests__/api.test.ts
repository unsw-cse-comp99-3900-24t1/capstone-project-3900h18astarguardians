import request from "supertest";
import app from "../app";

import { config } from "dotenv";
import mongoose from "mongoose";

const { MONGO_URI } = process.env;

// connect to db
beforeEach(async () => {
  await mongoose.connect(MONGO_URI as string);
});

describe("successfully register and login user", () => {
  it("should successfully login", async () => {
    const credentials = { email: "m.arsalah003@gmail.com" };
    const res = await request(app).post("/api/v1/auth/login").send(credentials);
    expect(res.statusCode).toBe(200);
    console.log(res.body);
  });
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});
