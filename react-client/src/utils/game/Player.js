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
    #width = 30
    #height = 30
    #speedX = 0
    #speedY = 0
    #maxSpeed = 5

    constructor(game, isCurrentPlayer, assets) {
        this.#gameObject = game
        this.#isCurrentPlayer = isCurrentPlayer
        this.#asset = assets['player'[Math.floor(Math.random()*assets.length())]]
    }

    update(inputKeys) {
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
    }

    render(ctx) {
        ctx.drawImage(this.asset, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)
    }

    get isCurrentPlayer() {
        return this.#isCurrentPlayer
    }
}