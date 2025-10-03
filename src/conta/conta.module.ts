import { Module } from '@nestjs/common';
import { ContaService } from './conta.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ContaService, PrismaService],
  exports: [ContaService]
})
export class ContaModule {}
