import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserDto } from './dto/create.user.dto';
import * as argon2 from 'argon2';
import { loginUserDto } from './dto/login.user.dto';
import { JwtService } from '@nestjs/jwt';
import { ContaService } from 'src/conta/conta.service';
@Injectable()
export class UserService {

    constructor(private prisma: PrismaService, private readonly jwtService: JwtService, private contaService: ContaService) { }

    async createUser(dto: createUserDto) {

        const hashedPassword = await argon2.hash(dto.password)

        return this.prisma.$transaction(async (tx) => {

            const createUser = await tx.users.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    password: hashedPassword
                }
            })

            await this.contaService.createConta(tx, { userId: createUser.id })

            return { message: "Usuário e Conta criada com sucesso!!" }
        })
    }

    async findAll() {
        return this.prisma.users.findMany({});
    }

    async logar(dto: loginUserDto) {
        const login = await this.prisma.users.findUnique({
            where: {
                name: dto.name,
                email: dto.email,
            }
        })

        if (!login) {
            throw new ForbiddenException("Usuario nao encontrado")
        }
        const isMatch = await argon2.verify(login.password, dto.password)
        if (!isMatch) {
            throw new ForbiddenException("email ou senha incorreto")
        }

        const payload = { sub: login.id, email: login.email, name: login.name }
        return { acessarToken: this.jwtService.sign(payload) };
    }
}