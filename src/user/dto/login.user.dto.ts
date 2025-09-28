import { IsEmail, IsNotEmpty } from "class-validator"

export class loginUserDto {
    
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    senha: string
}