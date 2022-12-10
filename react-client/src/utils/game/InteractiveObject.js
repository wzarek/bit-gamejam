export default class InteractiveObject {
    #type // e.g. doors, water etc.
    #coordinates
    #whoCanInteract = null

    constructor(type, coordinates, whoCanInteract = null) {
        this.#type = type
        this.#coordinates = coordinates
        this.#whoCanInteract = whoCanInteract
    }

    canInteract(socketId) {
        return (!this.#whoCanInteract || (socketId === this.#whoCanInteract))
    }

    interact(roomName, socketObj, socketId) {
        if (!this.canInteract(socketId)) return
        socketObj.emit('player-interact', roomName, socketId, this.#coordinates)
    }

    setType(type) {
        this.#type = type
    }
}