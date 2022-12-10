import config from './config.js'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import Room from './models/Room.js'
import cors from 'cors'
import levels from './media/levels.js'

const levelsEnum = {
    1: 'first',
    2: 'firstBonus',
    3: 'second'
}


const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: config.server.cors })

app.use(express.json())
app.use(cors(config.server.cors))

const roomsStorage = new Map()

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
    let currentRoom = ''

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
            } else {
                room.addPlayer(socket.id)
            }

            socket.join(roomName)
            socket.emit('join-room-status', { status: 'OK', message: 'Joined the room'})
            currentRoom = roomName
            console.log(`[ INFO ] Socket (${socket.id}) successfully joined room ${roomName}`)
        } else {
            socket.emit('join-room-status', { status: 'ERROR', message: 'User cannot join that room' })
            console.log(`[ INFO ] Socket (${socket.id}) cannot join room ${roomName}`)
        }
    })

    socket.on('player-ready', (roomName) => {
        const room = roomsStorage.get(roomName)
        if (!room) return

        console.log(`[ INFO ] Socket (${socket.id}) is ready to start a game (room: ${room.name}, level: ${room.currentLevel})`)

        room.setReadyPlayer(socket.id)

        if (room.isRoomReady) {
            let level = levels[levelsEnum[room.currentLevel]]
            io.in(room.name).emit('game-ready', { level: level, players: room.players})
            console.log(`[ INFO ] Game in room ${room.name} is ready to start`)
        }

    })

    socket.on('game-ready', (roomName) => {
        const room = roomsStorage.get(roomName)
        if (!room) return
        room.setStarted()
        console.log(`[ INFO ] Game in room ${room.name} started`)
    })

    socket.on('player-moved', (roomName, position) => {
        const room = roomsStorage.get(roomName)
        if (!room) return

        socket.to(roomName).emit('move-player', { socketId: socket.id, position: position })
        // console.log(`[ INFO ] Socket (${socket.id}) moved`)
    })

    socket.on('finish-level', (roomName) => {
        const room = roomsStorage.get(roomName)
        if (!room) return

        console.log(`[ INFO ] Level ${room.currentLevel} for room ${room.name} was finished`)
        if (room.currentLevel === room.maxLevel) {
            io.in(roomName).emit('game-finish')
            roomsStorage.delete(roomName)
            console.log(`[ INFO ] Game in ${room.name} was finished`)

            return
        }

        room.updateLevel()
        io.in(roomName).emit('next-level', room.currentLevel)
    })

    // socket.emit('next-level'

    socket.on('send-tooltip', (tooltip) => {
        socket.emit('show-tooltip', tooltip)
    })

    socket.on('player-interact', (roomName, socketId, coordinates) => {
        const room = roomsStorage.get(roomName)
        if (!room) return
        console.log(`[ INFO ] Users in room ${roomName} interacted with object`)

        room.levelObjects[room.currentLevel - 1]++

        if (room.levelObjects[room.currentLevel - 1] === 2) {
            let objects = levels[levelsEnum[room.currentLevel]].objects
            let doors = []
            objects.forEach((object) => {
                let information = object.split(' ')
                if (information[2] === 'DC') {
                    doors.push(`${information[0]} ${information[1]}`)
                }
            })

            io.to(room.name).emit('can-open-door', doors)
            console.log(`[ INFO ] Users in room ${room.name} can open doors`)
        }
    })

    socket.on('disconnect', () => {
        const room = roomsStorage.get(currentRoom)
        if (!room) return
        console.log(`[ INFO ] Socket (${socket.id}) left room ${room.name}`)

        room.removePlayer(socket.id)
        socket.leave(currentRoom)

        if (room.playersInRoom === 0) {
            roomsStorage.delete(currentRoom)
            console.log(`[ INFO ] Room ${currentRoom} was deleted, because was empty`)
        }


        socket.removeAllListeners()
    })
})

httpServer.listen(config.server.port, config.server.hostname, () => {
    console.log(`[ INFO ] Server is running (${config.server.hostname}:${config.server.port})`)
})