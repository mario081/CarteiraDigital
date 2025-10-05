import { IsEmail, IsNotEmpty, IsPositive } from "class-validator";

export class transferDto{

    @IsNotEmpty()
    @IsEmail()
    recipientEmail: string;

    @IsNotEmpty()
    @IsPositive()
    amount: number;



}