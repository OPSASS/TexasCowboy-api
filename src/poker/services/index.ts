import { ModalEnum } from '@app/common'
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
   * @returns Created poker information
   */
  async create(): Promise<Poker> {
    let initCard = Array.from({ length: 52 }, (_, k) => k + 1)
    initCard = initCard.sort(() => Math.random() - 0.5)
    let initPlayerCards = [0, 0, 0, 0, 0]
    const player1 = await this.getRandomNumbersFromArray(initCard, 1)
    const player2 = await this.getRandomNumbersFromArray(player1.arr, 1)

    const history = await this.historySevice.create({ targetModel: ModalEnum.TEXAS_COWBOY })

    const result = await this.repository.create({
      dealer: initPlayerCards,
      player1: player1.result.concat(0),
      player2: player2.result.concat(0),
      pack: player2.arr,
      historyId: history._id.toString()
    })

    await this.historySevice.update(history._id, { gameId: result._id.toString() })
    return result
  }

  /**
   * Update function
   *
   * @param request
   * @returns Update document
   */
  async update(id: Partial<Poker>): Promise<Poker> {
    let gameHistory = {}
    try {
      const turnDetail = await this.repository.get({ _id: id })

      if (turnDetail.dealer[2] !== 0) return turnDetail

      const player1 = await this.getRandomNumbersFromArray(turnDetail.pack, 1)

      const player2 = await this.getRandomNumbersFromArray(player1.arr, 1)

      const dealer = await this.getRandomNumbersFromArray(player2.arr, 5)

      const player1Cards = await this.updateArray(turnDetail.player1, player1.result)

      const player2Cards = await this.updateArray(turnDetail.player2, player2.result)

      const result = await this.gamePlay(dealer.result, [player1Cards, player2Cards])
      const oldTurn = await this.historySevice.findPrevData({ _destroy: false, targetModel: ModalEnum.TEXAS_COWBOY })

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
        countIsFlush: await this.countingHistory(oldTurn?.gameHistory?.countIsFlush, result?.isFlush)
      }

      const body = {
        dealer: dealer.result,
        player1: player1Cards,
        player2: player2Cards,
        pack: []
      }

      await this.historySevice.update(turnDetail.historyId, { gameHistory })
      return await this.repository.findByIdAndUpdate(id, body)
    } catch (error) {
      throw new NotFoundException('Không tìm thấy phiên chơi')
    }
  }

  async gamePlay(dealerCards, players) {
    const getCardValue = (card) => ((card - 1) % 13) + 2

    const getCardSuit = (card) => {
      const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
      return suits[Math.floor((card - 1) / 13)]
    }

    const getCard = (card) => ({
      value: getCardValue(card),
      suit: getCardSuit(card)
    })

    const rankToString = (rank) => {
      const ranks = [
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
      ]
      return ranks[rank]
    }

    const getKeyByValue = (object, value, secondHighest = false) => {
      const keys = Object.keys(object)
      if (secondHighest) {
        keys.sort((a, b) => object[b] - object[a])
        return keys[1]
      }
      return keys.find((key) => object[key] === value)
    }

    const getHandRank = (cards) => {
      const values = cards.map((card) => card.value).sort((a, b) => a - b)
      const suits = cards.map((card) => card.suit)
      const uniqueValues = [...new Set(values)]
      const uniqueSuits = [...new Set(suits)]

      const isFlush = uniqueSuits.length === 1
      const isStraight = uniqueValues.length === 5 && (values[4] - values[0] === 4 || values.join('') === '234514')
      const valueCounts = values.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1
        return acc
      }, {})
      const counts = Object.values(valueCounts).sort((a: number, b: number) => b - a)

      const highestCard = values[4]
      const highestCardSuit = suits[values.indexOf(highestCard)]

      if (isStraight && isFlush && values[0] === 10)
        return { rank: 9, highCard: highestCard, highCardSuit: highestCardSuit }
      if (isStraight && isFlush) return { rank: 8, highCard: highestCard, highCardSuit: highestCardSuit }
      if (counts[0] === 4) return { rank: 7, highCard: getKeyByValue(valueCounts, 4), highCardSuit: highestCardSuit }
      if (counts[0] === 3 && counts[1] === 2)
        return { rank: 6, highCard: getKeyByValue(valueCounts, 3), highCardSuit: highestCardSuit }
      if (isFlush) return { rank: 5, highCard: highestCard, highCardSuit: highestCardSuit }
      if (isStraight) return { rank: 4, highCard: highestCard, highCardSuit: highestCardSuit }
      if (counts[0] === 3) return { rank: 3, highCard: getKeyByValue(valueCounts, 3), highCardSuit: highestCardSuit }
      if (counts[0] === 2 && counts[1] === 2)
        return { rank: 2, highCard: getKeyByValue(valueCounts, 2, true), highCardSuit: highestCardSuit }
      if (counts[0] === 2) return { rank: 1, highCard: getKeyByValue(valueCounts, 2), highCardSuit: highestCardSuit }
      return { rank: 0, highCard: highestCard, highCardSuit: highestCardSuit }
    }

    const getCombinations = (arr, k) => {
      if (k > arr.length || k <= 0) return []
      if (k === arr.length) return [arr]
      if (k === 1) return arr.map((e) => [e])

      let combs = []
      let tailCombs = []

      for (let i = 0; i <= arr.length - k; i++) {
        tailCombs = getCombinations(arr.slice(i + 1), k - 1)
        for (let j = 0; j < tailCombs.length; j++) {
          combs.push([arr[i], ...tailCombs[j]])
        }
      }

      return combs
    }

    const getBestHandRank = (hand) => {
      const combinations = getCombinations(hand, 5)
      return combinations.reduce(
        (best, current) => {
          const currentRank = getHandRank(current)
          if (
            currentRank.rank > best.rank ||
            (currentRank.rank === best.rank && currentRank.highCard > best.highCard) ||
            (currentRank.rank === best.rank &&
              currentRank.highCard === best.highCard &&
              currentRank.highCardSuit > best.highCardSuit)
          ) {
            return currentRank
          }
          return best
        },
        { rank: -1, highCard: -1, highCardSuit: '' }
      )
    }

    const hasPair = (hand) => {
      const values = hand.map((card) => getCardValue(card))
      const valueCounts = values.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1
        return acc
      }, {})
      return Object.values(valueCounts).some((count) => count === 2)
    }

    const checkPairs = (players) => {
      let isHasPair = false
      let AA = false

      players.forEach((hand) => {
        const handValues = hand.map((card) => getCardValue(card))
        const valueCounts = handValues.reduce((acc, value) => {
          acc[value] = (acc[value] || 0) + 1
          return acc
        }, {})
        if (hasPair(hand)) isHasPair = true
        if (valueCounts[14] === 2) AA = true
      })

      return { isHasPair, isAA: AA }
    }

    const hasFlush = (hand) => {
      const suits = hand.map(getCard).map((card) => card.suit)
      const uniqueSuits = [...new Set(suits)]
      return uniqueSuits.length === 1
    }

    const hasStraight = (hand) => {
      const values = hand
        .map(getCard)
        .map((card) => card.value)
        .sort((a, b) => a - b)
      for (let i = 1; i < values.length; i++) {
        if (values[i] !== values[i - 1] + 1) return false
      }
      return true
    }

    const hasStraightFlush = (hand) => hasFlush(hand) && hasStraight(hand)

    const checkHands = (dealerCards, players) => {
      const allHands = [dealerCards, ...players]
      let pairInGame = checkPairs(players)
      let isFlush = false
      let isStraight = false
      let isStraightFlush = false

      allHands.forEach((hand) => {
        if (hasFlush(hand)) isFlush = true
        if (hasStraight(hand)) isStraight = true
        if (hasStraightFlush(hand)) isStraightFlush = true
      })

      return { ...pairInGame, isFlush, isStraight, isStraightFlush }
    }

    const getWinner = (dealerCards, players) => {
      const dealerHand = dealerCards.map(getCard)
      const anyPlayers = checkHands(dealerCards, players)
      let winner = null
      let highestRank = { rank: -1, highCard: -1, highCardSuit: '' }

      const results = players.map((player, index) => {
        const playerHand = [...dealerHand, ...player.map(getCard)]
        const playerRank = getBestHandRank(playerHand)

        if (
          playerRank.rank > highestRank.rank ||
          (playerRank.rank === highestRank.rank && playerRank.highCard > highestRank.highCard) ||
          (playerRank.rank === highestRank.rank &&
            playerRank.highCard === highestRank.highCard &&
            playerRank.highCardSuit > highestRank.highCardSuit)
        ) {
          highestRank = playerRank
          winner = index
        }

        return {
          playerIndex: index,
          rank: playerRank.rank,
          rankString: rankToString(playerRank.rank)
        }
      })

      let playersResult = results.map((result, index) => {
        if (winner === -1) {
          return { ...result, result: 'draw' }
        } else if (index === winner) {
          return { ...result, result: 'win' }
        } else {
          return { ...result, result: 'lose' }
        }
      })

      return { anyPlayers, players: playersResult }
    }

    const result = getWinner(dealerCards, players)
    const data = result.players
    const red = data.some((p) => p.playerIndex === 1 && p.result === 'win')
    const draw = data.every((p) => p.result === 'draw')
    const blue = data.some((p) => p.playerIndex === 0 && p.result === 'win')
    const highCardOrOnePair = data.some((p) => (p.rank === 0 || p.rank === 1) && p.result === 'win')
    const twoPair = data.some((p) => p.rank === 2)
    const threeOfAKindOrStraightOrFlush = data.some((p) => p.rank === 3 || p.rank === 4 || p.rank === 5)
    const fullHouse = data.some((p) => p.rank === 6)
    const fourOfAKindOrStraightFlushOrRoyalFlush = data.some((p) => p.rank === 7 || p.rank === 8 || p.rank === 9)
    const isHasPair = result.anyPlayers.isHasPair
    const isAA = result.anyPlayers.isAA
    const isFlush = result.anyPlayers.isFlush || result.anyPlayers.isStraight || result.anyPlayers.isStraightFlush

    const gameHistory = {
      playerHistory: data.filter((p) => p.result === 'win'),
      result: result.players,
      red,
      draw,
      blue,
      highCardOrOnePair,
      twoPair,
      threeOfAKindOrStraightOrFlush,
      fullHouse,
      fourOfAKindOrStraightFlushOrRoyalFlush,
      isAA,
      isHasPair,
      isFlush
    }

    return gameHistory
  }

  /**
   * modifyArray function
   *
   * @param oldArr
   * @param newData
   * @param limit
   * @returns new array
   */
  async modifyArray(oldArr: any, newData: any, limit: number) {
    let newArr = oldArr

    if (typeof newData === 'undefined' || typeof limit !== 'number' || limit <= 0) {
      return null
    }
    if (!newArr) newArr = []
    if (newArr.length < limit) return newArr.concat(newData)
    else return newArr.concat(newData).slice(1, limit + 1)
  }

  async updateArray(initArray, newArray) {
    let initIndex = 0
    let newIndex = 0

    while (initIndex < initArray.length && newIndex < newArray.length) {
      if (initArray[initIndex] === 0) {
        initArray[initIndex] = newArray[newIndex]
        newIndex++
      }
      initIndex++
    }

    return initArray
  }

  /**
   * getRandomNumbersFromArray function
   *
   * @param arr
   * @param num
   * @returns Number
   */
  async getRandomNumbersFromArray(arr: number[], num: number) {
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
   * couting function
   *
   * @param oldNum
   * @param check
   * @returns Couting data
   */
  async countingHistory(oldNum: number, check: boolean) {
    let newNum = oldNum
    if (!oldNum) newNum = 0
    if (!check) {
      return newNum + 1
    }
    return 0
  }

  /**
   * Create bet function
   *
   * @param request
   * @returns Created bet information
   */
  async betting(request): Promise<History> {
    const { userId, gameId, detailedHistory } = request
    let total = 0
    let indexTable = [
      { key: 'red', value: 2 },
      { key: 'draw', value: 20 },
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

    const gameDetail = await this.historySevice.getList({ gameId })

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

        return totalCoins - totalBetting
      }

      if (detailedHistory.length) {
        total = calculateTotalCoins(indexTable, detailedHistory, gameDetail.docs?.[0].gameHistory)
        const wallet = await this.walletSevice.getWalletByUserId(userId)
        await this.walletSevice.addCoin({ userId, coin: total })
        return await this.historySevice.create({
          userId,
          gameId,
          totalCoin: Number(total.toFixed(0)),
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
}
