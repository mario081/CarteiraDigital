import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create.user.dto';
import { loginUserDto } from './dto/login.user.dto';

@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

    @Post('register')
    createUser(@Body() dto: createUserDto){
        return this.userService.createUser(dto);
    }     

    @Get()
    findAll(){
        return this.userService.findAll();
    }

    @Post('login')
    login(@Body() dto: loginUserDto){
        return this.userService.login(dto);
    }
}
