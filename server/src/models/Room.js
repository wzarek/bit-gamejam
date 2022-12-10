export default class Room {
    #name
    #isPublic = false
    #maxPlayers = 2
    #players = []
    #playersReady = []
    #hasFinishedLevel = {}
    #isStarted = false
    #currentLevel = 1
    #maxLevel = 3

    constructor(name, isPublic) {
        this.#name = name
        this.#isPublic = isPublic
    }

    get name() {
        return this.#name
    }

    get players() {
        return this.#players
    }

    get playersInRoom() {
        return this.#players.length
    }

    get isPublic() {
        return this.#isPublic
    }

    get isFull() {
        return this.playersInRoom === this.#maxPlayers
    }

    get isStarted() {
        return this.#isStarted
    }

    get isRoomReady() {
        return this.#playersReady.length === this.#maxPlayers
    }

    get currentLevel() {
        return this.#currentLevel
    }

    get maxLevel() {
        return this.#maxLevel
    }

    addPlayer(socketId) {
        if (this.#players.length === this.#maxPlayers) return
        this.#players.push(socketId)
        this.#hasFinishedLevel[socketId] = false
    }

    removePlayer(socketId) {
        if (!this.#players.some((playerId) => playerId === socketId)) return

        this.#players.splice(this.#players.indexOf(socketId), 1)
        delete this.#hasFinishedLevel[socketId]
    }

    isInRoom(socketId) {
        return this.#players.some((playerId) => playerId === socketId)
    }

    setReadyPlayer(socketId) {
        if (!this.#players.some((playerId) => playerId === socketId)) return
        this.#playersReady.push(socketId)
    }

    setStarted() {
        this.#isStarted = true
    }

    updateLevel() {
        this.#currentLevel++
    }

    get allHasFinished() {
        let finished = []
        for (const [key, value] of Object.entries(this.#hasFinishedLevel)) {
            finished.push(value)
        }

        return finished.every(element => element === true);
    }
}
