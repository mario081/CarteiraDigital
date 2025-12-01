import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { transferDto } from './dto/transfer.dto';
import { Prisma } from '@prisma/client';
import { HistoryService } from 'src/history/history.service';

@Injectable()
export class TransactionsService {

    constructor(private prisma: PrismaService, private historyService: HistoryService) {}

    async transfer(senderUserId: string, dto: transferDto){
        const { recipientEmail, amount } = dto
        const transferAmount = Number(amount)

        return this.prisma.$transaction( async (tx) => {

            const senderUserAccount = await tx.users.findUnique({
                where: { id: senderUserId },
                include: { account: true }
            })

            if(!senderUserAccount || !senderUserAccount.account){
                throw new NotFoundException('Sender account not found or does not exist.')
            }

            const senderAccount = senderUserAccount.account

            const recipientUserAccount = await tx.users.findUnique({
                where: { email: recipientEmail },
                include: {account: true } 
            })
            
            if(!recipientUserAccount || !recipientUserAccount.account){
                throw new NotFoundException('Recipient user or account not found with this email.')
            }

            const recipientAccount = recipientUserAccount.account

            if(senderAccount.id === recipientAccount.id){
                throw new BadRequestException('You cannot transfer to your own account')
            }

            if(senderAccount.balance.toNumber() < transferAmount) {
                throw new BadRequestException('Insufficient balance for transfer.')
            }

            await tx.account.update({
                where: { id: senderAccount.id },
                data: {
                    balance: {
                        decrement: transferAmount
                    }
                }
            })

            await tx.account.update({
                where: { id: recipientAccount.id},
                data: {
                    balance: {
                        increment: transferAmount
                    }
                }
            })

            await this.historyService.createRecord(tx,
                senderAccount.id,
                'TRANSFER_SENT',
                new Prisma.Decimal(transferAmount * -1),
                `Transfer sent to: ${recipientUserAccount.email}`,
                new Date()
            )

            const recipientHistory = await this.historyService.createRecord(tx,
                recipientAccount.id,
                'TRANSFER_RECEIVED',
                new Prisma.Decimal(transferAmount),
                `Transfer received from: ${senderUserAccount.email}`,
                new Date()
            )

            return recipientHistory
        })
    }

}
