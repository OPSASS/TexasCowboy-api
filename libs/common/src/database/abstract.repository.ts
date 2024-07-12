import { Logger, NotFoundException } from '@nestjs/common'
import {
  Connection,
  FilterQuery,
  PaginateModel,
  QueryOptions,
  SaveOptions,
  Types,
  UpdateQuery
} from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { AbstractDocument } from './abstract.schema'

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger

  constructor(
    protected readonly model: PaginateModel<TDocument>,
    private readonly connection: Connection
  ) {
    this.model.schema.plugin(paginate)
  }

  async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    })

    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument
  }

  // async createMany(
  //   documents: Array<Omit<TDocument, '_id'>>,
  //   options?: SaveOptions
  // ): Promise<TDocument[]> {
  //   return this.model.insertMany(
  //     documents.map((document) => {
  //       return { ...document, _id: new Types.ObjectId() }
  //     }),
  //     options
  //   )
  // }

  async get(
    filterQuery: FilterQuery<TDocument>,
    options?: QueryOptions
  ): Promise<TDocument | any> {
    const document = await this.model.findOne(
      { _destroy: false, ...filterQuery },
      {},
      { ...options, lean: true }
    )

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery)
      throw new NotFoundException(
        `Không tìm thấy thông tin ${this.model.modelName}`
      )
    }

    return document
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>
  ) {
    const document = await this.model.findOneAndUpdate(
      { _destroy: false, ...filterQuery },
      update,
      {
        lean: true,
        new: true,
      }
    )

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery)
      throw new NotFoundException(
        `Không tìm thấy thông tin ${this.model.modelName}`
      )
    }

    return document
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>
  ) {
    return this.model.findOneAndUpdate(
      { _destroy: false, ...filterQuery },
      { $set: document },
      {
        lean: true,
        upsert: true,
        new: true,
      }
    )
  }

  async updateMany(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options?
  ): Promise<TDocument | any> {
    return this.model.updateMany(filterQuery, update, options)
  }

  async deleteMany(
    filterQuery: FilterQuery<TDocument>,
    options?
  ): Promise<TDocument | any> {
    return this.model.deleteMany(filterQuery, options)
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
    options?: QueryOptions
  ): Promise<TDocument | any> {
    return this.model.find(
      { _destroy: false, ...filterQuery },
      {},
      { ...options, lean: true }
    )
  }

  async findAll(
    filterQuery: FilterQuery<TDocument | any>,
    options
  ) {
    const sort = options?.sort ? options.sort : { name: 1 }
    return this.model.paginate(
      { _destroy: false, ...filterQuery },
      { select: '-_destroy', ...options, sort: sort }
    )
  }

  async destroy(id: string) {
    const document = await this.model.findOne(
      { _id: new Types.ObjectId(id), _destroy: false },
      {},
      { lean: true }
    )
    if (!document) {
      throw new NotFoundException(
        `Không tìm thấy thông tin ${this.model.modelName}`
      )
    }

    return this.model.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { _destroy: true },
      { lean: true }
    )
  }

  // async aggregate(
  //   pipeline?: PipelineStage[],
  //   options?: AggregateOptions,
  //   callback?: Callback<any[]>
  // ) {
  //   return this.model.aggregate(pipeline, options, callback)
  // }

  async maxPosition(group: string, query: any): Promise<number> {
    const find = await this.model.aggregate([
      { $match: query },
      {
        $group: {
          _id: `${group}`,
          maxPosition: { $max: '$position' },
        },
      },
    ])
    return find.length > 0 ? Number(find[0].maxPosition) : 0
  }

  async findNext(id: string) {
    const target = await this.model.findOne({
      _id: new Types.ObjectId(id),
      _destroy: false,
    })
    if (!target) {
      throw new NotFoundException(
        `Không tìm thấy thông tin ${this.model.modelName}`
      )
    }

    const result = await this.model.aggregate([
      {
        $match: {
          $and: [
            {
              position: {
                $gt: target.position,
              },
            },
            {
              parentId: {
                $eq: target.parentId,
              },
            },
            { _destroy: false },
          ],
        },
      },
      {
        $sort: {
          position: 1,
        },
      },
      {
        $limit: 1,
      },
    ])

    return result[0]
  }

  async startTransaction() {
    const session = await this.connection.startSession()
    session.startTransaction()

    return session
  }
}
