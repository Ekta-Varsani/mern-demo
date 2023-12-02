const mongoose = require('mongoose')
const schema = mongoose.Schema
// var autoIncrement = require('mongoose-id-autoincrement');

// // const autoIncrement = require('mongoose-auto-increment')
// autoIncrement.initialize(mongoose.connection)
// "mongoose-id-autoincrement": "^1.0.4", --- package.json

const user = schema({
	// uniqueId: {type: Number, default: 0, unique: true},
	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	email: { type: String, default: '' },
	phoneNumber: { type: String, default: '' },
	imageUrl: { type: String, default: '' },
	createdAt: {
		type: Date,
		default: Date.now
	}
})

// user.plugin(autoIncrement.plugin, { model: 'user', field: 'uniqueId', startAt: 1, incrementBy: 1 })
module.exports = mongoose.model('user', user)