import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/user/current.user.decorataor';
import { CurrentUserDto } from 'src/user/dto/current.user.dto';
import { JwtUserGuard } from 'src/user/jwt.user.guard';

@Controller('feature')
export class FeatureController {
    @Get('public')
    featurePublic(){
        return 'feature public'
    }

    @Get('privat')
    @UseGuards(JwtUserGuard)
    featurePrivat( @CurrentUser() user: CurrentUserDto){
        return `Olá ${user.name} seu acesso Àrea privada`
    }

}
