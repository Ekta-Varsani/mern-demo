import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/auth/schemas/user.schema";

export enum Category {
    ADVENTURE = 'adventure',
    CLASSICS = 'Classics',
    CRIME = 'Crime',
    FANTASY = 'Fantasy'
}

@Schema({
    timestamps: true
})

export class Book {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    author: string;

    @Prop()
    price: string;

    @Prop()
    category: Category;
    
    @Prop( { type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

}

export const BooksSchema = SchemaFactory.createForClass(Book)