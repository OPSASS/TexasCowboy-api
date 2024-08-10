import { StatusEnum, TransactionEnum, VNpayResponseCodeEnum } from '@app/common'
import { BadRequestException, Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import * as moment from 'moment'
import { ClientSession } from 'mongoose'
import * as querystring from 'qs'
import { Buffer } from 'safe-buffer'
import { History } from 'src/history/schemas'
import { WalletService } from 'src/wallet/services'
import { CreateTransactionRequest } from '../dto/create.request'
import { UpdateTransactionRequest } from '../dto/update.request'
import { TransactionRepository } from '../repositories'
import { Transaction } from '../schemas'

@Injectable()
export class TransactionService {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly walletSevice: WalletService
  ) {}

  /**
   * Create function
   *
   * @param request
   * @param ip
   * @returns url
   */
  async createCheckout(request: CreateTransactionRequest, ip: string): Promise<{ url: string }> {
    const codeTransaction = this.makeOrderCode(10)

    const session: ClientSession = await this.repository.startTransaction()
    try {
      const vnp_Url: string = await this.createUrlVnPay(codeTransaction, request.coin, ip)

      await this.repository.create({
        userId: request.userId,
        codeTransaction,
        coin: request.coin,
        status: TransactionEnum.PENDING,
        ipAddress: ip,
        targetModel: request.targetModel,
        type: request.type
      })
      await session.commitTransaction()
      return {
        url: vnp_Url
      }
    } catch (error) {
      console.log(error)
      throw new Error('Create transaction failed')
    }
  }

  /**
   * Create function
   *
   * @param codeTransaction
   * @param ip
   * @returns url
   */
  async reExecute(codeTransaction: string, ip: string): Promise<{ url: string }> {
    const session: ClientSession = await this.repository.startTransaction()

    try {
      const detail = await this.repository.get({ codeTransaction })
      if (detail.status === StatusEnum.SUCCESS) throw new Error('The transaction has been done')
      if (detail.status === StatusEnum.CANCEL) throw new Error('The transaction canceled')

      const vnp_Url: string = await this.createUrlVnPay(codeTransaction, detail.coin, ip)
      await session.commitTransaction()
      return {
        url: vnp_Url
      }
    } catch (error) {
      throw new Error('Re execute transaction failed')
    }
  }

  /**
   * Update function
   *
   * @param request
   * @returns Updated document
   */
  async update(id: Partial<Transaction>, request: UpdateTransactionRequest): Promise<Transaction> {
    const session: ClientSession = await this.repository.startTransaction()
    try {
      const document = await this.repository.findByIdAndUpdate(id, request)
      await session.commitTransaction()

      return document
    } catch (error) {
      await session.abortTransaction()
      throw new BadRequestException('Transaction not found')
    } finally {
      session.endSession()
    }
  }

  /**
   * Get list function
   *
   * @param filterQuery
   * @param options
   * @returns List transactions by filter
   */
  async getList(filterQuery, options?) {
    const query = { ...filterQuery }
    if (filterQuery.search) {
      query.$text = { $search: filterQuery.search }
    }
    return this.repository.findAll(query, options)
  }

  /**
   *
   * @param length
   * @returns
   */
  private makeOrderCode(length: number) {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   *
   * @param codeTransaction
   * @param coin
   * @param ip
   * @returns
   */
  private async createUrlVnPay(codeTransaction: string, coin: number, ip: string): Promise<string> {
    let vnp_Params = {}
    vnp_Params['vnp_Command'] = process.env.VNP_COMMAND
    vnp_Params['vnp_CurrCode'] = process.env.VNP_CURR_CODE
    vnp_Params['vnp_Locale'] = process.env.VNP_LOCALE
    vnp_Params['vnp_OrderType'] = process.env.VNP_ORDER_TYPE
    vnp_Params['vnp_Version'] = process.env.VNP_VERSION
    vnp_Params['vnp_TmnCode'] = process.env.VNP_TMNCODE
    vnp_Params['vnp_ReturnUrl'] = process.env.VNP_RETURN_URL
    vnp_Params['vnp_TxnRef'] = codeTransaction
    vnp_Params['vnp_OrderInfo'] = 'Order payment ' + codeTransaction
    vnp_Params['vnp_Amount'] = coin * 2500 // 25d/coin
    vnp_Params['vnp_IpAddr'] = ip
    vnp_Params['vnp_CreateDate'] = moment(new Date()).format('YYYYMMDDHHmmss')
    vnp_Params = this.sortObject(vnp_Params)
    const signData = querystring.stringify(vnp_Params, { encode: false })
    const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET)
    vnp_Params['vnp_SecureHash'] = hmac.update(Buffer.from(signData, 'utf-8') as any).digest('hex')

    return process.env.VNP_URL + '?' + querystring.stringify(vnp_Params, { encode: false })
  }

  /**
   *
   * @param request
   * @returns
   */
  async transactionCallback(request: UpdateTransactionRequest): Promise<History> {
    let vnp_Params: any = {}
    vnp_Params['vnp_TmnCode'] = process.env.VNP_TMNCODE
    vnp_Params['vnp_Amount'] = request.vnp_Amount
    vnp_Params['vnp_BankCode'] = request.vnp_BankCode
    vnp_Params['vnp_TxnRef'] = request.vnp_TxnRef
    vnp_Params['vnp_OrderInfo'] = request.vnp_OrderInfo
    vnp_Params['vnp_BankTranNo'] = request.vnp_BankTranNo
    vnp_Params['vnp_CardType'] = request.vnp_CardType
    vnp_Params['vnp_PayDate'] = request.vnp_PayDate
    vnp_Params['vnp_ResponseCode'] = request.vnp_ResponseCode
    vnp_Params['vnp_TransactionStatus'] = request.vnp_TransactionStatus
    vnp_Params['vnp_TransactionNo'] = request.vnp_TransactionNo
    vnp_Params = this.sortObject(vnp_Params)

    const secureHash = request.vnp_SecureHash
    let signData = querystring.stringify(vnp_Params, { encode: false })
    let hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET)
    let signed = hmac.update(Buffer.from(signData, 'utf-8') as any).digest('hex')

    // check secure hash
    const detail = await this.repository.get({ codeTransaction: request.vnp_TxnRef })
    if (detail && detail.status !== TransactionEnum.SUCCESS)
      if (secureHash === signed && request.vnp_ResponseCode === VNpayResponseCodeEnum.SUCCESS) {
        const coinList = [1000, 3000, 5000, 10000, 15000, 50000, 100000, 500000]
        const body = {
          userId: detail.userId,
          coin: (detail.coin * 5 * coinList.indexOf(detail.coin)) / 100 + detail.coin
        }
        await this.walletSevice.addCoin(body)

        const response = await this.repository.findOneAndUpdate(detail, {
          status: TransactionEnum.SUCCESS,
          responseCode: request.vnp_ResponseCode,
          cardType: request.vnp_CardType,
          bankCode: request.vnp_BankCode,
          orderInfo: request.vnp_OrderInfo,
          transactionNo: request.vnp_TransactionNo
        })

        return response
      } else {
        const response = await this.repository.findOneAndUpdate(detail, {
          status: TransactionEnum.FAIL
        })
        return response
      }
  }

  /**
   *
   * @param obj
   * @returns
   */
  private sortObject(obj: object) {
    let sorted = {}
    let str = []
    let key
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key))
      }
    }
    str.sort()
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
    }
    return sorted
  }
}
