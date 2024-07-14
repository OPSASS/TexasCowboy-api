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
import { CreateWalletRequest } from '../dto/create.request'
import { FindAllWalletRequest } from '../dto/find.request'
import { UpdateWalletRequest } from '../dto/update.request'
import { WalletService } from '../services'

@Controller('/wallet/')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @UseInterceptors(NotFoundInterceptor)
  async createWallet(@Body() request: CreateWalletRequest) {
    return this.walletService.create(request)
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateWallet(@Req() req: any, @Param('id') id: string, @Body() request: UpdateWalletRequest) {
    if (req.user.role.includes(RoleEnum.ADMIN)) {
      return this.walletService.update(new Types.ObjectId(id), request)
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }
  }

  @Post('add-coin')
  @UseGuards(AuthGuard())
  async addCoin(@Body() request: UpdateWalletRequest) {
    return this.walletService.addCoin(request)
  }

  @Get(':id')
  async getWallet(@Param('id') id: string) {
    return this.walletService.get(new Types.ObjectId(id))
  }

  @Post('find')
  @UseInterceptors(NotFoundInterceptor)
  async listWallet(@Body() request: FindAllWalletRequest) {
    return this.walletService.getList(request.filterQuery ? request.filterQuery : {}, request.options)
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async destroyWallet(@Param('id') id: string) {
    return this.walletService.destroy(id)
  }
}
