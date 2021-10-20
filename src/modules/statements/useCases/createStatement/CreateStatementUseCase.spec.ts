import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Post statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to do a deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "Marcelo Marçal",
      email: "marcelo@gmail.com",
      password: "12345",
    });

    const result = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 4000,
      description: "income",
      type: "deposit" as OperationType,
    });

    expect(result).toEqual(
      expect.objectContaining({
        user_id: result.user_id,
        amount: result.amount,
        description: result.description,
        type: result.type,
      })
    );
  });

  it("Should be able to do a withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "Marcelo Marçal",
      email: "marcelo@gmail.com",
      password: "12345",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 4000,
      description: "income",
      type: "deposit" as OperationType,
    });

    const result = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 2000,
      description: "rental",
      type: "withdraw" as OperationType,
    });

    expect(result).toEqual(
      expect.objectContaining({
        user_id: result.user_id,
        amount: result.amount,
        description: result.description,
        type: result.type,
      })
    );
  });

  it("Should not be able to do a statement with nonexistent user", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "16161651651465161",
        amount: 2000,
        description: "rental",
        type: "withdraw" as OperationType,
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("Should not be able to do a withdraw with insufficient fund", async () => {
    const user = await createUserUseCase.execute({
      name: "Marcelo Marçal",
      email: "marcelo@gmail.com",
      password: "12345",
    });

    await expect(
      createStatementUseCase.execute({
        user_id: user.id,
        amount: 2000,
        description: "rental",
        type: "withdraw" as OperationType,
      })
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });
});
