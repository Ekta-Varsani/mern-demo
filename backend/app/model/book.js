const mongoose = require('mongoose')
const schema = mongoose.Schema
var autoIncrement = require('mongoose-id-autoincrement');
// const autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(mongoose.connection)

const book = schema({
	// uniqueId: Number,
	bookName: { type: String, default: '' },
	author: { type: String, default: '' },
	publishYear: { type: String, default: '' },
	description: { type: String, default: '' },
	imageUrl: { type: String, default: '' },
    price: { type: Number, default: 0 },
    discountType: { type: Number, default: 1 },
    discountValue: { type: Number, default: 0 },
	createdAt: {
		type: Date,
		default: Date.now
	}
})

// book.plugin(autoIncrement.plugin, { model: 'book', field: 'uniqueId', startAt: 1, incrementBy: 1 })
module.exports = mongoose.model('book', book)