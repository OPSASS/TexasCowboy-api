import { ModalEnum } from '@app/common'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateHistoryRequest } from 'src/history/dto/create.request'
import { History } from 'src/history/schemas'
import { HistoryService } from 'src/history/services'
import { RankingService } from 'src/ranking/services'
import { SocketGetWay } from 'src/socket/service'
import { WalletService } from '../../wallet/services'
import { PokerRepository } from '../repositories'
import { Poker } from '../schemas'

interface Card {
  value: number
  suit: string
}

interface HandRank {
  rank: number
  highCard: number
  highCardSuit: string
}

interface PlayerResult {
  playerIndex: number
  rank: number
  rankString: string
  highCard: number
  result: 'win' | 'lose' | 'draw'
}

interface AnyPlayers {
  isHasPair: boolean
  isAA: boolean
  isFlush: boolean
  isStraight: boolean
  isStraightFlush: boolean
}

@Injectable()
export class PokerService {
  constructor(
    private readonly repository: PokerRepository,
    private readonly walletSevice: WalletService,
    private readonly historyService: HistoryService,
    private readonly rankingService: RankingService,
    private readonly socketService: SocketGetWay
  ) {}
  /**
   * getRandomNumbersFromArray function
   *
   * @param arr
   * @param num
   * @returns Number
   */
  private async getRandomNumbersFromArray(arr: number[], num: number): Promise<{ arr: number[]; result: number[] }> {
    if (num > arr.length) {
      throw new Error('The number of numbers needed is greater than the length of the array')
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

    arr = arr.filter((n) => !result.includes(n))

    return { result, arr }
  }

  /**
   * updateArray function
   *
   * @param arr
   * @param newValues
   * @returns Number
   */
  private async updateArray(arr: number[], newValues: number[]): Promise<number[]> {
    let initIndex = 0
    let newIndex = 0

    while (initIndex < arr.length && newIndex < newValues.length) {
      if (arr[initIndex] === 0) {
        arr[initIndex] = newValues[newIndex]
        newIndex++
      }
      initIndex++
    }

    return arr
  }

  /**
   * modifyArray function
   *
   * @param oldArr
   * @param newData
   * @param limit
   * @returns new array
   */
  private async modifyArray(oldArr: any[], newData: any, limit: number): Promise<any[]> {
    let newArr = oldArr
    if (typeof newData === 'undefined' || typeof limit !== 'number' || limit <= 0) {
      return null
    }
    if (!newArr) newArr = []
    if (newArr.length < limit) return newArr.concat(newData)
    else return newArr.concat(newData).slice(1, limit + 1)
  }

  /**
   * couting function
   *
   * @param oldNum
   * @param check
   * @returns Couting data
   */
  private async countingHistory(oldNum: number, check: boolean): Promise<number> {
    let newNum = oldNum
    if (!oldNum) newNum = 0
    if (!check) {
      return newNum + 1
    }
    return 0
  }

  /**
   * gamePlay function
   *
   * @param dealerCards
   * @param players
   * @returns gameHistory data
   */
  private async gamePlay(dealerCards: number[], players: number[][]) {
    const getCardValue = (card) => ((card - 1) % 13) + 2
    const getCardSuit = (card) => ['Hearts', 'Diamonds', 'Clubs', 'Spades'][Math.floor((card - 1) / 13)]
    const getCard = (card: number) => ({ value: getCardValue(card), suit: getCardSuit(card) })
    const rankToString = (rank: number) =>
      [
        'High Card',
        'One Pair',
        'Two Pair',
        'Three of a Kind',
        'Straight',
        'Flush',
        'Full House',
        'Four of a Kind',
        'Straight Flush',
        'Royal Flush'
      ][rank]

    const getKeyByValue = (object: Record<number, number>, value: number, secondHighest = false): number => {
      const keys = Object.keys(object).sort((a, b) => object[Number(b)] - object[Number(a)])
      return Number(secondHighest ? keys[1] : keys.find((key) => object[Number(key)] === value))
    }

    const getHandRank = (cards: Card[]): HandRank => {
      const values = cards.map((card) => card.value).sort((a, b) => a - b)
      const uniqueValues = [...new Set(values)]
      const suits = cards.map((card) => card.suit)
      const isFlush = new Set(suits).size === 1
      const isStraight = uniqueValues.length === 5 && (values[4] - values[0] === 4 || values.join('') === '234514')
      const valueCounts: Record<number, number> = values.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1
        return acc
      }, {})

      const counts = Object.values(valueCounts).sort((a, b) => b - a)
      const highCard = values[4]
      const highCardSuit = suits[values.indexOf(highCard)]

      // Various hand rankings
      if (isStraight && isFlush && values[0] === 10) return { rank: 9, highCard, highCardSuit } // Royal Flush
      if (isStraight && isFlush) return { rank: 8, highCard, highCardSuit } // Straight Flush
      if (counts[0] === 4) return { rank: 7, highCard: getKeyByValue(valueCounts, 4), highCardSuit } // Four of a Kind
      if (counts[0] === 3 && counts[1] === 2) return { rank: 6, highCard: getKeyByValue(valueCounts, 3), highCardSuit } // Full House
      if (isFlush) return { rank: 5, highCard, highCardSuit } // Flush
      if (isStraight) return { rank: 4, highCard, highCardSuit } // Straight
      if (counts[0] === 3) return { rank: 3, highCard: getKeyByValue(valueCounts, 3), highCardSuit } // Three of a Kind
      if (counts[0] === 2 && counts[1] === 2)
        return { rank: 2, highCard: getKeyByValue(valueCounts, 2, true), highCardSuit } // Two Pair
      if (counts[0] === 2) return { rank: 1, highCard: getKeyByValue(valueCounts, 2), highCardSuit } // One Pair
      return { rank: 0, highCard, highCardSuit } // Default High Card
    }

