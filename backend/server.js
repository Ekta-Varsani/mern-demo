let express = require('express')
let mongoose = require('mongoose')

const port = process.env.PORT || 7000

const init = () => {
    console.log('called')
    require('./config/config')
    mongoose = require('./config/mongoose')
    express = require('./config/express')

    mongoose()
    const app = express()
    const server = require('http').createServer(app)

    server.listen(port, (error) => {
		if (error) console.log(error)
		else console.log('server listen from port no. : ' + `${port}`)
	})
	exports = module.exports = app
}

init()