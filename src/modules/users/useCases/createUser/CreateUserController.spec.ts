import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/index";

let connection: Connection

describe("Create user controller", () => {
  beforeEach(async() => {
    connection = await createConnection()
    await connection.runMigrations()

  })
  it("should be able to create a new user", async() => {
    const response = await request(app).
    post("/api/v1/users").send({
      name: "Iago Alexandre",
      email: "iagoaap@gmail.com",
      password: "123456"
    })

    expect(response.status).toBe(201);
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })
})
