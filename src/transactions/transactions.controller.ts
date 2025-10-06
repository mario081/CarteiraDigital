import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtUserGuard } from 'src/user/jwt.user.guard';
import { TransactionsService } from './transactions.service';
import { CurrentUser } from 'src/user/current.user.decorataor';
import { transferDto } from './dto/transfer.dto';
import { CurrentUserDto } from 'src/user/dto/current.user.dto';

@UseGuards(JwtUserGuard)
@Controller('transactions')
export class TransactionsController {

    constructor(private readonly transactionsService: TransactionsService){}

    @Post('transfer')
    async transfer( @CurrentUser() user: CurrentUserDto, @Body() transferDto: transferDto){
        const transactionHistory = await this.transactionsService.transfer(user.userId, transferDto)

        return {
            message: 'Transferência realizada com sucesso!',
            history: transactionHistory
        }
    }
}
