import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { get, request } from 'http';
import { UserService } from './user.service';
import { createUserDto } from './dto/create.user.dto';
import { loginUserDto } from './dto/login.user.dto';

@Controller('user')
export class UserController {

    constructor(private userService: UserService){}

    @Post('cadastra')
    criarUser(@Body() dto: createUserDto){
        return this.userService.createUser(dto);
    }     

    @Get()
    findAll(){
        return this.userService.findAll();
    }

    @Post('login')
    logar(@Body() dto: loginUserDto){
        return this.userService.logar(dto);
    }
}
