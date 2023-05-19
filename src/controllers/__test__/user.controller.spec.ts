import { Test } from "@nestjs/testing";
import { UserService } from "src/services/user.service";
import { UserController } from "src/controllers/user.controller";
import { User } from "src/entities/user.entity";

describe("UserController", () => {
  let controller: UserController;
  let service: UserService;

  const singleUser = {
    id: 1,
    username: "rapidx",
    password: "rapidx",
  } as User;

  const multipleUsers = [
    {
      id: 1,
      username: "rapidx",
      password: "rapidx",
    },
  ] as User[];

  beforeEach(async () => {
    const mockService = {
      fetchAll: () => Promise.resolve(multipleUsers),
      fetchOne: (id: number) => Promise.resolve(singleUser),
      create: (user: User) => Promise.resolve(user),
      delete: (id: number) => Promise.resolve(singleUser),
      update: (id: number, user: Partial<User>) => Promise.resolve(user),
    };

    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get(UserController);
    service = module.get(UserService);
  });

  describe("fetchAll", () => {
    it("should fetch all users", async () => {
      const users = await controller.fetchAll();
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe("fetchOne", () => {
    it("should throw not found exception for the given id", async () => {
      service.fetchOne = (id: number) => Promise.resolve(null);
      await expect(controller.fetchOne("1")).rejects.toThrow();
    });

    it("should return one user for the given id", async () => {
      const user = await controller.fetchOne("1");
      expect(user.username).toEqual(singleUser.username);
      expect(user.password).toEqual(singleUser.password);
    });
  });

  describe("Create user", () => {
    it("should create a user", async () => {
      const user = await controller.create(singleUser);
      expect(user.username).toEqual(singleUser.username);
      expect(user.password).toEqual(singleUser.password);
    });
  });

  describe("Update user", () => {
    it("should throw not found exception for the given id", async () => {
      service.update = (id: number, user: Partial<User>) => Promise.resolve(null);
      await expect(controller.update("1", singleUser)).rejects.toThrow();
    });

    it("should return one user for the given id", async () => {
      const user = await controller.update("1", singleUser);
      expect(user.username).toEqual(singleUser.username);
      expect(user.password).toEqual(singleUser.password);
    });
  });

  describe("Delete user", () => {
    it("should throw not found exception for the given id", async () => {
      service.delete = (id: number) => Promise.resolve(null);
      await expect(controller.delete("1")).rejects.toThrow();
    });

    it("should return one user for the given id", async () => {
      const user = await controller.delete("1");
      expect(user.username).toEqual(singleUser.username);
      expect(user.password).toEqual(singleUser.password);
    });
  });
});
