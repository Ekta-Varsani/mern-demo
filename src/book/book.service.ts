import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';
import { Query } from 'express-serve-static-core'
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class BookService {
    constructor (
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async getAllBooks(query: Query): Promise<Book[]> {
        const recordsPerPage = 1
        const page = Number(query.page) || 1
        const skip = recordsPerPage * (page - 1)
        const search = query.search ? {
            title: {
                $regex: query.search,
                $options: 'i'
            }
        } : {}
        const books = await this.bookModel.find({ ...search }).limit(recordsPerPage).skip(skip)
        return books
    }

    async create(book: Book, user: User): Promise<Book> {
        const data = Object.assign(book, { user: user._id })
        const res = await this.bookModel.create(data)
        return res
    }

    async getBookDetail(id: string, user: User): Promise<Book> {
        const book = await this.bookModel.findById(id)

        const isValidId = mongoose.isValidObjectId(id)
        if(!isValidId) throw new BadRequestException('Please enter correct id')

        if(!book) throw new NotFoundException('Book not found')
        return book
    }

    async updateBook(id: string, book: Book): Promise<Book> {
        return await this.bookModel.findByIdAndUpdate(id, book, {
            new: true,
            runValidators: true
        })
    }

    async deleteBook(id: string) {
        return await this.bookModel.findByIdAndDelete(id)
    }
}
