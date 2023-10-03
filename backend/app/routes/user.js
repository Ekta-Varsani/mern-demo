const express = require('express')
const router = express.Router()

const user = require('../controllers/user')

router.post('/user/addUser', user.userRegistration)
router.post('/user/updateUser', user.updateUser)
router.post('/user/deleteUser', user.deleteUser)
router.post('/user/getUserListSearchSort', user.getUserListSearchSort)
router.post('/user/getUserDetail', user.getUserDetail)
module.exports = router