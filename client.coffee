socket = io.connect '/'

socket.on 'connected', (data)->
	console.log 'connected'

socket.on 'online users', (data)->
	console.log data
	$('#users_online').html(data.count)
	if data.votes_cr
		showVotes data.votes

	if data.rooms
		for room, i in rooms
			$('#room_select').append("<option value='#{room}'>")

$('.buttons > div').on 'click', ->
	if @className == 'selected'
		return

	console.log 'send my vote'
	$('.buttons > div').removeClass 'selected'
	$(@).addClass 'selected'
	socket.emit 'vote change', {'vote': @getAttribute 'data-vote'}

showVotes = (votes)->
	$('#users_vote_0').html(votes[0])
	$('#users_vote_1').html(votes[1])
	$('#users_vote_2').html(votes[2])

socket.on 'votes', (data)->
	showVotes data