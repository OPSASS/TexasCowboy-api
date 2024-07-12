import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class ConvertObjectIdInterceptor implements NestInterceptor {
  constructor() {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp()
    const body = httpContext.getRequest().body
    if (body.educations) {
      console.log(body.educations)
    }

    return next.handle()
  }
}
