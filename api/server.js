const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('./DB'),

  http = require('http');

let socketIO = require('socket.io');
const businessRoute = require('./routes/business.route');

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/business', businessRoute);
const port = process.env.PORT || 4000;

let server = http.Server(app);

let io = socketIO(server);

io.on('connection', (socket) => {
  console.log('user connected: ', socket.id );

  socket.on('new-nick', (nickname) => {
    console.log('new user added, welcome ', socket.id, ' ', nickname )
    console.log();

    io.emit('new-nick');
  });
  socket.on('new-message', (message) => {
    console.log('new message, welcome ', message)
    console.log(message);
    io.emit('new-message', message);
  });
  socket.on('private-message',(message) => {
    console.log(message.receiver, ' socket on priv msg');
    socket.broadcast.to(message.receiver).emit('private-message', message)
  })
  socket.on('is-typing',(typing) => {
    console.log(typing, '   bol id ');
    socket.broadcast.to(typing.receiver).emit('is-typing', typing);
    //socket.broadcast.to(message.receiver).emit('private-message', message)
  })
});


server.listen(port, function(){
  console.log('Listening on port ' + port);
});
