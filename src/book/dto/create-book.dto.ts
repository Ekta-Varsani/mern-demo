import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Category } from "../schemas/book.schema";
import { User } from "../../auth/schemas/user.schema";

export class CreateBookDto {
    
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsNumber()
    readonly price: string;

    @IsNotEmpty()
    @IsEnum(Category, {message: 'Please enter valid category'})
    readonly category: Category;
    
    @IsNotEmpty()
    @IsString()
    readonly author: string;

    @IsEmpty({ message: 'You can not pass user id'})
    readonly user: User;
}