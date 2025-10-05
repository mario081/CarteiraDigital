import { Injectable } from '@nestjs/common';
import { createAccountDto } from './dto/create.account.dto';
import { PrismaClient } from '@prisma/client/extension';
import { activateLink, initialvalue, msgHistory } from './account.link.balance';


@Injectable()
export class accountService {

    async createConta(tx: Omit<PrismaClient, symbol> ,dto: createAccountDto) {

        if (activateLink) {
            const newAccount = await tx.account.create({
                data: {
                    userId: dto.userId,
                    balance: initialvalue
                }
            })

            await tx.history.create({
                data: {
                    accountId: newAccount.id,
                    type: 'Abrir com Link Compartilhado',
                    value: initialvalue,
                    description: msgHistory
                }
            })
            return newAccount;
        } else {
            const account = await tx.account.create({
                data: {
                    userId: dto.userId,

                }
            })
            await tx.history.create({
                data: {
                    accountId: account.id,
                    type: 'Abertura da conta',
                    value: 0,
                    description: 'Conta criada com sucesso!!'
                }
            })
            return account
        }
    }
}
