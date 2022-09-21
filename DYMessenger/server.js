var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res){
    var username = req.url;
    console.log(username + "------------");
    
    switch (username) {
        case '/over18':
            res.writeHead(200, {'Content-Type':'text/html'});
            fs.readFile(__dirname + '/htmlFile.html', function(err, data) {
                if (err) throw err;
                console.log(data);
                res.write(data);
                res.end();
            });
            break;
        case '/under18':
            res.writeHead(200, {'Content-Type':'text/html'});
            fs.readFile(__dirname + '/html_file.html', function(err, data) {
                if (err) throw err;
                console.log(data);
                res.write(data);
                res.end();
            });
            break;
    
        default:
            res.writeHead(200, {'Content-Type':'text/html'});
            fs.readFile(__dirname + '/index.html', function(err, data) {
                if (err) throw err;
                console.log(data);
                res.write(data);
                res.end();
            });
            break;
    }
}).listen(1337,'127.0.0.1');

var io = require('socket.io')(server, {
    cors: {
        origin: "http://127.0.0.1:1337",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

io.sockets.on('connection', function(socket){
    var register;
    var gender;
    var room;
    socket.on('channelfixer', function(mychannel){
        socket.join(mychannel);
        room = mychannel;
    });

    console.log('Connection successful');
    socket.on('register', function(username,gndr){
        register=username;
        gender=gndr;
    });

    socket.on('message', function(msg){
        io.to(room).emit('message', msg, register, gender);
    });
    socket.on('disconnect',function(){ });

});




console.log('Server running at http://127.0.0.1:1337/');