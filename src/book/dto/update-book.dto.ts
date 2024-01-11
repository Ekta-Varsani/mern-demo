import { IsEnum, IsNumber, IsOptional, IsString,IsEmpty } from "class-validator";
import { Category } from "../schemas/book.schema";
import { User } from "src/auth/schemas/user.schema";

export class UpdateBookDto {

    @IsOptional()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsNumber()
    readonly price: string;

    @IsOptional()
    @IsEnum(Category, {message: 'Please enter valid category'})
    readonly category: Category;

    @IsOptional()
    @IsString()
    readonly author: string;

    @IsEmpty({ message: 'You can not pass user id'})
    readonly user: User;
}
