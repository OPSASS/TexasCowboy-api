import { NotFoundInterceptor, RoleEnum } from '@app/common'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Types } from 'mongoose'
import { CreateHistoryRequest } from '../dto/create.request'
import { FindAllHistoryRequest } from '../dto/find.request'
import { UpdateHistoryRequest } from '../dto/update.request'
import { HistoryService } from '../services'

@Controller('/history/')
export class HistoryController {
  constructor(private readonly HistoryService: HistoryService) {}

  @Post()
  @UseInterceptors(NotFoundInterceptor)
  async createHistory(@Body() request: CreateHistoryRequest) {
    return this.HistoryService.create(request)
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateHistory(@Req() req: any, @Param('id') id: string, @Body() request: UpdateHistoryRequest) {
    if (req.user.role.includes(RoleEnum.ADMIN)) {
      return this.HistoryService.update(new Types.ObjectId(id), request)
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }
  }

  @Get(':id')
  async getHistory(@Param('id') id: string) {
    return this.HistoryService.get(new Types.ObjectId(id))
  }

  @Post('find')
  @UseGuards(AuthGuard())
  @UseInterceptors(NotFoundInterceptor)
  async listHistory(@Body() request: FindAllHistoryRequest) {
    return this.HistoryService.getList(request.filterQuery ? request.filterQuery : {}, request.options)
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async destroyHistory(@Param('id') id: string) {
    return this.HistoryService.destroy(id)
  }
}
