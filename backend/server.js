let express = require('express')
let mongoose = require('mongoose')

const port = process.env.PORT || 7000

const init = () => {
    require('./config/config')
    mongoose = require('./config/mongoose')
    express = require('./config/express')

    mongoose()
    const app = express()
    const server = require('http').createServer(app)

    const io = require('socket.io')(server, {
      cors: {
        origin: '*'
      }
    })

    io.on('connection', (socket) => {
		  console.log('connected')

      socket.emit('logOut', {user: 'ekta'}, (response) => {
        console.log(response)
      })
	  })

    server.listen(port, (error) => {
		if (error) console.log(error)
		else console.log('server listen from port no. : ' + `${port}`)
	})
	exports = module.exports = app
}

init()