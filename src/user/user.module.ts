import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { accountModule } from 'src/account/account.module';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [JwtStrategy],
  imports: [accountModule,PassportModule,PrismaModule, JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: ( config: ConfigService) => ({
      secret: config.getOrThrow('JWT_SECRET'),
      signOptions: {expiresIn: '60s'}
    })
  })]
})
export class UserModule {}
