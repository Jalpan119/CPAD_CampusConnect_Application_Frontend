const express = require('express');
var mysql = require('mysql');
var cors = require('cors');
const app = express();
const port = 8000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8100"
  }
});
const users = [];
const messageArray = {};

app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

count = 0; 
io.on('connection', (socket) => {
  socket.on('registerChat', (userId) => {
    let found = -1;
    users.forEach((ele, index)=>{
      if(ele.username === userId) {
        found = index;
      }
    });
    if(found === -1){
      users.push({
        sockId: socket.id,
        username: userId
      });
    } else {
      users[found] = {
        sockId: socket.id,
        username: userId
      }
    }
    
    console.log("connected users ", users);
  });

  socket.on('chat message', (msg) => {
    console.log('on message', socket.id);
    console.log('message to: ' + msg.to);
    console.log('message: ' + msg.message);
    console.log('message from: ' + msg.from);

    if(!messageArray[msg.from]){
      messageArray[msg.from] = {};
    }
    if(!messageArray[msg.from][msg.to]) {
      messageArray[msg.from][msg.to] = [];
    }
    messageArray[msg.from][msg.to].push({
      type: 'sent',
      to:  msg.to,
      message: msg.message,
      time: msg.time
    });
    for (let i=0; i<users.length; i++) {
      if(msg.to === users[i].username) {
        socket.to(users[i].sockId).emit("private message", {
          message: msg.message,
          from:  msg.from,
        });
        if(!messageArray[msg.to]){
          messageArray[msg.to] = {};
        }
        if(!messageArray[msg.to][msg.from]) {
          messageArray[msg.to][msg.from] = [];
        }
        messageArray[msg.to][msg.from].push({
          type: 'received',
          message: msg.message,
          from:  msg.from,
          time: msg.time
        });        
      }
    }
  });    
});


app.post('/allMessages', (req, res) => {
  const fromId =  req.body.from;
  console.log("from ", fromId);
  let result = messageArray[fromId] ? messageArray[fromId] : [];
  console.log('messages ', messageArray);
  console.log('result ', result);
  res.send(JSON.stringify(messageArray[fromId])); 
});


app.post('/allMessagesBetween', (req, res) => {
  const fromId =  req.body.from;
  const toId = req.body.to;
  const result = messageArray[fromId] && messageArray[fromId][toId] ? messageArray[fromId][toId] : [];
  res.send(JSON.stringify(result));  
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});






/** faculty data api End */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});