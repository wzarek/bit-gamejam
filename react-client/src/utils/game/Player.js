export default class Player {
    #nick
    #socketId
    #gameObject
    #asset
    #isCurrentPlayer

    #keys = {
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight'
    }
    
    #x = 0
    #y = 0
    #width = 64
    #height = 64
    #spriteWidth = 190
    #spriteHeight = 160
    #speedX = 0
    #speedY = 0
    #maxSpeed = 3

    #inputTimeout = null

    constructor(socketId, game, assets, isCurrentPlayer = false, x = 0, y = 0) {
        this.#socketId = socketId
        this.#gameObject = game
        this.#isCurrentPlayer = isCurrentPlayer
        this.#x = x
        this.#y = y
        this.#asset = assets.player.player1
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

        if (this.#inputTimeout == null && (inputKeys.includes(this.#keys.up) || inputKeys.includes(this.#keys.down) || inputKeys.includes(this.#keys.left) || inputKeys.includes(this.#keys.right))){
            this.#gameObject.socketObject.emit('player-moved', this.#gameObject.roomName, {x: this.#x, y: this.#y})
            this.#inputTimeout = setTimeout(() => this.#inputTimeout = null, 30)
        }
    }

    render(ctx) {
        let playerImg = new Image(this.#width, this.#height)
        playerImg.src = this.#asset
        ctx.drawImage(playerImg, 140, 160, this.#spriteWidth, this.#spriteHeight, this.#x, this.#y, this.#width, this.#height)
        ctx.beginPath()
        ctx.arc(this.#x + this.#height/2, this.#y + this.#width/2, 550 + this.#width, 0, 2 * Math.PI, false)
        ctx.lineWidth = 1100
        ctx.stroke()
        //ctx.lineJoin = 'round'
        //ctx.strokeRect(this.#x - 490, this.#y - 490, 980 + this.#width, 980 + this.#height)
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