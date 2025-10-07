import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Users, account, History } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class HistoryService {

    constructor(private readonly prisma: PrismaService) {}

    async createRecord(tx: Prisma.TransactionClient,
        accountId: string,
        type: string,
        value: Decimal,
        description: string | null,
        date: Date): Promise<History> {

        const historyRecord = await tx.history.create({
            data: {
                accountId,
                type,
                value,
                description,
                date,
            }
        })

        return historyRecord
    }
    async getHistoryByUserId( userId: string){
        const account = await this.prisma.account.findUnique({
            where: { userId }
        })

        if(!account){
            throw new NotFoundException('Conta de saldo não encontrada.');
        }

        return this.prisma.history.findMany({
            where: { accountId: account.id},
            orderBy: { date:  'desc'}
        })
    }

}
