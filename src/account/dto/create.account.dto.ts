import { IsUUID } from "class-validator"

export class createAccountDto {

    @IsUUID()
    userId: string

}