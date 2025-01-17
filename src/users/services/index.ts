import { Message, StatusEnum } from '@app/common'
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { ClientSession } from 'mongoose'
import { WalletService } from 'src/wallet/services'
import { CreateUserRequest } from '../dto/create.request'
import { UpdateUserRequest } from '../dto/update.request'
import { UserRepository } from '../repositories'
import { User } from '../schemas'

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UserRepository,
    private readonly walletSevice: WalletService
  ) {}

  /**
   * Create function
   *
   * @param request
   * @returns Created course information
   */
  async create(request: CreateUserRequest): Promise<User> {
    if (request.password !== request.confirmPassword)
      throw new ForbiddenException('Password and Confirm Password must be the same')

    const result = await this.repository.create({ ...request, password: await bcrypt.hash(request.password, 12) })
    const wallet = await this.walletSevice.create({ userId: result._id.toString(), coin: 5000 })

    return await this.update(result._id, { walletId: wallet._id.toString() })
  }

  /**
   * Get detail function
   *
   * @param getUserArgs
   * @returns Document
   */
  async get(id: Partial<User>): Promise<User> {
    const user = await this.repository.get({ _id: id })
    delete user.password
    return user
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
    return this.repository.findAll(query, {
      ...options,
      select: '-password'
    })
  }

  /**
   * Update function
   *
   * @param request
   * @returns Created document
   */
  async update(id: Partial<User>, request: UpdateUserRequest): Promise<User> {
    const session: ClientSession = await this.repository.startTransaction()
    try {
      const document = await this.repository.findByIdAndUpdate(id, request)
      await session.commitTransaction()

      return document
    } catch (error) {
      await session.abortTransaction()
      throw new NotFoundException('Không tìm thấy nguời dùng')
    } finally {
      session.endSession()
    }
  }

  /**
   * Validate user (Login) function
   *
   * @param account
   * @param password
   * @returns Login user information
   */
  async validateUser(account: string, password: string): Promise<User> {
    const user = await this.repository.get({
      $expr: {
        $or: [{ $eq: ['$email', account.toLowerCase()] }, { $eq: ['$phoneNumber', account] }]
      },
      _destroy: false
    })

    const passwordIsValid = await bcrypt.compare(password, user.password)

    if (!passwordIsValid) {
      throw new UnauthorizedException(Message.INVALID_PASSWORD)
    }

    if (user.accountStatus === StatusEnum.INACTIVE) {
      throw new UnauthorizedException(Message.INACTIVE_ACCOUNT)
    }

    delete user.password
    return user
  }

  /**
   * Remove function
   *
   * @param id
   * @returns Document
   */
  async destroy(id: string, body: any): Promise<User> {
    const { password } = body

    const user = await this.repository.get({ _id: id })
    const passwordIsValid = await bcrypt.compare(password, user.password)
    if (!passwordIsValid) {
      throw new UnauthorizedException(Message.INVALID_PASSWORD)
    }
    if (user.walletId) await this.walletSevice.destroy(user.walletId)
    return this.repository.destroy(id)
  }
}