    const getCombinations = (arr: any[], k: number) => {
      if (k > arr.length || k <= 0) return []
      if (k === arr.length) return [arr]
      if (k === 1) return arr.map((e) => [e])

      return arr.flatMap((e, i) => getCombinations(arr.slice(i + 1), k - 1).map((comb: any) => [e, ...comb]))
    }

    const getBestHandRank = (hand: Card[]): HandRank =>
      getCombinations(hand, 5).reduce(
        (best, current) => {
          const currentRank = getHandRank(current)
          return currentRank.rank > best.rank ||
            (currentRank.rank === best.rank && currentRank.highCard > best.highCard) ||
            (currentRank.rank === best.rank &&
              currentRank.highCard === best.highCard &&
              currentRank.highCardSuit !== best.highCardSuit)
            ? currentRank
            : best
        },
        { rank: -1, highCard: -1, highCardSuit: '' }
      )
    const hasPair = (hand: number[]): boolean =>
      Object.values(
        hand.reduce(
          (acc, card) => {
            const value = getCardValue(card)
            acc[value as any] = (acc[value as any] || 0) + 1
            return acc
          },
          {} as Record<number, number>
        )
      ).some((count) => count === 2)

    const checkPairs = (players: number[][]): { isHasPair: boolean; isAA: boolean } => {
      let isHasPair = false
      let isAA = false

      players.forEach((hand) => {
        const valueCounts: Record<number, number> = hand.reduce((acc, card) => {
          const value = getCardValue(card)
          acc[value as any] = (acc[value as any] || 0) + 1
          return acc
        }, {})

        if (hasPair(hand)) isHasPair = true
        if (valueCounts[14] === 2) isAA = true
      })

      return { isHasPair, isAA }
    }

    const checkHands = (dealerCards: number[], players: any): AnyPlayers => {
      const allHands = [dealerCards, ...players]
      const { isHasPair, isAA } = checkPairs(players)

      return {
        isHasPair,
        isAA,
        isFlush: allHands.some((hand) => new Set(hand.map(getCard).map((card) => card.suit)).size === 1),
        isStraight: allHands.some((hand) => {
          const values = hand
            .map(getCard)
            .map((card) => card.value)
            .sort((a, b) => a - b)
          return values.length === 5 && (values[4] - values[0] === 4 || values.join('') === '234514')
        }),
        isStraightFlush: allHands.some((hand) => {
          const values = hand
            .map(getCard)
            .map((card) => card.value)
            .sort((a, b) => a - b)
          const suits = hand.map(getCard).map((card) => card.suit)
          return (
            new Set(suits).size === 1 &&
            values.length === 5 &&
            (values[4] - values[0] === 4 || values.join('') === '234514')
          )
        })
      }
    }

