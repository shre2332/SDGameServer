var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
const fs = require('fs');


/*const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')('ACf4c89b37da27698260483a56ca148d0e', '4b76bc4166bf0015287d63b4dbc2536b');
var ObjectId = require('mongodb').ObjectID;
var mongo = require('mongodb');*/

/*client.messages
  .create({
     body: 'Hey babe its Kurt.  I sent this from the app I am working on, so it can notify you when people are on and you can live chat with them through an application on your phone',
     from: '+18015066318',
     to: '+14326616779'
   })
  .then(message => console.log(message.sid));*/

//mongoose.connect('mongodb://kurt:kurt12@ds137827.mlab.com:37827/psocketio');

/*const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://homeTourUser:homeTourUser!123@cluster0.4bfky.mongodb.net/testDB?retryWrites=true&w=majority";
const clientDB = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });*/


/*clientDB.connect(err => {
  const collection = clientDB.db("testDB").collection("testCol");
  // perform actions on the collection object
  var myobj = { name: "Company Inc", address: "Highway 37" };
  collection.insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    clientDB.close();
  });
  
});*/

    /*clientDB.connect(err => {
      const collection = clientDB.db("testDB").collection("testCol");
      var query = { homeId: "TestHouse" };
      collection.createIndex( { homeId: "text" } );
      // perform actions on the collection object
      collection.find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        clientDB.close();
      });
      
    });*/

    /*clientDB.connect(err => {
      const collection = clientDB.db("testDB").collection("testCol");
      var query = { Projection: "TestHouse" };
      collection.createIndex( { homeId: "text" } );
      // perform actions on the collection object
      collection.find({}, { projection: { homeId: 1 } }).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        clientDB.close();
      });
      
    });*/

Games = [];

function makeRandString(length) {
  var result           = '';
  var characters       = '1'//'0123456789';//'abcdefghijklmnopqrstuvwxyz123456789';//'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makeJoinCode() {
 JoinCodeLength = 6;
 var JoinCode = "";
 unique = false;;
 while (!unique)
 {
   JoinCode = makeRandString(JoinCodeLength);
   unique = true;
   for(i=0; i < Games.length; i++)
   {
     if (Games[i].JoinCode === JoinCode)
     {
       unique = false;
       i = Games.length;
     } 
   }
 }
 return JoinCode;
}

function RemoveOldGame()
{
  if (Games.length > 0)
  {
    if (Games[Games.length-1].JoinCode === "0")
    {
      let popped = Games.pop();
      console.log(popped);
      RemoveOldGame();
    }
  }
}

var roundTime = 90000;
var timeBetweenRounds = 20000;
var timeToStart = 10000;
var lineQueue = [];
var inGameQueue = [];
var eggPositionIndex = 0;

setTimeout(InbetweenRoundsTimer, timeBetweenRounds);

function RoundTimer()
{
  io.emit('RoundOver');
  setTimeout(StartRoundTimer, timeToStart);
}

function StartRoundTimer()
{
  for (i=0; i<inGameQueue.length; i++)
  {
    var j = inGameQueue.shift();
    lineQueue.push(j);
  }
  for (i=0; i<10; i++)
  {
    if (lineQueue.length > 0)
    {
      var j = lineQueue.shift();
      inGameQueue.push(j);
    }
  }
  for (i=0; i<inGameQueue.length; i++)
  {
    io.to(inGameQueue[i]).emit('PlayAs', i);
    console.log(inGameQueue[i]+" Play as "+i);
  }
  for (i=0; i<lineQueue.length; i++)
  {
    io.to(lineQueue[i]).emit('LinePosition', (i+1));
    console.log(lineQueue[i]+" in line at "+i);
  }
  eggPositionIndex = Math.floor(Math.random() * 10);
  io.emit('EggPosition', eggPositionIndex);
  setTimeout(InbetweenRoundsTimer, timeBetweenRounds);
}

