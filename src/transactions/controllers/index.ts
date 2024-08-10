import { NotFoundInterceptor } from '@app/common'
import { Body, Controller, Get, Ip, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Types } from 'mongoose'
import { History } from 'src/history/schemas'
import { CreateTransactionRequest } from '../dto/create.request'
import { FindAllTransactionRequest } from '../dto/find.request'
import { UpdateTransactionRequest } from '../dto/update.request'
import { TransactionService } from '../services'

@Controller('/transaction/')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   *
   * @param request
   * @param ip
   * @returns
   */
  @Post('checkout')
  async handleCheckout(@Body() request: CreateTransactionRequest, @Ip() ip: string): Promise<{ url: string }> {
    return this.transactionService.createCheckout(request, ip)
  }

  /**
   *
   * @param codeTransaction
   * @param ip
   * @returns
   */
  @Get('re-execute/:codeTransaction')
  async handleReExecute(@Param('codeTransaction') codeTransaction: string, @Ip() ip: string): Promise<{ url: string }> {
    return this.transactionService.reExecute(codeTransaction, ip)
  }

  /**
   *
   * @param request
   * @returns
   */
  @Post('payment-callback')
  async handleTransactionCallback(@Body() request: UpdateTransactionRequest): Promise<History> {
    return this.transactionService.transactionCallback(request)
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateWallet(@Param('id') id: string, @Body() request: UpdateTransactionRequest) {
    return this.transactionService.update(new Types.ObjectId(id), request)
  }

  @Post('find')
  @UseGuards(AuthGuard())
  @UseInterceptors(NotFoundInterceptor)
  async listWallet(@Body() request: FindAllTransactionRequest) {
    return this.transactionService.getList(request.filterQuery ? request.filterQuery : {}, request.options)
  }
}
