// Generated by CoffeeScript 1.6.2
(function() {
  var showVotes, socket;

  socket = io.connect('/');

  socket.on('connected', function(data) {
    return console.log('connected');
  });

  socket.on('online users', function(data) {
    console.log(data);
    $('#users_online').html(data.count);
    if (data.votes) {
      return showVotes(data.votes);
    }
  });

  $('.buttons > div').on('click', function() {
    if (this.className === 'selected') {
      return;
    }
    console.log('send my vote');
    $('.buttons > div').removeClass('selected');
    $(this).addClass('selected');
    return socket.emit('vote change', {
      'vote': this.getAttribute('data-vote')
    });
  });

  showVotes = function(votes) {
    $('#users_vote_0').html(votes[0]);
    $('#users_vote_1').html(votes[1]);
    return $('#users_vote_2').html(votes[2]);
  };

  socket.on('votes', function(data) {
    return showVotes(data);
  });

}).call(this);
