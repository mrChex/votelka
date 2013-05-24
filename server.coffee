app = require('express')()
server = require('http').createServer app
io = require('socket.io').listen server
io.set 'log level', 1

server.listen 8088

app.get '/', (req, res)->
	res.sendfile "#{__dirname}/index.html"

app.get '/client.js', (req, res)->
	res.sendfile "#{__dirname}/client.js"

app.get '/jquery-2.0.0.min.js', (req, res)->
	res.sendfile "#{__dirname}/jquery-2.0.0.min.js"

online_users = 0
votes = [0,0,0]

io.sockets.on 'connection', (socket)->
	socket.votes_count = 0
	socket.last_vote = 0

	online_users += 1
	console.log 'user connected'
	console.log votes
	votes[0] += 1

	socket.broadcast.emit 'online users', { count: online_users }
	socket.emit 'online users', {count: online_users, votes: votes}

	socket.on 'vote change', (data)->
		if data.vote >= 0 and data.vote <=2 and data.vote != socket.last_vote
			console.log 'vote received'
			votes[socket.last_vote] -= 1
			votes[data.vote] += 1
			console.log votes

			socket.last_vote = data.vote
			socket.emit 'votes', votes
			socket.broadcast.emit 'votes', votes

	socket.on 'disconnect', ->
		console.log 'user disconected'
		online_users -= 1
		votes[socket.last_vote] -= 1

		socket.broadcast.emit 'online users', { count: online_users }

