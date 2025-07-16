import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { FindOptionsWhere, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserResponseDto } from "./dto/user-response.dto";
import { Role } from "./entities/role.enum";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = User.fromCreateDto(dto);

    return this.repository
      .save(user)
      .then((entity) => new UserResponseDto(entity))
      .catch(() => {
        throw new ConflictException("This email is already registered!");
      });
  }

  async changeRole(id: string, role: Role) {
    const user = await this.getExistingEntity({ id });
    user.role = role;
    return this.repository
      .save(user)
      .then((entity) => new UserResponseDto(entity));
  }

  async findAll() {
    return (await this.repository.find({ withDeleted: true })).map(
      (entity) => new UserResponseDto(entity),
    );
  }

  async findById(id: string) {
    return await this.findByParameterOrError({ id });
  }

  async findByEmail(email: string) {
    return await this.findByParameterOrError({ email });
  }

  async softDelete(id: string) {
    await this.repository.softDelete({ id });
  }

  private async findByParameterOrError(query: FindOptionsWhere<User>) {
    const entity = await this.getExistingEntity(query);
    return new UserResponseDto(entity);
  }

  private async getExistingEntity(query: FindOptionsWhere<User>) {
    return this.validateEntity(await this.repository.findOneBy(query));
  }

  private validateEntity(entity: User | null) {
    if (!entity) throw new NotFoundException("The user does not exists!");
    return entity;
  }
}
