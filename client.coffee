socket = io.connect '/'

socket.on 'connected', (data)->
	console.log 'connected'

socket.on 'news', (data)->
	console.log data