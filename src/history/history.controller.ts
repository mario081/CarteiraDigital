import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtUserGuard } from 'src/user/jwt.user.guard';
import { HistoryService } from './history.service';
import { CurrentUser } from 'src/user/current.user.decorataor';

@UseGuards(JwtUserGuard)
@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService){}

    @Get()
    async getHistory(@CurrentUser() user: {userId: string}) {
        return this.historyService.getHistoryByUserId(user.userId)
    }
}
