import config from './config.js'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import Room from './models/Room.js'
import cors from 'cors'

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

app.use(express.json())
app.use(cors({
    origin: config.server.cors,
    methods: ['GET', 'POST']
}))

const roomsStorage = new Map()

app.get('/rooms', (req, res) =>  {
    console.log('[ INFO ] "GET" request for rooms was sent')

    res.setHeader('Content-Type', 'application/json')
    let ctx = {rooms : []}
    if (roomsStorage.size === 0) return res.json(ctx)

    roomsStorage.forEach(room =>  {
        if (!room.isPublic && room.isFull) ctx.rooms.push({name: room.name, players: room.playersInRoom})
    })

    return res.json(ctx)
})

io.on("connection", (socket) => {
    socket.on('create-room', (roomName, isPublic) => {
        if (roomsStorage.has(roomName)) {
            socket.emit('create-room-status', { status: 'ERROR', message: 'Room with that name already exists'})
            console.log(`[ INFO ] Socket (${socket.id}) tired to create room with name that already exists`)
            return
        }

        const room = new Room(roomName, isPublic)
        roomsStorage.set(roomName, room)

        socket.emit('create-room-status', { status: 'OK', name: roomName })

        socket.join(roomName)
        console.log(`[ INFO ] Socket (${socket.id}) joined room ${roomName}`)

        room.addPlayer(socket.id)
        console.log(`[ INFO ] Socket (${socket.id}) was added to room ${roomName}`)
    })

    socket.on('join-room', (roomName) => {
        if (!roomsStorage.has(roomName)) {
            socket.emit('join-room-status',
                { status: 'ERROR', message: 'Cannot join room that does not exist'})
            console.log(`[ INFO ] Socket (${socket.id}) tried to join room that does not exists`)
            return
        }

        const room = roomsStorage.get(roomName)
        if (room.isFull) {
            socket.emit('join-room-status', { status: 'ERROR', message: 'Room is full'})
            console.log(`[ INFO ] Socket (${socket.id}) tried to join room that is full`)
            return
        }

        if (room.isStarted) {
            socket.emit('join-room-status', { status: 'ERROR', message: 'Game in room already started'})
            console.log(`[ INFO ] Socket (${socket.id}) tried to join room that started the game`)
            return
        }

        socket.join(roomName)
        console.log(`[ INFO ] Socket (${socket.id}) joined room ${roomName}`)

        room.addPlayer(socket.id)
        console.log(`[ INFO ] Socket (${socket.id}) was added to room ${roomName}`)
    })

    socket.on('leave-room', (roomName) => {
        socket.leave(roomName)
        console.log(`[ INFO ] Socket (${socket.id}) left room ${roomName}`)

        const room = roomsStorage.get(roomName)
        room.removePlayer(socket.id)

        if (room.playersInRoom === 0) {
            roomsStorage.delete(roomName)
            console.log(`[ INFO ] Room ${roomName} was deleted, because was empty`)
        }

    })
})

httpServer.listen(config.server.port, config.server.hostname, () => {
    console.log(`[ INFO ] Server is running (${config.server.hostname}:${config.server.port})`)
})