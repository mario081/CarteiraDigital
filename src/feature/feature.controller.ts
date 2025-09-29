import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtUserGuard } from 'src/user/jwt.user.guard';

@Controller('feature')
export class FeatureController {
    @Get('public')
    featurePublic(){
        return 'feature public'
    }

    @Get('privat')
    @UseGuards(JwtUserGuard)
    featurePrivat(){
        return 'feature privada'
    }

}
