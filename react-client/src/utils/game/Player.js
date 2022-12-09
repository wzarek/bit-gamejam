export default class Player {
    #nick
    #socketId
    #gameObject
    #assets
    #isCurrentPlayer
    
    #x = 0
    #y = 0
    #width = 50
    #height = 50

    constructor(game, isCurrentPlayer) {
        this.#gameObject = game
        this.#isCurrentPlayer = isCurrentPlayer
    }

    update() {
        this.#x++
    }

    render(ctx) {
        ctx.fillRect(this.#x, this.#y, this.#width, this.#height)
    }

    get isCurrentPlayer() {
        return this.#isCurrentPlayer
    }
}