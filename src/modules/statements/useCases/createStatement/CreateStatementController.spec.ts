import request from "supertest"
import { hash } from "bcryptjs";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import { v4 as uuidV4 } from "uuid";


import createConnection from "../../../../database/index";

let connection: Connection

describe("Create statement controller", () => {
  beforeAll(async() => {
    connection = await createConnection()
    await connection.runMigrations()

    const id = uuidV4();
    const password = await hash("123456", 8);

    await connection.query(`INSERT INTO USERS (id, name, email, password, created_at, updated_at) VALUES ('${id}', 'Iago', 'iagoaap@outlook.com', '${password}', 'now()', 'now()')`)
  })

  it("should be able to make a deposit", async () => {
    const auth = await request(app).post("/api/v1/sessions").send({
      email: "iagoaap@outlook.com",
      password: "123456"
    })

    const token  = auth.body.token;

    const res = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: "100",
      description: "Depósito de 100 reais"
    })
    .set({ Authorization: `Bearer ${token}` })

    expect(res.status).toBe(201)
    expect(res.body.amount).toEqual("100")
    expect(res.body.description).toEqual("Depósito de 100 reais")
  })

  it("should be able to make a withdraw", async () => {
    const auth = await request(app).post("/api/v1/sessions").send({
      email: "iagoaap@outlook.com",
      password: "123456"
    })

    const token  = auth.body.token;

    await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Depósito de 100 reais"
    })
    .set({ Authorization: `Bearer ${token}` })

    const res = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 50,
      description: "Saque de 50 reais"
    })
    .set({ Authorization: `Bearer ${token}` })

    expect(res.status).toBe(201)
    expect(res.body.amount).toEqual(50)
    expect(res.body.description).toEqual("Saque de 50 reais")
  })

  it("should not be able to withdraw with insufficient funds", async () => {
    const auth = await request(app).post("/api/v1/sessions").send({
      email: "iagoaap@outlook.com",
      password: "123456"
    })

    const token  = auth.body.token;

    await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Depósito de 100 reais"
    })
    .set({ Authorization: `Bearer ${token}` })

    const balance = await request(app).get("/api/v1/statements/balance")
    .set({ Authorization: `Bearer ${token}` })

    console.log(balance.body)

    const res = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 900,
      description: "Saque inválido"
    })
    .set({ Authorization: `Bearer ${token}` })
    expect(res.status).toBe(400)
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
})
