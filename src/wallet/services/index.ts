import { Injectable, NotFoundException } from '@nestjs/common'
import { ClientSession } from 'mongoose'
import { CreateWalletRequest } from '../dto/create.request'
import { UpdateWalletRequest } from '../dto/update.request'
import { WalletRepository } from '../repositories'
import { Wallet } from '../schemas'

@Injectable()
export class WalletService {
  constructor(private readonly repository: WalletRepository) {}

  /**
   * Create function
   *
   * @param request
   * @returns Created course information
   */
  async create(request: CreateWalletRequest): Promise<Wallet> {
    return await this.repository.create(request)
  }

  /**
   * Get detail function
   *
   * @param getUserArgs
   * @returns Document
   */
  async get(id: Partial<Wallet>): Promise<Wallet> {
    return await this.repository.get({ _id: id })
  }

  /**
   * Get list function
   *
   * @param filterQuery
   * @param options
   * @returns List user by filter
   */
  async getList(filterQuery, options?) {
    const query = { ...filterQuery }
    if (filterQuery.search) {
      query.$text = { $search: filterQuery.search }
    }
    return this.repository.findAll(query, options)
  }

  /**
   * Update function
   *
   * @param request
   * @returns Created document
   */
  async update(id: Partial<Wallet>, request: UpdateWalletRequest): Promise<Wallet> {
    const session: ClientSession = await this.repository.startTransaction()
    try {
      const document = await this.repository.findByIdAndUpdate(id, request)
      await session.commitTransaction()

      return document
    } catch (error) {
      await session.abortTransaction()
      throw new NotFoundException('Không tìm thấy ví')
    } finally {
      session.endSession()
    }
  }

  async addCoin(request: UpdateWalletRequest): Promise<Wallet> {
    const { userId, coin } = request
    try {
      const wallet = await this.repository.get({ userId })

      if (!wallet) {
        throw new NotFoundException('Không tìm thấy ví')
      }
      wallet.coin += coin

      return await this.repository.findByIdAndUpdate(wallet._id, wallet)
    } catch (error) {
      throw new NotFoundException('Không tìm thấy ví')
    }
  }
  /**
   * Remove function
   *
   * @param id
   * @returns Document
   */
  async destroy(id: string): Promise<Wallet> {
    return await this.repository.destroy(id)
  }
}
