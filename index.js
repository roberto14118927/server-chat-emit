const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const { Server } = require('socket.io')
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
// Init App Next
const nextAppServer = next({ dev });
const nextHandler = nextAppServer.getRequestHandler();
const messages = [];



const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"]
  }
})

io.on('connection', socket => {

  console.log('Nueva conexión', socket.id)

  socket.on('message', (data) => {
    messages.push(data);
    // Agregar el broadcast emitir a todos la data menos al emisor
    socket.broadcast.emit('message', data)
    // socket.emit('Server:message', {name: socket.id, message:data})
  });
});

nextAppServer.prepare().then(() => {
  console.log('data');
  // URL PARA APUNTAR AL SERVICIO Y TRAER LOS MSJ
  app.get('/messages', (request, response) => {
    // RESPUESTA DE LOS MSJ
    response.json(messages);
  });

});

server.listen(3000, () => { console.log('Server inicializado') })