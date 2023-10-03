const myUtils = require('./utils')
require('../utils/constant')
require('./errorCode')
require('./messageCode')
const fs = require('fs')

exports.middleware = function (lang, response, isSuccess) {
	try {
		const langCode = lang
		// const langCode = 'en'
		let json
		if (lang !== undefined) {
			json = require(`../utils/${langCode}.json`)
		} else json = require('../utils/en.json')
		if (isSuccess) json[langCode] !== undefined ? string = json[langCode].successCode[response] : string = json.en.successCode[response]
		else json[langCode] !== undefined ? string = json[langCode].errorCode[response] : string = json.en.errorCode[response]
		return {
			description: string,
			code: response
		}
	} catch (error) {
		console.log(error)
	}
}

exports.checkRequestParams = function (requestDataBody, paramsArray) {
	let missingParam = ''
	let isMissing = false
	let invalidParam = ''
	let isInvalidParam = false
	paramsArray.forEach(function (param) {
		if (requestDataBody[param.name] === undefined) {
			missingParam = param.name
			isMissing = true
		} else {
			// eslint-disable-next-line valid-typeof
			if (param.type && typeof requestDataBody[param.name] !== param.type) {
				isInvalidParam = true
				invalidParam = param.name
			}
		}
	})
	if (isMissing) throw ({ errorDescription: missingParam + ' ' + 'parameter missing' })
	else if (isInvalidParam) throw ({ errorDescription: invalidParam + ' ' + 'parameter invalid' })
}

exports.catchBlockErrors = function (lang, error, res) {
	if (error.errorCode || error.errorDescription) {
		const response = error.errorCode ? { success: false, ...myUtils.middleware(lang, error.errorCode, false) } : { success: false, description: error.errorDescription, errorCode: error.code }
		return res.json(response)
	} else if (error.message) {
		return res.json({
			success: false,
			description: error.message,
			code: 9999
		})
	}
	return res.json({
		success: false,
		...myUtils.middleware(lang, ERROR_CODE.SOMETHING_WENT_WRONG, false)
	})
}

exports.getStoreImageFolderPath = function (id) {
	return myUtils.getImageFolderName(id)
}

exports.getImageFolderName = function (id) {
	switch (id) {
	case FOLDER_NAME.USER_PROFILES:
		return 'userProfiles/'
	case FOLDER_NAME.USER_DOCUMENTS:
		return 'userDocuments/'
	default:
		break
	}
}

exports.getSaveImageFolderPath = function (id) {
	return './uploads/' + myUtils.getImageFolderName(id)
}

exports.storeImageToFolder = function (localImagePath, imageName, id) {
	const fileNewPath = myUtils.getSaveImageFolderPath(id) + imageName
	fs.readFile(localImagePath, function (error, data) {
		fs.writeFile(fileNewPath, data, 'binary', function (error) {
			if (error) console.log('Save file : ' + error)
			else if (fs.existsSync(localImagePath)) fs.unlinkSync(localImagePath)
		})
	})
}

exports.getStringWithFirstLetterUpperCase = function (inputString) {
	let string = inputString
	try {
		if (string !== '' && string !== undefined && string != null) {
			string = inputString.trim()
			string = string.charAt(0).toUpperCase() + string.slice(1)
		} else string = ''
		return string
	} catch (error) {
		string = ''
		return string
	}
}

exports.generateServerToken = function (length) {
	try {
		if (typeof length === 'undefined') { length = 32 }
		let token = ''
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		for (let i = 0; i < length; i++) { token += possible.charAt(Math.floor(Math.random() * possible.length)) }
		return token
	} catch (error) {
		console.error(error)
	}
}
