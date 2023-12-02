require('../utils/messageCode')
require('../utils/errorCode')
require('../utils/constant')
const mongoose = require('mongoose')
const utils = require('../utils/utils')
const User = require('mongoose').model('user')
const stripe = require('stripe')('sk_test_51LGcrmItXZ8PhVwXc8CnghuVOPiwde0Qlv5LkIWg8aqob1GlfAHLLjchuxAfV4WXUiEvzB8ElFt4NTGRrzsFf3xK00N40tQcUi');

exports.userRegistration = async (req, res) => {
	try {
		await utils.checkRequestParams(req.body, [{ name: 'phoneNumber', type: 'string' }, { name: 'firstName', type: 'string' }, { name: 'email', type: 'string' }])
		const requestDataBody = req.body

		const emailUser = await User.findOne({ email: requestDataBody.email })
		if (emailUser) throw ({ errorCode: USER_ERROR_CODE.EMAIL_ALREADY_REGISTERED })

		const phoneUser = await User.findOne({ phoneNumber: requestDataBody.phoneUser })
		if (phoneUser) throw ({ errorCode: USER_ERROR_CODE.PHONE_NUMBER_ALREADY_REGISTERED })

		requestDataBody.firstName = utils.getStringWithFirstLetterUpperCase(requestDataBody.firstName)
		requestDataBody.lastName = utils.getStringWithFirstLetterUpperCase(requestDataBody.lastName)

		const userData = new User(requestDataBody)
		const imageFile = req.files
		if (imageFile !== undefined && imageFile.length > 0) {
			const imageName = userData._id + utils.generateServerToken(4)
			const url = utils.getStoreImageFolderPath(FOLDER_NAME.USER_PROFILES) + imageName + '.jpg'
			userData.imageUrl = url
			utils.storeImageToFolder(imageFile[0].path, imageName + '.jpg', FOLDER_NAME.USER_PROFILES)
		}

		const newUser = await userData.save()
		if (!newUser) throw ({ errorCode: USER_ERROR_CODE.USER_NOT_SAVED })

		return res.json({ success: true, ...utils.middleware(req.headers.lang, USER_MESSAGE_CODE.REGISTER_SUCCESSFULLY, true) })

	} catch (error) {
		console.log(error);
		utils.catchBlockErrors(req.headers.lang, error, res)
	}
}

exports.updateUser = async (req, res) => {
	try {
		await utils.checkRequestParams(req.body, [{ name: 'userId', type: 'string' }])
		const requestDataBody = req.body

		const user = await User.findOne({ _id: new mongoose.Types.ObjectId(requestDataBody.userId) })
		if (!user) throw ({ errorCode: USER_ERROR_CODE.USER_DATA_NOT_FOUND })

		const emailUser = await User.findOne({ email: requestDataBody.email, _id: { $ne: new mongoose.Types.ObjectId(requestDataBody.userId) } })
		if (emailUser) throw ({ errorCode: USER_ERROR_CODE.EMAIL_ALREADY_REGISTERED })

		const phoneUser = await User.findOne({ _id: { $ne: new mongoose.Types.ObjectId(requestDataBody.userId) }, phoneNumber: requestDataBody.phoneUser })
		if (phoneUser) throw ({ errorCode: USER_ERROR_CODE.PHONE_NUMBER_ALREADY_REGISTERED })

		requestDataBody.firstName = utils.getStringWithFirstLetterUpperCase(requestDataBody.firstName)
		requestDataBody.lastName = utils.getStringWithFirstLetterUpperCase(requestDataBody.lastName)

		const imageFile = req.files
		if (imageFile !== undefined && imageFile.length > 0) {
			const imageName = user._id + utils.generateServerToken(4)
			const url = utils.getStoreImageFolderPath(FOLDER_NAME.USER_PROFILES) + imageName + '.jpg'
			requestDataBody.imageUrl = url
			utils.storeImageToFolder(imageFile[0].path, imageName + '.jpg', FOLDER_NAME.USER_PROFILES)
		}

		const updatedUser = await User.findByIdAndUpdate(requestDataBody.userId, requestDataBody, { new: true })
		if (!updatedUser) throw ({ errorCode: USER_ERROR_CODE.UPDATE_FAILED })

		return res.json({ success: true, ...utils.middleware(req.headers.lang, USER_MESSAGE_CODE.UPDATED_SUCCESSFULLY, true) })

	} catch (error) {
		console.log(error);
		utils.catchBlockErrors(req.headers.lang, error, res)
	}
}

exports.deleteUser = async (req, res) => {
	try {
		await utils.checkRequestParams(req.body, [{ name: 'userId', type: 'string' }])
		const requestDataBody = req.body

		const user = await User.findOne({ _id: new mongoose.Types.ObjectId(requestDataBody.userId) })
		if (!user) throw ({ errorCode: USER_ERROR_CODE.USER_DATA_NOT_FOUND })

		await User.findByIdAndDelete(requestDataBody.userId)
		return res.json({ success: true, ...utils.middleware(req.headers.lang, USER_MESSAGE_CODE.USER_DELETED_SUCCESSFULLY, true) })

	} catch (error) {
		console.log(error);
		utils.catchBlockErrors(req.headers.lang, error, res)
	}
}

