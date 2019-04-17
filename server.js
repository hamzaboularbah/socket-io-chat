var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];


let updateUsernames = () => {
  io.sockets.emit('get users', users);
}

server.listen(process.env.PORT || 3000, () => {
  console.log('server runnig...');
});

app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection' , function(socket){
  connections.push(socket);
  console.log('Connected : %s sockets connected', connections.length);

  //Dissconnet
  socket.on('disconnect', (data) => {
    users.splice(users.indexOf(socket.username),1);
    updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });
  //Send Message
  socket.on('send message' , (data) => {
    io.sockets.emit('new message' ,{msg: data, user: socket.username});
  });

  // new User
  socket.on('new user', (data, callback) => {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();

  });
});
