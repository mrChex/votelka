app = require('express')()
server = require('http').createServer app
io = require('socket.io').listen server

server.listen 8088

app.get '/', (req, res)->
	res.sendfile "#{__dirname}/index.html"

app.get '/client.js', (req, res)->
	res.sendfile "#{__dirname}/client.js"

io.sockets.on 'connection', (socket)->
	socket.emit 'news', { hello: 'world' }
	socket.on 'my other event', (data)->
		console.log data