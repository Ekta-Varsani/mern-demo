const config = require('./config')
const mongoose = require('mongoose')

module.exports = () => {
    let db
	if (config.db) {
		db = mongoose.connect(config.db, {
			useUnifiedTopology: true,
			useNewUrlParser: true
		})
	}

	require('../app/model/user')

    return db
}