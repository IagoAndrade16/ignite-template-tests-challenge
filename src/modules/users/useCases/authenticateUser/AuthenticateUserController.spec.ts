import request from "supertest"
import { hash } from "bcryptjs";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import { v4 as uuidV4 } from "uuid";


import createConnection from "../../../../database/index";

let connection: Connection

describe("Authenticate user", () => {
  beforeEach(async() => {
    connection = await createConnection()
    await connection.runMigrations()

    const id = uuidV4();
    const password = await hash("123456", 8);

    await connection.query(`INSERT INTO USERS (id, name, email, password, created_at, updated_at) VALUES ('${id}', 'Iago', 'iagoaap@outlook.com', '${password}', 'now()', 'now()')`)
  })

  it("should be able to authenticate user", async () => {
    const res = await request(app).post("/api/v1/sessions").send({
      email: "iagoaap@outlook.com",
      password: "123456"
    })

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
})
