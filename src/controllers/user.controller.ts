import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  RawBodyRequest,
  Header, Headers, UseInterceptors
} from "@nestjs/common";
import { ApiConsumes, ApiProduces } from '@nestjs/swagger';
import { User } from "src/entities/user.entity";
import { XmlRequestInterceptor } from "src/middlewares/xmlRequest.decorator";
import { XmlResponseInterceptor } from "src/middlewares/xmlResponse.decorator";
import { UserService } from "src/services/user.service";
@Controller("/user")
export class UserController {
  constructor(private userService: UserService) { }

  @ApiProduces('application/xml')
  @Get("")
  @UseInterceptors(XmlResponseInterceptor)
  fetchAll() {
    return this.userService.fetchAll();
  }

  @Get("/:id")
  async fetchOne(@Param("id") id: string) {
    const user = await this.userService.fetchOne(+id);

    if (!user) throw new NotFoundException("User not found");

    return user;
  }
  @UseInterceptors(XmlRequestInterceptor)
  @Post()
  @Header('Content-Type', 'application/xml')
  create(@Body() user: User) {
    return this.userService.create(user);
  }

  @Put("/:id")
  async update(@Param("id") id: string, @Body() user: User) {
    const receivedUser = await this.userService.update(+id, user);

    if (!receivedUser) throw new NotFoundException("User not found");

    return receivedUser;
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    const receivedUser = await this.userService.delete(+id);

    if (!receivedUser) throw new NotFoundException("User not found");

    return receivedUser;
  }
}
