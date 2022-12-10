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
    #speedX = 0
    #speedY = 0
    #maxSpeed = 5

    constructor(socketId, game, isCurrentPlayer = false, x = 0, y = 0) {
        this.#socketId = socketId
        this.#gameObject = game
        this.#isCurrentPlayer = isCurrentPlayer
        this.#x = x
        this.#y = y
    }

    update(inputKeys) {
        if (!this.#isCurrentPlayer) return

        if (inputKeys.includes(this.#keys.left) || inputKeys.includes(this.#keys.right)) {
            this.#x += this.#speedX
            if (inputKeys.includes(this.#keys.left)) {
                this.#speedX = -this.#maxSpeed
            } else if (inputKeys.includes(this.#keys.right)) {
                this.#speedX = this.#maxSpeed
            }
        } else{
            this.#speedX = 0
        }

        if (inputKeys.includes(this.#keys.up) || inputKeys.includes(this.#keys.down)) {
            this.#y += this.#speedY
            if (inputKeys.includes(this.#keys.up)) {
                this.#speedY = -this.#maxSpeed
            }
            if (inputKeys.includes(this.#keys.down)) {
                this.#speedY = this.#maxSpeed
            }
        }

        if (this.#x < 0) this.#x = 0
        if (this.#y < 0) this.#y = 0
        if (this.#x > this.#gameObject.width - this.#width) this.#x = this.#gameObject.width - this.#width
        if (this.#y > this.#gameObject.height - this.#height) this.#y = this.#gameObject.height - this.#height

        if (inputKeys.includes(this.#keys.up) || inputKeys.includes(this.#keys.down) || inputKeys.includes(this.#keys.left) || inputKeys.includes(this.#keys.right)){
            this.#gameObject.socketObject.emit('player-moved', this.#gameObject.roomName, {x: this.#x, y: this.#y})
        }
    }

    render() {
        let ctx = this.#gameObject.canvasContext
        ctx.fillRect(this.#x, this.#y, this.#width, this.#height)
    }

    movePlayer(position) {
        this.#x = position.x
        this.#y = position.y
    }

    get isCurrentPlayer() {
        return this.#isCurrentPlayer
    }

    get socketId() {
        return this.#socketId
    }
}