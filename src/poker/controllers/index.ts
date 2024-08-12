import { NotFoundInterceptor } from '@app/common'
import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Types } from 'mongoose'
import { CreateHistoryRequest } from 'src/history/dto/create.request'
import { FindAllPokerRequest } from '../dto/find.request'
import { PokerService } from '../services'

@Controller('/poker/')
export class PokerController {
  constructor(private readonly PokerService: PokerService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  @UseInterceptors(NotFoundInterceptor)
  async createPoker() {
    return this.PokerService.create()
  }

  @Get(':id')
  async getPoker(@Param('id') id: string) {
    return this.PokerService.get(new Types.ObjectId(id))
  }

  @Post('betting')
  @UseGuards(AuthGuard())
  @UseInterceptors(NotFoundInterceptor)
  async pokerBetting(@Body() request: CreateHistoryRequest) {
    return this.PokerService.betting(request)
  }

  @Post('find')
  @UseInterceptors(NotFoundInterceptor)
  async listPoker(@Body() request: FindAllPokerRequest) {
    return this.PokerService.getList(request.filterQuery ? request.filterQuery : {}, request.options)
  }

  @Post('find-now')
  @UseInterceptors(NotFoundInterceptor)
  async findNow(@Body() request: FindAllPokerRequest) {
    return this.PokerService.findNowTurn(request.filterQuery ? request.filterQuery : {})
  }
}
