export default class InteractiveObject {
    #type // e.g. doors, water etc.
    #coordinates
    #whoCanInteract = null

    constructor(type, coordinates, whoCanInteract = null) {
        this.#type = type
        this.#coordinates = coordinates
        this.#whoCanInteract = whoCanInteract
    }

    canInteracte(socketId) {
        return (!this.#whoCanInteract || (socketId === this.#whoCanInteract))
    }
}