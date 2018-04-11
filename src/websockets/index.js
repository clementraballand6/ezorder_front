var io = require('socket.io')();

io.on('connection', function(client){
    client.on('order.new', function (data) {
        console.log(data);
        client.broadcast.emit('order.new', data);
    })

    client.on('order.ready', function (data) {
        console.log(data);
        client.broadcast.emit('order.ready', data);
    })
});

io.listen(3333);