import { Injectable, NotFoundException } from '@nestjs/common'
import { ClientSession } from 'mongoose'
import { CreateHistoryRequest } from '../dto/create.request'
import { UpdateHistoryRequest } from '../dto/update.request'
import { HistoryRepository } from '../repositories'
import { History } from '../schemas'

@Injectable()
export class HistoryService {
  constructor(private readonly repository: HistoryRepository) {}

  /**
   * Create function
   *
   * @param request
   * @returns Created course information
   */
  async create(request: CreateHistoryRequest): Promise<History> {
    return await this.repository.create(request)
  }

  /**
   * Get detail function
   *
   * @param id
   * @returns Document
   */
  async get(id: Partial<History>): Promise<History> {
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
    return this.repository.find(query, options)
  }

  /**
   * Update function
   *
   * @param request
   * @returns Created document
   */
  async update(id: Partial<History>, request: UpdateHistoryRequest): Promise<History> {
    const session: ClientSession = await this.repository.startTransaction()
    try {
      const document = await this.repository.findByIdAndUpdate(id, request)
      await session.commitTransaction()

      return document
    } catch (error) {
      await session.abortTransaction()
      throw new NotFoundException('Không tìm thấy lịch sử')
    } finally {
      session.endSession()
    }
  }

  /**
   * Remove function
   *
   * @param id
   * @returns Document
   */
  async destroy(id: string): Promise<History> {
    return await this.repository.destroy(id)
  }
}
