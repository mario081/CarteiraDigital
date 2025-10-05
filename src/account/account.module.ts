import { Module } from '@nestjs/common';
import { accountService } from './account.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [accountService, PrismaService],
  exports: [accountService]
})
export class accountModule {}
