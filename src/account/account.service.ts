import { Injectable } from '@nestjs/common';
import { createAccountDto } from './dto/create.account.dto';
import { Prisma } from '@prisma/client';
import { activateLink, initialvalue } from './account.link.balance';


@Injectable()
export class AccountService {

    async createAccount(tx: Prisma.TransactionClient, dto: createAccountDto) {

        if (activateLink) {
            const newAccount = await tx.account.create({
                data: {
                    userId: dto.userId,
                    balance: initialvalue
                }
            })
            return newAccount;
        } else {
            const account = await tx.account.create({
                data: {
                    userId: dto.userId,

                }
            })
            return account
        }
    }
}