exports.getUserListSearchSort = async (req, res) => {
	try {
		await utils.checkRequestParams(req.body, [])

		const requestDataBody = req.body
		const numberOfRecord = Number(requestDataBody.numberOfRecord) || 5
		const page = Number(requestDataBody.page) || 1
		const searchField = requestDataBody.searchField
		let searchValue = requestDataBody.searchValue
		let search

		const sort = { $sort: {} }
		sort.$sort._id = parseInt(-1)
		let count = { $group: { _id: null, count: { $sum: 1 }, data: { $push: '$data' } } }
		const skip = {}
		skip.$skip = (page * numberOfRecord) - numberOfRecord
		const limit = {}
		limit.$limit = numberOfRecord

		const start = (page * numberOfRecord) - numberOfRecord
		const end = numberOfRecord
		count = { $group: { _id: null, count: { $sum: 1 }, result: { $push: '$$ROOT' } } }
		const project1 = { $project: { count: 1, data: { $slice: ['$result', start, end] } } }

		searchValue = searchValue.replace(/^\s+|\s+$/g, '')
		searchValue = searchValue.replace(/ +(?= )/g, '')

		// if (searchField === 'firstName') {
		// 	const query1 = {}
		// 	const query2 = {}
		// 	const query3 = {}
		// 	const query4 = {}
		// 	const query5 = {}
		// 	const query6 = {}
		// 	const fullName = searchValue.split(' ')
		// 	if (typeof fullName[0] === 'undefined' || typeof fullName[1] === 'undefined') {
		// 		query1[searchField] = { $regex: new RegExp(searchValue, 'i') }
		// 		query2.lastName = { $regex: new RegExp(searchValue, 'i') }

		// 		search = { $match: { $or: [query1, query2] } }
		// 	} else {
		// 		query1[searchField] = { $regex: new RegExp(searchValue, 'i') }
		// 		query2.lastName = { $regex: new RegExp(searchValue, 'i') }
		// 		query3[searchField] = { $regex: new RegExp(fullName[0], 'i') }
		// 		query4.lastName = { $regex: new RegExp(fullName[0], 'i') }
		// 		query5[searchField] = { $regex: new RegExp(fullName[1], 'i') }
		// 		query6.lastName = { $regex: new RegExp(fullName[1], 'i') }
		// 		search = { $match: { $or: [query1, query2, query3, query4, query5, query6] } }
		// 	}
		// } 
		// else {
		const query = {}
		query[searchField] = { $regex: new RegExp(searchValue, 'i') }
		search = { $match: query }
		// }

		const users = await User.aggregate([search, sort, count, project1])
		if (users.length === 0) return res.json({ success: true, responseData: [], count: 0 })

		return res.json({
			success: true,
			...utils.middleware(req.headers.lang, USER_MESSAGE_CODE.USER_LIST_SUCCESSFULLY, true),
			responseData: users[0].data,
			count: users[0].count
		})
	} catch (error) {
		utils.catchBlockErrors(req.headers.lang, error, res)
	}
}

exports.getUserDetail = async (req, res) => {
	try {
		await utils.checkRequestParams(req.body, [{ name: 'userId', type: 'string' }])
		const requestDataBody = req.body

		const user = await User.findOne({ _id: { $eq: new mongoose.Types.ObjectId(requestDataBody.userId) } })

		if (!user) throw ({ errorCode: USER_ERROR_CODE.USER_DATA_NOT_FOUND })

		return res.json({ success: true, responseData: user })
	} catch (error) {
		utils.catchBlockErrors(req.headers.lang, error, res)
	}
}

exports.createStripeProduct = async (req, res) => {
	try {
		// prod_P71l2NO5CSpbWe
		// const product = await stripe.products.create({
		// 	name: 'Gold Special',
		// });
		const price = await stripe.prices.create({
			unit_amount: 2000,
			currency: 'usd',
			recurring: {interval: 'month'},
			product: 'prod_P71l2NO5CSpbWe',
		  });
		return res.json({ success: true, responseData: price })
	} catch (error) {
		utils.catchBlockErrors(req.headers.lang, error, res)
	}
}

exports.stripCheckout = async (req, res) => {
	try {
		console.log(req.host)
		const session = await stripe.checkout.sessions.create({
			line_items: [
			{
				// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
				price: 'price_1OInjeItXZ8PhVwXKzOFTU7P',
				quantity: 1,
			},
			],
			mode: 'subscription',
			success_url: 'http://localhost:3001/',
			cancel_url: 'http://localhost:3001/',
		});
		console.log(session.url)
		res.redirect(303, session.url);
	} catch (error) {
		utils.catchBlockErrors(req.headers.lang, error, res)
	}
}