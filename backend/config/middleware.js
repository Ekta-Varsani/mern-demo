const utils = require('../app/utils/utils')
require('../app/utils/messageCode')
require('../app/utils/errorCode')

module.exports = middleware = async function (req, res, next) {
	try {
		const oldJSON = res.json
		res.json = (data) => {
			oldJSON.call(res, data)
		}
		next()
	} catch (error) {
		next(error)
	}
}