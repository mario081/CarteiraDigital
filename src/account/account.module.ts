import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AccountService, PrismaService],
  exports: [AccountService]
})
export class AccountModule {}