    const compareHands = (players: number[][]): number => {
      const [player1Cards, player2Cards] = players.map((hand) =>
        hand.map(getCardValue).sort((a, b) => Number(a) - Number(b))
      )
      for (let i = 0; i < player1Cards.length; i++) {
        if (player1Cards[i] > player2Cards[i]) return 0
        if (player1Cards[i] < player2Cards[i]) return 1
      }
      return -1
    }

    const getWinner = (
      dealerCards: number[],
      players: number[][]
    ): { anyPlayers: AnyPlayers; playersResult: PlayerResult[] } => {
      const dealerHand = dealerCards.map(getCard)
      const results = players.map((player, index) => {
        const playerHand = [...dealerHand, ...player.map(getCard)]
        const playerRank = getBestHandRank(playerHand)
        return {
          playerIndex: index,
          rank: playerRank.rank,
          rankString: rankToString(playerRank.rank),
          highCard: playerRank.highCard
        }
      })

      const highestRank = results.reduce(
        (best, result) =>
          result.rank > best.rank || (result.rank === best.rank && result.highCard > best.highCard) ? result : best,
        { rank: -1, highCard: -1 }
      )

      const isDraw =
        results.every((result) => result.rank === highestRank.rank && result.highCard === highestRank.highCard) &&
        compareHands(players) === -1

      const winner = results.findIndex(
        (result) => result.rank === highestRank.rank && result.highCard === highestRank.highCard
      )

      return {
        anyPlayers: checkHands(dealerCards, players),
        playersResult: results.map((result) => ({
          ...result,
          result: isDraw ? 'draw' : result.playerIndex === winner ? 'win' : 'lose'
        }))
      }
    }

    const result = getWinner(dealerCards, players)
    const data = result.playersResult

