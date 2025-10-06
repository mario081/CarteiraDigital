import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Users, account, History } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class HistoryService {

    constructor(private readonly prisma: PrismaService) { }

    async createRecord(tx: Prisma.TransactionClient,
        id: string,
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

}
