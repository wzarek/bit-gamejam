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
    #maxSpeed = 64

    #uiX = 0
    #uiY = 0

    #previouslyUsedKeys = {
        'left': false,
        'right': false,
        'up': false,
        'down': false
    }

    #level = [['#', '#', '#', '#', 'DC', '#', '#', '#', '#', 'DC', '#', '#', '#', '#', '#'],
        ['#', '0', '0', '0', '0', '0', '0', '#', '0', '0', '0', '0', '0', '0', '#'],
        ['#', '0', '0', '0', '0', '0', '0', '#', '0', '0', '0', '0', '0', '0', '#'],
        ['#', '#', '#', '0', '#', '#', '#', '#', '#', '#', '#', '0', '#', '#', '#'],
        ['#', '0', '0', '0', '0', '0', '0', '#', '0', '0', '0', '0', '0', '0', '#'],
        ['#', '#', '#', '#', '#', '0', '#', '#', '#', '0', '#', '#', '#', '#', '#'],
        ['#', '0', '0', '0', '0', '0', '0', '#', '0', '0', '0', '0', '0', '0', '#'],
        ['#', '0', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '0', '#'],
        ['#', '0', '0', '0', '0', '0', '0', '#', '0', '0', '0', '0', '0', '0', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']]

    #inputTimeout = null

    constructor(socketId, game, assets, isCurrentPlayer = false, x = 0, y = 0) {
        this.#socketId = socketId
        this.#gameObject = game
        this.#isCurrentPlayer = isCurrentPlayer
        this.#x = x
        this.#y = y
        this.#uiX = x
        this.#uiY = y
        this.#asset = assets.player.player1
    }

    update(inputKeys) {
        if (!this.#isCurrentPlayer) return
        if (this.#inputTimeout) return

        let currentX
        let currentY

        if ((inputKeys.includes(this.#keys.left) && !this.#previouslyUsedKeys.left) || (inputKeys.includes(this.#keys.right) && !this.#previouslyUsedKeys.right)) {
            if (inputKeys.includes(this.#keys.left)) {
                currentX = Math.floor(this.#x / 64) - 1
                currentY = Math.floor(this.#y / 64)
                if (this.#level[currentY][currentX] !== '#') {
                    this.#x -= this.#maxSpeed
                }
            } else if (inputKeys.includes(this.#keys.right)) {
                currentX = Math.floor(this.#x/ 64) + 1
                currentY = Math.floor(this.#y / 64)
                if (this.#level[currentY][currentX] !== '#') {
                    this.#x += this.#maxSpeed
                }
            }
        }

        if ((inputKeys.includes(this.#keys.up) && !this.#previouslyUsedKeys.up) || (inputKeys.includes(this.#keys.down) && !this.#previouslyUsedKeys.down)) {
            if (inputKeys.includes(this.#keys.up)) {
                currentY = Math.floor(this.#y/ 64) - 1
                currentX = Math.floor(this.#x / 64)
                if (this.#level[currentY][currentX] !== '#') {
                    this.#y -= this.#maxSpeed
                }
            }
            else if (inputKeys.includes(this.#keys.down)) {
                currentY = Math.floor(this.#y / 64) + 1
                currentX = Math.floor(this.#x / 64)
                if (this.#level[currentY][currentX] !== '#') {
                    this.#y += this.#maxSpeed
                }
            }
        }

        // if (this.#x < 0) this.#x = 0
        // if (this.#y < 0) this.#y = 0
        // if (this.#x > this.#gameObject.width - this.#width) this.#x = this.#gameObject.width - this.#width
        // if (this.#y > this.#gameObject.height - this.#height) this.#y = this.#gameObject.height - this.#height

        if (this.#inputTimeout == null && (inputKeys.includes(this.#keys.up) || inputKeys.includes(this.#keys.down) || inputKeys.includes(this.#keys.left) || inputKeys.includes(this.#keys.right))){
            this.#gameObject.socketObject.emit('player-moved', this.#gameObject.roomName, {x: this.#x, y: this.#y})
            this.#inputTimeout = setTimeout(() => this.#inputTimeout = null, 20)
        }

        this.#previouslyUsedKeys.up = inputKeys.includes(this.#keys.up)
        this.#previouslyUsedKeys.down = inputKeys.includes(this.#keys.down)
        this.#previouslyUsedKeys.left = inputKeys.includes(this.#keys.left)
        this.#previouslyUsedKeys.right = inputKeys.includes(this.#keys.right)
    }

    render(ctx) {
        let playerImg = new Image(this.#width, this.#height)
        playerImg.src = this.#asset
        ctx.drawImage(playerImg, 140, 160, this.#spriteWidth, this.#spriteHeight, this.#x, this.#y, this.#width, this.#height)
        if (this.#isCurrentPlayer) {
            ctx.beginPath()
            ctx.arc(this.#x + this.#height / 2, this.#y + this.#width / 2, 550 + this.#width, 0, 2 * Math.PI, false)
            ctx.lineWidth = 1100
            ctx.stroke()
        }
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