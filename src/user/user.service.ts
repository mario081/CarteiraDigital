import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserDto } from './dto/create.user.dto';
import * as argon2 from 'argon2';
import { loginUserDto } from './dto/login.user.dto';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/account.service';
import { activateLink, initialvalue, msgHistory } from 'src/account/account.link.balance';
import { Prisma } from '@prisma/client';
@Injectable()
export class UserService {

    constructor(
        private prisma: PrismaService, 
        private readonly jwtService: JwtService, 
        private accountService: AccountService
    ) { }

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

            const account = await this.accountService.createAccount(tx, { userId: createUser.id })

            if (activateLink) {
                await tx.history.create({
                    data: {
                        accountId: account.id,
                        type: 'OPEN_WITH_SHARED_LINK',
                        value: initialvalue,
                        description: msgHistory
                    }
                })
            } else {
                await tx.history.create({
                    data: {
                        accountId: account.id,
                        type: 'ACCOUNT_OPENING',
                        value: 0,
                        description: 'Account created successfully'
                    }
                })
            }

            return { message: "User and account created successfully" }
        })
    }

    async findAll() {
        return this.prisma.users.findMany({});
    }

    async login(dto: loginUserDto) {
        const login = await this.prisma.users.findUnique({
            where: {
                name: dto.name,
                email: dto.email,
            }
        })

        if (!login) {
            throw new ForbiddenException("User not found")
        }
        const isMatch = await argon2.verify(login.password, dto.password)
        if (!isMatch) {
            throw new ForbiddenException("Email or password incorrect")
        }

        const payload = { sub: login.id, email: login.email, name: login.name }
        return { accessToken: this.jwtService.sign(payload) };
    }
}