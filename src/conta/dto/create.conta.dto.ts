import { IsUUID } from "class-validator"

export class createContaDto {

    @IsUUID()
    userId: string

}