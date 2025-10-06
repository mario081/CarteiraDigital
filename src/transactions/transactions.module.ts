import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [TransactionsController],
    providers: [TransactionsService],
    imports: [PrismaModule]
})
export class TransactionsModule {}
