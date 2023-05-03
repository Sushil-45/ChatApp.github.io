 const express = require('express');
 const app = express();
 const http =  require('http').Server(app);
 const io = require('socket.io')(http);
 const path = require('path');
 //serve  public directory
app.use(express.static(path.join(__dirname,'')));
 
app.get('/', (req,resp) => {
    resp.sendFile(path.join(__dirname, + 'index.html'))
});

io.on('connection', socket =>  {
    console.log('user connected');

    socket.on('disconnect',() => {
        console.log('user disconnected');
    });

    socket.on('message' , (message) => {
        console.log('message ', message);
        //broadcast  message
        io.emit('message',message);
    });
});

 http.listen(3000, () => {
    console.log("hi 3000");
 });