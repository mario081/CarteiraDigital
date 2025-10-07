import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [HistoryService],
    exports: [HistoryService]
})
export class HistoryModule {}
