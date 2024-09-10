import { NotFoundInterceptor } from '@app/common'
import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Types } from 'mongoose'
import { FindAllRankingRequest } from '../dto/find.request'
import { RankingService } from '../services'

@Controller('/ranking/')
export class RankingController {
  constructor(private readonly RankingService: RankingService) {}

  @Get('jackpot')
  @UseGuards(AuthGuard())
  async getJackpot() {
    return this.RankingService.getJackpot()
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getRanking(@Param('id') id: string) {
    return this.RankingService.get(new Types.ObjectId(id))
  }

  @Post('find')
  @UseGuards(AuthGuard())
  @UseInterceptors(NotFoundInterceptor)
  async listRanking(@Body() request: FindAllRankingRequest) {
    return this.RankingService.getList(request.filterQuery ? request.filterQuery : {}, request.options)
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async destroyRanking(@Param('id') id: string) {
    return this.RankingService.destroy(id)
  }

  @Post('find-prev')
  @UseInterceptors(NotFoundInterceptor)
  async findNow(@Body() request: FindAllRankingRequest) {
    return this.RankingService.findPrevData(request.filterQuery ? request.filterQuery : {})
  }
}
