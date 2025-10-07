import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HistoryModule } from 'src/history/history.module';

@Module({
    controllers: [TransactionsController],
    providers: [TransactionsService],
    imports: [PrismaModule, HistoryModule]
})
export class TransactionsModule {}
