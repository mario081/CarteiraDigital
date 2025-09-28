import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserDto } from './dto/create.user.dto';
import * as argon2 from 'argon2';
import { loginUserDto } from './dto/login.user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

    constructor( private prisma: PrismaService, private readonly jwtService: JwtService ){}

    async createUser( dto: createUserDto){

        const hashedPassword = await argon2.hash(dto.senha)

        await this.prisma.users.create({
            data: {
                name: dto.name,
                email: dto.email,
                senha: hashedPassword
            }
        })
    }

    async findAll() {
        return this.prisma.users.findMany({});
    }

    async logar(dto: loginUserDto){
        const login = await this.prisma.users.findUnique({
            where:{
                email: dto.email,
            }
        })

        if(!login){
            throw new ForbiddenException("Usuario nao encontrado")
        }
        const isMatch = await argon2.verify(login.senha, dto.senha)
        if(!isMatch){
            throw new ForbiddenException("email ou senha incorreto")
        }

        const payload = {user: dto.email, password: dto.senha}
        return {acessarToken: this.jwtService.sign(payload)};
    }
}