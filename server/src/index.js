import config from './config.js'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import Room from './models/Room.js'
import cors from 'cors'


const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: config.server.cors })

app.use(express.json())
app.use(cors(config.server.cors))

const roomsStorage = new Map()
roomsStorage.set('test-room', new Room('test-room', true))

app.get('/rooms', (req, res) =>  {
    res.setHeader('Content-Type', 'application/json')
    let ctx = {rooms : []}
    if (roomsStorage.size === 0) return res.json(ctx)

    roomsStorage.forEach(room =>  {
        if (room.isPublic && !room.isFull) ctx.rooms.push({name: room.name, players: room.playersInRoom})
    })

    return res.json(ctx)
})

app.get('*', (req, res) => {
    return res.json({ status: 404, message: 'Not found'})
})

io.on("connection", (socket) => {
    socket.on('create-room', (roomName, isPublic) => {
        if (roomsStorage.has(roomName)) {
            socket.emit('create-room-status', { status: 'ERROR', message: 'Room with that name already exists', name: ''})
            console.log(`[ INFO ] Socket (${socket.id}) tired to create room with name that already exists`)
            return

        }
        const room = new Room(roomName, isPublic)
        roomsStorage.set(roomName, room)

        socket.join(roomName)
        socket.emit('create-room-status', { status: 'OK', message: 'User joined the room', name: roomName })
        console.log(`[ INFO ] Socket (${socket.id}) joined room ${roomName} (${isPublic ? 'public' : 'private'})`)

        room.addPlayer(socket.id)
        console.log(`[ INFO ] Socket (${socket.id}) was added to room ${roomName}`)
    })

    socket.on('join-room', (roomName, prevSocketId) => {
        if (!roomsStorage.has(roomName)) {
            socket.emit('join-room-status',
                { status: 'ERROR', message: 'Cannot join room that does not exist'})
            console.log(`[ INFO ] Socket (${socket.id}) tried to join room that does not exist`)
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

        if (prevSocketId && (room.isInRoom(prevSocketId)) || prevSocketId === '') {
            if (prevSocketId) {
                room.removePlayer(prevSocketId)
                room.addPlayer(socket.id)
            }

            socket.join(roomName)
            console.log(`[ INFO ] Socket (${socket.id}) successfully joined room ${roomName}`)
        } else {
            socket.emit('join-room-status', { status: 'ERROR', message: 'User cannot join that room' })
            console.log(`[ INFO ] Socket (${socket.id}) cannot join room ${roomName}`)
        }
    })

    socket.on('try-join-room', (roomName, prevSocketId) => {
        const room = roomsStorage.get(roomName)


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