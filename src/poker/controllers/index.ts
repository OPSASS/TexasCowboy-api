import { NotFoundInterceptor } from '@app/common'
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Types } from 'mongoose'
import { CreateHistoryRequest } from 'src/history/dto/create.request'
import { FindAllPokerRequest } from '../dto/find.request'
import { PokerService } from '../services'

@Controller('/poker/')
export class PokerController {
  constructor(private readonly PokerService: PokerService) {}

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(NotFoundInterceptor)
  async createPoker() {
    return this.PokerService.create()
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updatePoker(@Param('id') id: string) {
    return this.PokerService.update(new Types.ObjectId(id))
  }

  @Get(':id')
  async getPoker(@Param('id') id: string) {
    return this.PokerService.get(new Types.ObjectId(id))
  }

  @Post('bets')
  @UseGuards(AuthGuard())
  @UseInterceptors(NotFoundInterceptor)
  async betPoker(@Body() request: CreateHistoryRequest) {
    return this.PokerService.bets(request)
  }

  @Post('find')
  @UseInterceptors(NotFoundInterceptor)
  async listPoker(@Body() request: FindAllPokerRequest) {
    return this.PokerService.getList(request.filterQuery ? request.filterQuery : {}, request.options)
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async destroyPoker(@Param('id') id: string) {
    return this.PokerService.destroy(id)
  }
}
