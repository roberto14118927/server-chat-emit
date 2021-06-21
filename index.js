const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const { Server} = require('socket.io')
const io = new Server(server, {
    cors: {
      methods: ["GET", "POST"]
    }
  })

app.get('/', (req,res)=>{
    res.send('<h1>Hola Juan</h1>')
})

io.on('connection', socket =>{

    console.log('Nueva conexión', socket.id)

    socket.on('message', (data) => {
        socket.emit('Server:message', {name: socket.id, message:data})
    })
})

server.listen(3000, ()=>{console.log('Server inicializado')})