import request from "supertest";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";
import { Connection } from "typeorm";
import createConnection from "../../../../database";

import { app } from "../../../../app";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const passsword = await hash("12345", 8);

    await connection.query(
      `INSERT INTO users (id, name, email, password, created_at, updated_at)
            VALUES ('${id}', 'Lorenzo Marcelo', 'lorenzo@gmail.com', '${passsword}', now(), now())`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a deposit", async () => {
    const user = await request(app).post("/api/v1/sessions").send({
      email: "lorenzo@gmail.com",
      password: "12345",
    });

    const { token } = user.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 400,
        description: "income",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("description", "income");
    expect(response.body).toHaveProperty("amount", 400);
    expect(response.body).toHaveProperty("type", "deposit");
    expect(response.body).toHaveProperty("created_at");
    expect(response.body).toHaveProperty("updated_at");
  });

  it("should be able to create a withdraw", async () => {
    const user = await request(app).post("/api/v1/sessions").send({
      email: "lorenzo@gmail.com",
      password: "12345",
    });

    const token = user.body.token;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 200,
        description: "rental",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("description", "rental");
    expect(response.body).toHaveProperty("amount", 200);
    expect(response.body).toHaveProperty("type", "withdraw");
    expect(response.body).toHaveProperty("created_at");
    expect(response.body).toHaveProperty("updated_at");
  });

  it("should not be able to create a withdraw with insufficient funds", async () => {
    const user = await request(app).post("/api/v1/sessions").send({
      email: "lorenzo@gmail.com",
      password: "12345",
    });

    const token = user.body.token;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 500,
        description: "rental",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient funds");
  });

  it("should not be able to create statement from nonexistent user", async () => {
    const authResponse = await request(app).post("/api/v1/sessions").send({
      email: "lorenzo@gmail.com",
      password: "12345",
    });

    const { token, user } = authResponse.body;

    await connection.query(`DELETE FROM users WHERE id = '${user.id}'`);

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 400,
        description: "income",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
  });
});
