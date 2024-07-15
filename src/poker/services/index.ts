import { Injectable, NotFoundException } from '@nestjs/common'
import { History } from 'src/history/schemas'
import { HistoryService } from 'src/history/services'
import { WalletService } from '../../wallet/services'
import { PokerRepository } from '../repositories'
import { Poker } from '../schemas'

@Injectable()
export class PokerService {
  constructor(
    private readonly repository: PokerRepository,
    private readonly walletSevice: WalletService,
    private readonly historySevice: HistoryService
  ) {}

  /**
   * Create function
   *
   * @returns Created course information
   */
  async create(): Promise<Poker> {
    let initCard = Array.from({ length: 52 }, (_, k) => k + 1)
    initCard = initCard.sort(() => Math.random() - 0.5)

    const turn1 = await this.getRandomNumbersFromArray(initCard, 1)

    return await this.repository.create({ dealer: turn1.result })
  }

  /**
   * Create function
   *
   * @param request
   * @returns Created course information
   */
  async bets(request): Promise<History> {
    const { userId, gameId, detailedHistory } = request
    const userWallet = await this.walletSevice.getWalletByUserId(userId)

    const totalCoin = detailedHistory.reduce((t, c) => t + c.coin, 0)

    if (userWallet.coin <= 0) throw new NotFoundException('Xu không đủ')
    await this.walletSevice.addCoin({ userId, coin: totalCoin * -1 })

    const oldHistory = await this.historySevice.getList({ userId, gameId })

    if (!oldHistory[0]) return await this.historySevice.create({ ...request, totalCoin })
    else
      return await this.historySevice.update(oldHistory[0]._id, {
        ...request,
        totalCoin: oldHistory[0].totalCoin + totalCoin
      })
  }

  /**
   * Create function
   *
   * @param request
   * @returns Created course information
   */
  async rollback(request): Promise<History> {
    const { userId, gameId, totalCoin, detailedHistory } = request
    //TODO Rollback

    return
  }

  /**
   * Get detail function
   *
   * @param id
   * @returns Document
   */
  async get(id: Partial<Poker>): Promise<Poker> {
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
  async update(id: Partial<Poker>): Promise<Poker> {
    let initCard = Array.from({ length: 52 }, (_, k) => k + 1)
    let dealerCards = []

    initCard = initCard.sort(() => Math.random() - 0.5)
    try {
      const game = await this.repository.get({ _id: id })
      initCard = initCard.filter((c) => !game.dealer.includes(c))
      const dealer = await this.getRandomNumbersFromArray(initCard, 4)
      initCard = dealer.arr

      if (game.dealer.length !== 1) return game

      dealerCards = game.dealer.concat(dealer.result)

      const play1 = await this.getRandomNumbersFromArray(initCard, 2)

      const play2 = await this.getRandomNumbersFromArray(play1.arr, 2)

      const body = {
        dealer: dealerCards,
        player1: play1.result,
        player2: play2.result
      }

      return await this.repository.findByIdAndUpdate(id, body)
    } catch (error) {
      throw new NotFoundException('Không tìm thấy phiên chơi')
    }
  }

  /**
   * Remove function
   *
   * @param id
   * @returns Document
   */
  async destroy(id: string): Promise<Poker> {
    return await this.repository.destroy(id)
  }

  async getRandomNumbersFromArray(arr: number[], num: number) {
    if (num > arr.length) {
      throw new Error('Số lượng số cần lấy lớn hơn độ dài của mảng')
    }

    const result = []
    const usedIndices = new Set()

    while (result.length < num) {
      const randomIndex = Math.floor(Math.random() * arr.length)
      if (!usedIndices.has(randomIndex)) {
        result.push(arr[randomIndex])
        usedIndices.add(randomIndex)
      }
    }

    // Loại bỏ các số đã lấy khỏi mảng ban đầu
    arr = arr.filter((n) => !result.includes(n))

    return { result, arr }
  }
}
