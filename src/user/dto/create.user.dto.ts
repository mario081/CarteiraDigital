import { IsEmail, IsNotEmpty } from "class-validator"

export class createUserDto {
    
    @IsNotEmpty()
    name: string 

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}
