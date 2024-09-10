import { ModalEnum } from '@app/common'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as moment from 'moment'
import { CreateRankingRequest } from '../dto/create.request'
import { UpdateRankingRequest } from '../dto/update.request'
import { RankingRepository } from '../repositories'
import { Ranking } from '../schemas'

@Injectable()
export class RankingService {
  constructor(private readonly repository: RankingRepository) {}

  /**
   * Create function
   *
   * @param request
   * @returns Created course information
   */
  async create(request: CreateRankingRequest): Promise<Ranking> {
    return await this.repository.create(request)
  }

  /**
   * Get detail function
   *
   * @param id
   * @param request
   * @returns Document
   */
  async get(id: Partial<Ranking>): Promise<Ranking> {
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
  async update(id: Partial<Ranking>, request: UpdateRankingRequest): Promise<Ranking> {
    try {
      const document = await this.repository.findByIdAndUpdate(id, request)

      return document
    } catch (error) {
      throw new NotFoundException('Không tìm thấy rank')
    }
  }

  /**
   * Remove function
   *
   * @param id
   * @returns Document
   */
  async destroy(id: string): Promise<Ranking> {
    return await this.repository.destroy(id)
  }

  /**
   * FindPrevData function
   *
   * @param request
   * @returns FindPrevData history information
   */
  async findPrevData(request: any): Promise<Ranking> {
    return await this.repository.findPrev(request)
  }

  /**
   * get jackpot function
   *
   * @returns Jackpot number
   */
  async getJackpot(): Promise<number> {
    const startOfDay = moment().startOf('day').toDate()
    const now = moment().toDate()

    const result = await this.repository.sum('totalCoin', {
      createdAt: { $gte: startOfDay, $lte: now },
      targetModel: ModalEnum.TEXAS_COWBOY
    })

    return result || 0
  }
}