    return {
      playerHistory: data.filter((p, id) => p.result === 'win' || (p.result === 'draw' && id === 0)),
      result: data,
      red: data.some((p) => p.playerIndex === 1 && p.result === 'win'),
      draw: data.every((p) => p.result === 'draw'),
      blue: data.some((p) => p.playerIndex === 0 && p.result === 'win'),
      highCardOrOnePair: data.some((p) => (p.rank === 0 || p.rank === 1) && p.result === 'win'),
      twoPair: data.some((p) => p.rank === 2 && p.result === 'win'),
      threeOfAKindOrStraightOrFlush: data.some(
        (p) => (p.rank === 3 || p.rank === 4 || p.rank === 5) && p.result === 'win'
      ),
      fullHouse: data.some((p) => p.rank === 6 && p.result === 'win'),
      fourOfAKindOrStraightFlushOrRoyalFlush: data.some(
        (p) => (p.rank === 7 || p.rank === 8 || p.rank === 9) && p.result === 'win'
      ),
      isFlush: result.anyPlayers.isFlush,
      isHasPair: result.anyPlayers.isHasPair,
      isAA: result.anyPlayers.isAA
    }
  }

  /**
   * Create function
   *
   * @returns Created poker information
   */
  async create(): Promise<Poker> {
    const turnTime = Number(process.env.GAME_TIME)
    let initCard = Array.from({ length: 52 }, (_, k) => k + 1).sort(() => Math.random() - 0.5)
    let initPlayerCards = Array(5).fill(0)

    const player1 = await this.getRandomNumbersFromArray(initCard, 1)
    const player2 = await this.getRandomNumbersFromArray(player1.arr, 1)

    const history = await this.historyService.create({ targetModel: ModalEnum.TEXAS_COWBOY })

    const result = await this.repository.create({
      dealer: initPlayerCards,
      player1: [...player1.result, 0],
      player2: [...player2.result, 0],
      pack: player2.arr,
      historyId: history._id.toString()
    })

    await this.historyService.update(history._id, { gameId: result._id.toString() })

    setTimeout(
      () => {
        this.update(result._id)
      },
      turnTime / 2 + 2700
    )

    this.socketService.server.sockets.emit('pokerGameStart', result)

    return result
  }

  /**
   * Update function
   *
   * @param request
   * @returns Update document
   */
  async update(id: Partial<Poker>): Promise<Poker> {
    try {
      let gameHistory = {}
      const turnDetail = await this.repository.get({ _id: id })
      if (turnDetail.dealer[2] !== 0) return turnDetail

      const player1 = await this.getRandomNumbersFromArray(turnDetail.pack, 1)
      const player2 = await this.getRandomNumbersFromArray(player1.arr, 1)
      const dealer = await this.getRandomNumbersFromArray(player2.arr, 5)

      const player1Cards = await this.updateArray(turnDetail.player1, player1.result)
      const player2Cards = await this.updateArray(turnDetail.player2, player2.result)

      const result = await this.gamePlay(dealer.result, [player1Cards, player2Cards])

      const oldTurn = await this.historyService.findPrevData({ _destroy: false, targetModel: ModalEnum.TEXAS_COWBOY })
      const jackpot = await this.rankingService.getJackpot()

      gameHistory = {
        playerHistory: await this.modifyArray(oldTurn?.gameHistory?.playerHistory, result?.playerHistory, 50),
        result: result.result,
        red: await this.modifyArray(oldTurn?.gameHistory?.red, result.red, 12),
        draw: await this.modifyArray(oldTurn?.gameHistory?.draw, result.draw, 12),
        blue: await this.modifyArray(oldTurn?.gameHistory?.blue, result.blue, 12),
        highCardOrOnePair: await this.modifyArray(
          oldTurn?.gameHistory?.highCardOrOnePair,
          result.highCardOrOnePair,
          12
        ),
        twoPair: await this.modifyArray(oldTurn?.gameHistory?.twoPair, result.twoPair, 12),
        threeOfAKindOrStraightOrFlush: await this.modifyArray(
          oldTurn?.gameHistory?.threeOfAKindOrStraightOrFlush,
          result.threeOfAKindOrStraightOrFlush,
          12
        ),
        fullHouse: await this.modifyArray(oldTurn?.gameHistory?.fullHouse, result.fullHouse, 12),
        fourOfAKindOrStraightFlushOrRoyalFlush: await this.modifyArray(
          oldTurn?.gameHistory?.fourOfAKindOrStraightFlushOrRoyalFlush,
          result.fourOfAKindOrStraightFlushOrRoyalFlush,
          25
        ),
        isAA: await this.modifyArray(oldTurn?.gameHistory?.isAA, result.isAA, 12),
        isHasPair: await this.modifyArray(oldTurn?.gameHistory?.isHasPair, result.isHasPair, 12),
        isFlush: await this.modifyArray(oldTurn?.gameHistory?.isFlush, result.isFlush, 12),
        countRed: await this.countingHistory(oldTurn?.gameHistory?.countRed, result?.red),
        countDraw: await this.countingHistory(oldTurn?.gameHistory?.countDraw, result?.draw),
        countBlue: await this.countingHistory(oldTurn?.gameHistory?.countBlue, result?.blue),
        countHighCardOrOnePair: await this.countingHistory(
          oldTurn?.gameHistory?.countHighCardOrOnePair,
          result?.highCardOrOnePair
        ),
        countTwoPair: await this.countingHistory(oldTurn?.gameHistory?.countTwoPair, result?.twoPair),
        countThreeOfAKindOrStraightOrFlush: await this.countingHistory(
          oldTurn?.gameHistory?.countThreeOfAKindOrStraightOrFlush,
          result?.threeOfAKindOrStraightOrFlush
        ),
        countFullHouse: await this.countingHistory(oldTurn?.gameHistory?.countFullHouse, result?.fullHouse),
        countFourOfAKindOrStraightFlushOrRoyalFlush: await this.countingHistory(
          oldTurn?.gameHistory?.countFourOfAKindOrStraightFlushOrRoyalFlush,
          result?.fourOfAKindOrStraightFlushOrRoyalFlush
        ),
        countIsAA: await this.countingHistory(oldTurn?.gameHistory?.countIsAA, result?.isAA),
        countIsHasPair: await this.countingHistory(oldTurn?.gameHistory?.countIsHasPair, result?.isHasPair),
        countIsFlush: await this.countingHistory(oldTurn?.gameHistory?.countIsFlush, result?.isFlush),
        jackpot:
          oldTurn?.gameHistory?.oldJackpot === undefined
            ? 1500000
            : oldTurn.gameHistory.oldJackpot === jackpot
              ? oldTurn.gameHistory?.jackpot + 250
              : jackpot < 0
                ? (Math.abs(jackpot - oldTurn.gameHistory.oldJackpot) * 0.015 + oldTurn.gameHistory.jackpot).toFixed(0)
                : oldTurn.gameHistory.jackpot + 250,
        oldJackpot: jackpot || oldTurn?.gameHistory?.oldJackpot || 0
      }

      const body = {
        dealer: dealer.result,
        player1: player1Cards,
        player2: player2Cards
      }

      const gameDetail = await this.repository.findByIdAndUpdate(id, { ...body, pack: [] })
      this.socketService.server.sockets.emit('pokerGameEnd', { ...body, _id: gameDetail._id.toString() })

      const historyTurn = await this.historyService.update(turnDetail.historyId, { gameHistory })

      this.socketService.server.sockets.emit('historyPokerTurn', {
        gameHistory: historyTurn.gameHistory,
        gameId: historyTurn.gameId
      })

      return gameDetail
    } catch (error) {
      throw new NotFoundException('Turn not found')
    }
  }

  /**
   * Create bet function
   *
   * @param request
   * @returns Created bet information
   */
  async betting(request: CreateHistoryRequest): Promise<History> {
    const { userId, gameId, detailedHistory } = request
    let total = 0
    let indexTable = [
      { key: 'red', value: 2 },
      { key: 'draw', value: 2 },
      { key: 'blue', value: 2 },
      { key: 'highCardOrOnePair', value: 2.2 },
      { key: 'twoPair', value: 3.1 },
      { key: 'threeOfAKindOrStraightOrFlush', value: 4.7 },
      { key: 'fullHouse', value: 20 },
      { key: 'fourOfAKindOrStraightFlushOrRoyalFlush', value: 240 },
      { key: 'isHasPair', value: 8.5 },
      { key: 'isAA', value: 100 },
      { key: 'isFlush', value: 1.66 }
    ]
    const ranking = await this.rankingService.getList({ userId, targetModel: ModalEnum.TEXAS_COWBOY })

    const gameDetail = await this.historyService.getList({ gameId })

    if (gameDetail?.docs?.[0]) {
      const calculateTotalCoins = (
        indexTable: { key: string; value: number }[],
        inputData: any[],
        resultObject: any
      ): any => {
        const indexMap = new Map(indexTable.map((item) => [item.key, item.value]))

        let totalCoins = 0
        let totalBetting = 0

        inputData.forEach(({ key, coin }) => {
          const resultCount = resultObject[`count${key.charAt(0).toUpperCase() + key.slice(1)}`]
          totalBetting += coin
          if (resultCount === 0) {
            const indexValue = indexMap.get(key)
            if (indexValue !== undefined) {
              totalCoins += (indexValue as number) * coin
            }
          }
        })

        return Number((totalCoins - totalBetting).toFixed(0))
      }

      if (detailedHistory.length) {
        total = calculateTotalCoins(indexTable, detailedHistory, gameDetail.docs?.[0].gameHistory)

        if (!ranking?.docs[0]?._id) {
          await this.rankingService.create({
            userId,
            targetModel: ModalEnum.TEXAS_COWBOY,
            totalCoin: total
          })
        } else
          this.rankingService.update(ranking?.docs[0]?._id, {
            totalCoin: ranking?.docs[0]?.totalCoin + total,
            oldCoin: ranking?.docs[0]?.totalCoin
          })

        const wallet = await this.walletSevice.getWalletByUserId(userId)
        await this.walletSevice.addCoin({ userId, coin: total })

        return await this.historyService.create({
          userId,
          gameId,
          totalCoin: total,
          oldCoin: wallet.coin,
          detailedHistory,
          targetModel: ModalEnum.BET
        })
      }
    }
    return undefined
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
    return this.repository.findAll(query, options)
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

  /**
   * findNowTurn function
   *
   * @param request
   * @returns findNowTurn history information
   */
  async findNowTurn(request: any): Promise<History> {
    return await this.repository.findPrev(request)
  }
}
