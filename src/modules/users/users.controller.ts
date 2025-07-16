import {
  Controller,
  Get,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Patch,
  Body,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ChangeUserRoleDto } from "./dto/change-user-role.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.service.findById(id);
  }

  @Patch(":id/roles")
  async changeRole(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: ChangeUserRoleDto,
  ) {
    return this.service.changeRole(id, dto.role);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.service.softDelete(id);
  }
}
