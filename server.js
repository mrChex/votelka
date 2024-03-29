// Generated by CoffeeScript 1.6.2
(function() {
  var app, io, online_users, room, rooms, server, votes;

  app = require('express')();

  server = require('http').createServer(app);

  io = require('socket.io').listen(server);

  io.set('log level', 1);

  server.listen(8088);

  app.get('/', function(req, res) {
    return res.sendfile("" + __dirname + "/index.html");
  });

  app.get('/client.js', function(req, res) {
    return res.sendfile("" + __dirname + "/client.js");
  });

  app.get('/jquery-2.0.0.min.js', function(req, res) {
    return res.sendfile("" + __dirname + "/jquery-2.0.0.min.js");
  });

  online_users = 0;

  rooms = ['Первый зал', 'Второй зал'];

  votes = (function() {
    var _i, _len, _results;

    _results = [];
    for (_i = 0, _len = rooms.length; _i < _len; _i++) {
      room = rooms[_i];
      _results.push([0, 0, 0]);
    }
    return _results;
  })();

  io.sockets.on('connection', function(socket) {
    socket.votes_count = 0;
    socket.last_vote = 0;
    socket.room = 0;
    online_users += 1;
    console.log('user connected');
    console.log(votes);
    votes[socket.room][0] += 1;
    socket.broadcast.emit('online users', {
      count: online_users,
      votes: votes
    });
    socket.emit('online users', {
      count: online_users,
      votes_cr: votes[socket.room],
      rooms: rooms
    });
    socket.on('vote change', function(data) {
      if (data.vote >= 0 && data.vote <= 2 && data.vote !== socket.last_vote) {
        console.log('vote received');
        votes[socket.room][socket.last_vote] -= 1;
        votes[socket.room][data.vote] += 1;
        console.log(votes);
        socket.last_vote = data.vote;
        socket.emit('votes', votes);
        return socket.broadcast.emit('votes', votes);
      }
    });
    return socket.on('disconnect', function() {
      console.log('user disconected');
      online_users -= 1;
      votes[socket.room][socket.last_vote] -= 1;
      return socket.emit('online users', {
        count: online_users,
        votes: votes
      });
    });
  });

}).call(this);
