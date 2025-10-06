import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FeatureModule } from './feature/feature.module';
import { TransactionsModule } from './transactions/transactions.module';



@Module({
  imports: [UserModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true}), FeatureModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
