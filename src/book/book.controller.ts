import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {Query as ExpressQuery} from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';

@Controller('book')
export class BookController {
    constructor (private bookService: BookService) {}
    @Get()
    async findAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
        return this.bookService.getAllBooks(query)
    }

    @UseGuards(AuthGuard())
    @Post('create')
    async create(
        @Body()
        book: CreateBookDto,
        @Req() req
    ): Promise<Book> {
        console.log(req.user)
        return this.bookService.create(book, req.user)
    }

    @UseGuards(AuthGuard())
    @Get('getBookDetail/:id')
    async getBookDetail(
        @Param('id')
        id: string,
        @Req() req
    ): Promise<Book> {
        console.log(req.user)
        return this.bookService.getBookDetail(id, req.user)
    }

    @Put('updateBookDetail/:id')
    async updateBookDetail(
        @Param('id')
        id: string,

        @Body()
        book: UpdateBookDto
    ): Promise<Book> {
        return this.bookService.updateBook(id ,book)
    }

    @Delete('deleteBook/:id')
    async deleteBook(
        @Param('id')
        id: string
    ) {
        return this.bookService.deleteBook(id)
    }
}
