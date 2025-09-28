import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [UserModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true})],
  controllers: [],
  providers: [],
})
export class AppModule {}
