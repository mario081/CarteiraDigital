import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createContaDto } from './dto/create.conta.dto';
import { ativarLink, msgHistorico, valorInicial } from './conta.link.saldo';
import { PrismaClient } from '@prisma/client/extension';


@Injectable()
export class ContaService {

    constructor(private prisma: PrismaService,) { }

    async createConta(tx: Omit<PrismaClient, symbol> ,dto: createContaDto) {

        if (ativarLink) {
            const novaConta = await tx.conta.create({
                data: {
                    userId: dto.userId,
                    saldo: valorInicial
                }
            })

            await tx.historico.create({
                data: {
                    contaId: novaConta.id,
                    tipo: 'Abrir com Link Compartilhado',
                    valor: valorInicial,
                    descricao: msgHistorico
                }
            })
            return novaConta;
        } else {
            const conta = await tx.conta.create({
                data: {
                    userId: dto.userId,

                }
            })
            await tx.historico.create({
                data: {
                    contaId: conta.id,
                    tipo: 'Abertura da conta',
                    descricao: 'Conta criada com sucesso!!'
                }
            })
            return conta
        }
    }
}
