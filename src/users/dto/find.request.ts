import { Message, RoleEnum } from '@app/common'
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator'

class FilterQuery {
    @IsOptional()
    @IsString()
    fullName?: string

    @IsOptional()
    @IsString()
    phoneNumber?: string

    @IsOptional()
    @IsEmail({}, { message: Message.INVALID_EMAIL })
    email?: string

    @IsOptional()
    @IsBoolean()
    isMentor?: boolean

    @IsOptional()
    @IsString()
    search?: string

    @IsOptional()
    role?: RoleEnum

    @IsOptional()
    @IsString()
    groupId?: string
}

export class FindAllUserRequest {
    @IsOptional()
    filterQuery: FilterQuery

    @IsOptional()
    options: any
}
