export default class Player {
    #nick
    #socketId
    #gameObject
    #assets
    #isCurrentPlayer

    #keys = {
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight'
    }
    
    #x = 0
    #y = 0
    #width = 30
    #height = 30

    constructor(game, isCurrentPlayer) {
        this.#gameObject = game
        this.#isCurrentPlayer = isCurrentPlayer
    }

    update(inputKeys) {
        if (inputKeys.includes(this.#keys.up)) {
            this.#y--
        }
        if (inputKeys.includes(this.#keys.down)) {
            this.#y++
        }
        if (inputKeys.includes(this.#keys.left)) {
            this.#x--
        }
        if (inputKeys.includes(this.#keys.right)) {
            this.#x++
        }
    }

    render(ctx) {
        ctx.fillRect(this.#x, this.#y, this.#width, this.#height)
    }

    get isCurrentPlayer() {
        return this.#isCurrentPlayer
    }
}