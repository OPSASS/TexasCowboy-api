import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { catchError, Observable, tap } from 'rxjs'

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(
        @InjectConnection()
        private readonly connection: Connection
    ) { }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        const httpContext = context.switchToHttp()
        const req = httpContext.getRequest()

        const session = await this.connection.startSession()

        session.startTransaction()
        req.session = session
        return next.handle().pipe(
            tap(() => {
                session.commitTransaction()
                session.endSession()
            }),
            catchError((err) => {
                session.abortTransaction()
                session.endSession()
                throw err
            })
        )
    }
}
