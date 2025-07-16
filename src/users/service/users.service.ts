import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { FindOptionsWhere, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserResponseDto } from "../dto/user-response.dto";
import { Role } from "../entities/role.enum";
import { AuthService } from "./auth.service";
import { LoginResponseDto } from "../dto/login-response.dto";
import { LoginDto } from "../dto/login.dto";
import { SignInDto } from "../dto/signin.dto";
import { ChangeUserPasswordDto } from "../dto/change-user-password.dto copy";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.findByEmail(dto.email);
      await this.authService.validatePassword(dto.password, user.password);
      return this.authService.generateTokenResponse(user);
    } catch (error) {
      throw new UnauthorizedException("The credentials are wrong!");
    }
  }

  async signIn(dto: SignInDto): Promise<UserResponseDto> {
    dto.password = await this.authService.hashPassword(dto.password);
    return await this.create(new CreateUserDto(dto));
  }

  private async create(dto: CreateUserDto) {
    const user = User.fromCreateDto(dto);

    return this.repository
      .save(user)
      .then((entity) => new UserResponseDto(entity))
      .catch(() => {
        throw new ConflictException("This email is already registered!");
      });
  }

  async changePassword(id: string, dto: ChangeUserPasswordDto) {
    return this.updateUser(id, async (user) => {
      await this.authService.validatePassword(
        dto.current_password,
        user.password,
      );
      user.password = await this.authService.hashPassword(dto.new_password);
      return user;
    });
  }

  private async updateUser(
    id: string,
    changeParameterFunc: (user: User) => Promise<User>,
  ) {
    const user = await this.getExistingEntity({ id });
    const changedUser = await changeParameterFunc(user);
    return this.repository
      .save(changedUser)
      .then((entity) => new UserResponseDto(entity));
  }

  async changeRole(id: string, role: Role) {
    return this.updateUser(id, async (user) => {
      user.role = role;
      return user;
    });
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
