import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { transferDto } from './dto/transfer.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class TransactionsService {

    constructor(private prisma: PrismaService) {}

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

            if(recipientAccount.balance.toNumber() < transferAmount) {
                throw new BadRequestException('Saldo insuficiente para a transferência.')
            }

            
        })
    }

}
