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
    let initPlayerCards = [0, 0]
    const turn1 = await this.getRandomNumbersFromArray(initCard, 1)

    return await this.repository.create({
      dealer: turn1.result.concat(initPlayerCards, initPlayerCards),
      player1: initPlayerCards,
      player2: initPlayerCards,
      pack: initCard
    })
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
   * Update function
   *
   * @param request
   * @returns Created document
   */
  async update(id: Partial<Poker>): Promise<Poker> {
    let initCards = []
    try {
      const turnDetail = await this.repository.get({ _id: id })

      const dealer = await this.getRandomNumbersFromArray(turnDetail.pack, 4)
      initCards = dealer.arr

      if (turnDetail.dealer[2] !== 0) return turnDetail

      let dealerCards = await this.updateArray(turnDetail.dealer, dealer.result)

      const play1 = await this.getRandomNumbersFromArray(initCards, 2)

      const play2 = await this.getRandomNumbersFromArray(play1.arr, 2)

      const result = await this.gamePlay(dealerCards, [play1.result, play2.result])
      const oldTurn = await this.repository.findPrev()
      let gameHistory = undefined

      if (oldTurn?.gameHistory?.playerHistory?.length) {
        gameHistory = {
          playerHistory: await this.modifyArray(
            oldTurn.gameHistory.playerHistory,
            result.gameHistory.playerHistory,
            50
          ),
          highCardOrOnePair: await this.modifyArray(
            oldTurn.gameHistory.highCardOrOnePair,
            result.gameHistory.highCardOrOnePair,
            7
          ),
          twoPair: await this.modifyArray(oldTurn.gameHistory.twoPair, result.gameHistory.twoPair, 7),
          threeOfAKindOrStraightOrFlush: await this.modifyArray(
            oldTurn.gameHistory.fourOfAKindOrStraightFlushOrRoyalFlush,
            result.gameHistory.fourOfAKindOrStraightFlushOrRoyalFlush,
            7
          ),
          fullHouse: await this.modifyArray(oldTurn.gameHistory.fullHouse, result.gameHistory.fullHouse, 7),
          fourOfAKindOrStraightFlushOrRoyalFlush: await this.modifyArray(
            oldTurn.gameHistory.fourOfAKindOrStraightFlushOrRoyalFlush,
            result.gameHistory.fourOfAKindOrStraightFlushOrRoyalFlush,
            20
          ),
          isAA: await this.modifyArray(oldTurn.gameHistory.isAA, result.gameHistory.isAA, 15),
          isHasPair: await this.modifyArray(oldTurn.gameHistory.isHasPair, result.gameHistory.isHasPair, 15),
          isFlush: await this.modifyArray(oldTurn.gameHistory.isFlush, result.gameHistory.isFlush, 15)
        }
      } else {
        gameHistory = result.gameHistory
      }

      const body = {
        dealer: dealerCards,
        player1: play1.result,
        player2: play2.result,
        pack: [],
        result: result.result,
        gameHistory
      }

      return await this.repository.findByIdAndUpdate(id, body)
    } catch (error) {
      throw new NotFoundException('Không tìm thấy phiên chơi')
    }
  }

  async countingHistory(oldNum: number, check: boolean) {
    if (!check) {
      return oldNum + 1
    } else return 0
  }

  async gamePlay(dealerCards, players) {
    const getCardValue = (card) => {
      return ((card - 1) % 13) + 2
    }

    const getCardSuit = (card) => {
      const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
      return suits[Math.floor((card - 1) / 13)]
    }

    const getCard = (card) => {
      return {
        value: getCardValue(card),
        suit: getCardSuit(card)
      }
    }

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
      const isStraight = uniqueValues.length === 5 && values[4] - values[0] === 4
      const valueCounts = values.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1
        return acc
      }, {})
      const counts = Object.values(valueCounts).sort((a: number, b: number) => b - a)

      const highestCard = values[4]
      const highestCardSuit = suits[values.indexOf(highestCard)]

      // Royal Flush
      if (isStraight && isFlush && values[0] === 10)
        return { rank: 9, highCard: highestCard, highCardSuit: highestCardSuit }

      // Straight Flush
      if (isStraight && isFlush) return { rank: 8, highCard: highestCard, highCardSuit: highestCardSuit }

      // Four of a Kind
      if (counts[0] === 4)
        return {
          rank: 7,
          highCard: getKeyByValue(valueCounts, 4),
          highCardSuit: suits[values.indexOf(getKeyByValue(valueCounts, 4))]
        }

      // Full House
      if (counts[0] === 3 && counts[1] === 2)
        return {
          rank: 6,
          highCard: getKeyByValue(valueCounts, 3),
          highCardSuit: suits[values.indexOf(getKeyByValue(valueCounts, 3))]
        }

      // Flush
      if (isFlush) return { rank: 5, highCard: highestCard, highCardSuit: highestCardSuit }

      // Straight
      if (isStraight) return { rank: 4, highCard: highestCard, highCardSuit: highestCardSuit }

      // Three of a Kind
      if (counts[0] === 3)
        return {
          rank: 3,
          highCard: getKeyByValue(valueCounts, 3),
          highCardSuit: suits[values.indexOf(getKeyByValue(valueCounts, 3))]
        }

      // Two Pair
      if (counts[0] === 2 && counts[1] === 2)
        return {
          rank: 2,
          highCard: getKeyByValue(valueCounts, 2, true),
          highCardSuit: suits[values.indexOf(getKeyByValue(valueCounts, 2, true))]
        }

      // One Pair
      if (counts[0] === 2)
        return {
          rank: 1,
          highCard: getKeyByValue(valueCounts, 2),
          highCardSuit: suits[values.indexOf(getKeyByValue(valueCounts, 2))]
        }

      // High Card
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
        if (Object.values(valueCounts).some((count) => count === 2)) {
          if (valueCounts[14] === 2) {
            // Ace's value is 14
            AA = true
          }
        }
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
        if (values[i] !== values[i - 1] + 1) {
          return false
        }
      }
      return true
    }

    const hasStraightFlush = (hand) => {
      return hasFlush(hand) && hasStraight(hand)
    }

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
      return {
        ...pairInGame,
        isFlush,
        isStraight,
        isStraightFlush
      }
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

      return {
        anyPlayers,
        players: results.map((result, index) => {
          if (index === winner) {
            return { ...result, result: 'win' }
          } else {
            return { ...result, result: 'lose' }
          }
        })
      }
    }

    const result = getWinner(dealerCards, players)

    const playerHistory = result.players.filter((player) => player.result === 'win')
    const highCardOrOnePair = result.players.some((p) => p.rank === 0 || p.rank === 1)
    const twoPair = result.players.some((p) => p.rank === 2)
    const threeOfAKindOrStraightOrFlush = result.players.some((p) => p.rank === 3 || p.rank === 4 || p.rank === 5)
    const fullHouse = result.players.some((p) => p.rank === 6)
    const fourOfAKindOrStraightFlushOrRoyalFlush = result.players.some(
      (p) => p.rank === 7 || p.rank === 8 || p.rank === 9
    )

    const isAA = result.anyPlayers.isAA
    const isHasPair = result.anyPlayers.isHasPair
    const isFlush = result.anyPlayers.isFlush
    const gameHistory = {
      playerHistory: playerHistory[0],
      highCardOrOnePair,
      twoPair,
      threeOfAKindOrStraightOrFlush,
      fullHouse,
      fourOfAKindOrStraightFlushOrRoyalFlush,
      isAA,
      isHasPair,
      isFlush
    }

    return { result, gameHistory }
  }

  async modifyArray(oldArr, newData, limit) {
    if (!Array.isArray(oldArr) || typeof newData === 'undefined' || typeof limit !== 'number' || limit <= 0) {
      return null
    }
    if (oldArr.length < limit) return oldArr.concat(newData)
    else return oldArr.concat(newData).slice(1, limit + 1)
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

    arr = arr.filter((n) => !result.includes(n))

    return { result, arr }
  }

  /**
   * Rollback function
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
   * Remove function
   *
   * @param id
   * @returns Document
   */
  async destroy(id: string): Promise<Poker> {
    return await this.repository.destroy(id)
  }
}
