import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserDto } from './dto/create.user.dto';
import * as argon2 from 'argon2';
import { loginUserDto } from './dto/login.user.dto';
import { JwtService } from '@nestjs/jwt';
import{ ativarLink, valorInicial, msgHistorico } from '../../conta/conta.link.saldo';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService, private readonly jwtService: JwtService) { }

    async createUser(dto: createUserDto) {

        const hashedPassword = await argon2.hash(dto.senha)

        return this.prisma.$transaction(async (tx) => {

            const createUser = await tx.users.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    senha: hashedPassword
                }
            })

            if (ativarLink) {
                const novaConta = await tx.conta.create({
                    data: {
                        userId: createUser.id,
                        saldo: valorInicial
                    }
                });

                await tx.historico.create({
                    data: {
                        contaId: novaConta.id,
                        tipo: 'Abrir com Link Compartilhado',
                        valor: valorInicial,
                        descricao: msgHistorico
                    }
                })
            } else {
                const conta = await tx.conta.create({
                    data: {
                        userId: createUser.id
                    }
                })
                await tx.historico.create({
                    data: {
                        contaId: conta.id,
                        tipo: 'Abertura da conta',
                        valor: 0,
                        descricao: 'Conta criada com sucesso!!'

                    }
                })
            }
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
        const isMatch = await argon2.verify(login.senha, dto.senha)
        if (!isMatch) {
            throw new ForbiddenException("email ou senha incorreto")
        }

        const payload = { sub: login.id, email: login.email, name: login.name }
        return { acessarToken: this.jwtService.sign(payload) };
    }
}