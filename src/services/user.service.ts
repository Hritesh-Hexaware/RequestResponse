import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  fetchAll() {
    return this.userRepo.find();
  }

  fetchOne(id: number) {
    return this.userRepo.findOne({
      where: { id },
    });
  }

  create(user: Partial<User>) {
    const newUser = this.userRepo.create(user);
    return this.userRepo.save(newUser);
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.fetchOne(id);

    if (!user) {
      return null;
    }

    Object.assign(user, attrs);
    return this.userRepo.save(user);
  }

  async delete(id: number) {
    const user = await this.fetchOne(id);

    if (!user) {
      return null;
    }

    return this.userRepo.remove(user);
  }
}
