import { User } from "src/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "src/services/user.service";
import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";

describe("UserService", () => {
  let service: UserService;
  let repo: Repository<User>;

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
    const mockRepo = {
      find: () => Promise.resolve(multipleUsers),
      findOne: (id: number) => Promise.resolve(singleUser),
      save: (user: User) => Promise.resolve(user),
      create: (user: User) => user,
      remove: (user: User) => Promise.resolve(user),
    };

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  it("should be defined", async () => {
    expect(service).toBeDefined();
  });

  describe("fetchAll", () => {
    it("should fetch all users from database", async () => {
      const users = await service.fetchAll();
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe("fetchOne", () => {
    it("should fetch one user from the database", async () => {
      const user = await service.fetchOne(1);
      expect(user.username).toEqual(singleUser.username);
      expect(user.password).toEqual(singleUser.password);
    });
    it("should fetch no users from database", async () => {
      repo.findOne = () => Promise.resolve(null);
      const user = await service.fetchOne(1);
      expect(user).toBeNull();
    });
  });

  describe("Create user", () => {
    it("should create the user of the specified values", async () => {
      const user = await service.create(singleUser);
      expect(user.username).toEqual(singleUser.username);
      expect(user.password).toEqual(singleUser.password);
    });
  });

  describe("Update user", () => {
    it("should return null when user is not available", async () => {
      repo.findOne = () => Promise.resolve(null);
      const user = await service.update(1, {});
      expect(user).toBeNull();
    });

    it("should update the user of the specified id", async () => {
      const user = await service.update(1, singleUser);
      expect(user.username).toEqual(singleUser.username);
      expect(user.password).toEqual(singleUser.password);
    });
  });

  describe("Delete user", () => {
    it("should return null when user is not available", async () => {
      repo.findOne = () => Promise.resolve(null);
      const user = await service.delete(1);
      expect(user).toBeNull();
    });

    it("should delete the user of the specified id", async () => {
      const user = await service.delete(1);
      expect(user.id).toEqual(1);
    });
  });
});
