import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FeatureModule } from './feature/feature.module';
import { TransactionsModule } from './transactions/transactions.module';
import { HistoryService } from './history/history.service';
import { HistoryController } from './history/history.controller';
import { HistoryModule } from './history/history.module';



@Module({
  imports: [UserModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true}), FeatureModule, TransactionsModule, HistoryModule],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class AppModule {}
