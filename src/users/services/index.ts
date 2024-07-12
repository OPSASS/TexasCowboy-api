import {
  Injectable
} from '@nestjs/common'
import { CreateUserRequest } from '../dto/create.request'
import { UserRepository } from '../repositories'
import { User } from '../schemas'

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UserRepository,
  ) {}

  /**
   * Create function
   *
   * @param request
   * @returns Created course information
   */
  async create(request: CreateUserRequest): Promise<User> {
    const result = await this.repository.create(request)

    return result
  }
 
  /**
   * Get detail function
   *
   * @param getUserArgs
   * @returns Document
   */
  async get(getUserArgs: Partial<User>): Promise<User> {
    const user = await this.repository.get({
      ...getUserArgs,
      _destroy: false,
    })
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
  async getList(
    filterQuery,
    options?
  ) {
    const query = { ...filterQuery }
    if (filterQuery.search) {
      query.$text = { $search: filterQuery.search }
    }
    return this.repository.findAll(query, {
      ...options,
      select: '-password',
    })
  }


}
