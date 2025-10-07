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

            const senderUserAccoount = await tx.users.findUnique({
                where: { id: senderUserId },
                include: { account: true }
            })

            if(!senderUserAccoount || !senderUserAccoount.account){
                throw new NotFoundException('Conta remetente não encontrada ou inexistente.')
            }

            const senderAccoount = senderUserAccoount.account

            const recipientUserAccount = await tx.users.findUnique({
                where: { email: recipientEmail },
                include: {account: true } 
            })
            
            if(!recipientUserAccount || !recipientUserAccount.account){
                throw new NotFoundException('Usuário destinatário ou conta não encontrado(a) com este email.')
            }

            const recipientAccount = recipientUserAccount.account

            if(senderAccoount.id === recipientAccount.id){
                throw new BadRequestException('Você não pode transferir para sua própria conta')
            }

            if(senderAccoount.balance.toNumber() < transferAmount) {
                throw new BadRequestException('Saldo insuficiente para a transferência.')
            }

            await tx.account.update({
                where: { id: senderAccoount.id },
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
                senderAccoount.id,
                'TRANSFER_SENT',
                new Prisma.Decimal(transferAmount * -1),
                `Transferência enviada para: ${recipientUserAccount.email}`,
                new Date()
            )

            const recipientHistory = await this.historyService.createRecord(tx,
                recipientAccount.id,
                'TRANSFER_RECEIVED',
                new Prisma.Decimal(transferAmount),
                `Transferência recebida de: ${senderUserAccoount.email}`,
                new Date()
            )

            return recipientHistory
        })
    }

}
