import { Body, Controller, Ip, Post } from '@nestjs/common'
import { History } from 'src/history/schemas'
import { CreateVNPayRequest } from '../dto/create.request'
import { UpdateVNPayRequest } from '../dto/update.request'
import { VNPayService } from '../services'

@Controller('/vnpay/')
export class VNPayController {
  constructor(private readonly vnpayService: VNPayService) {}

  /**
   *
   * @param req
   * @param request
   * @param ip
   * @returns
   */
  @Post('checkout')
  async handleCheckout(@Body() request: CreateVNPayRequest, @Ip() ip: string): Promise<{ url: string }> {
    return this.vnpayService.createCheckout(request, ip)
  }

  /**
   *
   * @param req
   * @param id
   * @returns
   */
  @Post('payment-callback')
  async handleVNPayCallback(@Body() request: UpdateVNPayRequest): Promise<History> {
    return this.vnpayService.VNPayCallback(request)
  }
}