function InbetweenRoundsTimer()
{
  io.emit('RoundStart', roundTime);
  setTimeout(RoundTimer, roundTime);
}



io.on('connection', function(socket){
  console.log('a user connected: '+socket.id);

  socket.GameIndex = -1;
  socket.JoinCode = "";
  socket.GameId = -1;
  socket.Host = false;
  socket.Client = false;

  //-----------------GAME TEST----------------------

  socket.on('StartHost', function(input){
    console.log("RequestStartHost");
    hostRequest = JSON.parse(input);
    
    JoinCodeGenerated = makeJoinCode();

    socket.GameIndex = Games.length;
    socket.join(JoinCodeGenerated);
    socket.JoinCode = JoinCodeGenerated;
    socket.Host = true;
    socket.Client = false;

    Player = {
      PlayerId: 0,
      Name: hostRequest.Name,
      CodeName: "",
      Ready: false
    }
    
    Game = {
      JoinCode: JoinCodeGenerated,
      GameId: socket.GameIndex,
      Players: [],
      GameEnded: false
    }

    Game.Players.push(Player);

    Games.push(Game);
    socket.emit('HostStarted', JSON.stringify(Game));
  });

  socket.on('StartClient', function(input){
    socket.emit('JoinedGameSuccessfully');
    joinRequest = JSON.parse(input);
    foundGame = false;
    gameId = -1;
    for (i=0; i<Games.length; i++)
    {
      //console.log(Games[i]);
      if (Games[i].JoinCode === joinRequest.JoinCode)
      {
        foundGame = true;
        gameId = i;
      }
    }

    if (foundGame)
    {
      socket.join(Games[gameId].JoinCode);
      socket.GameIndex = gameId;
      socket.JoinCode = Games[gameId].JoinCode;
      socket.Host = false;
      socket.Client = true;

      Player = {
        PlayerId: Games[gameId].Players.length,
        Name: joinRequest.Name,
        CodeName: "",
        Ready: false
      }

      Games[gameId].Players.push(Player);
      console.log("Game[gameId]: "+Game[gameId]);
      console.log("Player: "+Player);
      socket.emit('GameJoined', JSON.stringify(Games[gameId]), JSON.stringify(Player));
      io.in(socket.JoinCode).emit('PlayerJoined', JSON.stringify(Games[gameId]));
    }
    else //foundGame == false
    {
      message = "No Game Found With Join Code "+joinRequest.JoinCode;
      socket.emit('JoinFailed', message);
      console.log(message);
    }
  });

  /*socket.on('StartController', function(input){
    console.log(input);
    gameDetails = JSON.parse(input);
    foundGame = false;
    for (i=0; i<Games.length; i++)
    {
      console.log(Games[i]);
      if (Games[i].JoinCode === gameDetails.JoinCode)
      {
        foundGame = true;
        socket.GameIndex = i;
      }
    }

    if (foundGame)
    {
      socket.JoinCode = gameDetails.JoinCode;
      socket.join(socket.JoinCode+"controllers");
      socket.Host = false;
      socket.Viewer = false;
      socket.ControllerViewerId = gameDetails.viewerId;

      socket.ClientId = Games[socket.GameIndex].NextClientId;
      Games[socket.GameIndex].NextClientId = Games[socket.GameIndex].NextClientId + 1;
      socket.Controller = true;

      io.in(socket.JoinCode+"viewers").emit('SpawnPlayer', gameDetails.userName, parseInt(gameDetails.team), socket.ClientId, parseInt(gameDetails.viewerId));
      socket.emit('JoinedGameSuccessfully');
    }
    else //foundGame == false
    {
      mes = {
        message: "No Game Found With Join Code "+gameDetails.JoinCode,
      }
      socket.emit('JoinFailed', JSON.stringify(mes));
      console.log(mes.message);
    }
  });*/

  socket.on('PlayerReady', function(){
    io.in(socket.JoinCode+"viewers").emit('PlayerReady', socket.GameId);
  });

  socket.on('LocalPlayerReady', function(input){
    io.in(socket.JoinCode+"viewers").emit('PlayerReady', input);
  });

  socket.on('ServerControlAction', function(input){
    //console.log(input);
    io.in(socket.JoinCode+"viewers").emit('ReceiveControlAction', input, socket.GameId);
  });

  socket.on('ServerControlActionLocalPlayer', function(type, direction, playerId, clientId){
    //console.log(input);
    io.in(socket.JoinCode+"viewers").emit('ReceiveControlActionVerbose', type, direction, playerId, clientId);
  });

  //for game jam game only-----------------------------------------------
  socket.on('SendServerControlCommand', function(control, clientId){
    io.emit('ReceiveControlCommand', control, clientId);
  });

  socket.on('PlayerWon', function(id){
    io.emit('PlayerWins', id);
  });

  socket.on('LatencyCheck', function(){
    socket.emit('LatencyCheckReceive');
  });
  //----------------------------------------------------------------------

  socket.on("disconnect", () => {
    if (lineQueue.includes(socket.id))
    {
      const index = lineQueue.indexOf(socket.id);
      if (index > -1) { // only splice array when item is found
        lineQueue.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    else if (inGameQueue.includes(socket.id))
    {
      const index = inGameQueue.indexOf(socket.id);
      if (index > -1) { // only splice array when item is found
        inGameQueue.splice(index, 1); // 2nd parameter means remove one item only
      }
    }

    if (socket.Host)
    {
      console.log("disconnect Host");
      Games[socket.GameIndex].JoinCode = "0";
      Games[socket.GameIndex].NextClientId = -1;
      io.in(socket.JoinCode+"viewers").emit('HostLeftGame', socket.ClientId);
      io.in(socket.JoinCode+"controllers").emit('HostLeftGame', socket.ClientId);
    }
    if (socket.Controller)
    {
      console.log("disconnect Controller");
      io.in(socket.JoinCode+"viewers").emit('PlayerLeftGame', socket.ClientId);
    }
    if (socket.Viewer)
    {
      console.log("disconnect Viewer");
      //do we need to tell anyone this?
    }

    RemoveOldGame();
  });

  socket.on('SendViewerCommand', function(input){
    socket.to(socket.JoinCode+"viewers").emit('ViewerCommand', input);
  });

  socket.on('SendControllerCommand', function(input){
    socket.to(socket.JoinCode+"controllers").emit('ReceiveControllerCommand', input);
  });

  socket.on('ActivateSwitchNetworked', function(input){
    socket.to(socket.JoinCode+"viewers").emit('ReceiveActivateSwitchNetworked', input);
  });

  socket.on('BroadcastPlayerStateUpdate', function(playerId, type, intVal, boolVal){
    socket.to(socket.JoinCode+"viewers").emit('ReceivePlayerStateUpdate', playerId, type, intVal, boolVal);
  });

  socket.on('BroadcastPlayerPositionUpdate', function(playerId, x, y){
    socket.to(socket.JoinCode+"viewers").emit('ReceivePlayerPositionUpdate', playerId, x, y);
  });

  socket.on('BroadcastPlayerPositionUpdateNew', function(playerId, x, y, z){
    socket.broadcast.emit('ReceivePlayerPositionUpdateNew', playerId, x, y, z);
  });

  //----------------GAME TEST END----------------------

  //var socketId = socket.id

  //socket.emit('GetHome', JSON.stringify(home));

  socket.on('SendChat', function(chatMessage){
    socket.emit('ReceiveChat', chatMessage);
  });
  
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});

//start node server as background process
//node /srv/www/MyUserAccount/server/server.js &
//node index.js &      <--------Use this-----------------------
//start node server as background process and pipe output somewhere other than the console
//node /srv/www/MyUserAccount/server/server.js > stdout.txt 2> stderr.txt &

//kill the process if the server crashed, get the PID and kill it
//lsof -i:3000 
//kill -9 [PID]

//this seems to work better:
//killall node