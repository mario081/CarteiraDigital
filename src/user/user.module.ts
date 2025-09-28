import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: ( config: ConfigService) => ({
      secret: config.getOrThrow('JWT_SECRET'),
      signOptions: {expiresIn: '60s'}
    })
  })]
})
export class UserModule {}
