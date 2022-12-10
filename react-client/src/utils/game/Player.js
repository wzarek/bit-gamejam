import { roomsGrid } from "./Assets"

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
        right: 'ArrowRight',
        space: ' '
    }
    
    #x = 64
    #y = 64
    #currentRow
    #currentCol
    #width = 64
    #height = 64
    
    #spriteWidth = 190
    #spriteHeight = 160
    #frameX = 140
    #frameY = 2
    #staggerFrames = 20
    #animFrame = 0

    #hasTorch = true

    #speedX = 0
    #speedY = 0
    #maxSpeed = 3

    #inputTimeout = null
    #inputKeys

    #walkEvent = new Event('walk')

    constructor(socketId, game, assets, isCurrentPlayer = false, x = 0, y = 0) {
        this.#socketId = socketId
        this.#gameObject = game
        this.#isCurrentPlayer = isCurrentPlayer
        this.#x = x
        this.#y = y
        this.#asset = assets.player[isCurrentPlayer ? 'player1' : 'player2']
    }

    update(inputKeys) {
        if (!this.#isCurrentPlayer) return

        this.#inputKeys = inputKeys

        //if (this.#areColliding(this.#currentRow, this.#currentCol) == true) return
        //this.#currentRow = Math.floor(this.#y/64)
        //this.#currentCol = Math.floor(this.#x/64)

        if (inputKeys.includes(this.#keys.left) || inputKeys.includes(this.#keys.right)) {
            this.#x += this.#speedX

            //if(this.#areColliding(this.#currentRow, this.#currentCol - 1) || this.#areColliding(this.#currentRow, this.#currentCol + 1)) return

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
                //this.#currentRow = Math.floor(this.#y/64)
                //this.#currentCol = Math.floor(this.#x/64)
                //if(this.#areColliding(this.#currentRow+1, this.#currentCol)) return
                this.#speedY = -this.#maxSpeed
            }
            if (inputKeys.includes(this.#keys.down)) {
                //this.#currentRow = Math.floor(this.#y/64)
                //this.#currentCol = Math.floor(this.#x/64)
                //if(this.#areColliding(this.#currentRow-1, this.#currentCol)) return
                this.#speedY = this.#maxSpeed
            }
        }else{
            this.#speedY = 0
        }

        if (this.#x < 0) this.#x = 0
        if (this.#y < 0) this.#y = 0
        if (this.#x > this.#gameObject.width - this.#width) this.#x = this.#gameObject.width - this.#width
        if (this.#y > this.#gameObject.height - this.#height) this.#y = this.#gameObject.height - this.#height

        if (this.#inputTimeout == null && (inputKeys.includes(this.#keys.up) || inputKeys.includes(this.#keys.down) || inputKeys.includes(this.#keys.left) || inputKeys.includes(this.#keys.right))){
            this.#gameObject.socketObject.emit('player-moved', this.#gameObject.roomName, {x: this.#x, y: this.#y})
            this.#inputTimeout = setTimeout(() => this.#inputTimeout = null, 30)
            document.dispatchEvent(this.#walkEvent);
        }

        
    }

    // #areColliding(row, col) {
    //     switch(roomsGrid.roomg01[row][col]){
    //         case '#':{
    //             return true
    //         }
    //         case '0': {
    //             return false
    //         }
    //         default: {
    //             return roomsGrid[row][col]
    //         }
    //     }
    // }

    render(ctx) {
        let playerImg = new Image(this.#width, this.#height)
        playerImg.src = this.#asset
        
        console.log(this.#speedX, this.#speedY)
        if(this.#speedX == 0 && this.#speedY == 0){
            ctx.drawImage(playerImg, this.#frameX, (this.#hasTorch ? 2 : 1) * this.#spriteHeight, this.#spriteWidth, this.#spriteHeight,
                this.#x, this.#y, this.#width, this.#height)
            let position = Math.floor(this.#animFrame/this.#staggerFrames) % 2
            this.#frameX = 140 + (480 * position)
        } else if (this.#inputKeys.includes(this.#keys.up) || this.#inputKeys.includes(this.#keys.down) || this.#inputKeys.includes(this.#keys.left) || this.#inputKeys.includes(this.#keys.right)){
            ctx.drawImage(playerImg, this.#frameX, (this.#hasTorch ? 3 : 4) * this.#spriteHeight, this.#spriteWidth, this.#spriteHeight,
                this.#x, this.#y, this.#width, this.#height)
            let position = Math.floor(this.#animFrame/this.#staggerFrames) % 4
            this.#frameX = 140 + (480 * position)
        } else if (this.#inputKeys.includes(this.#keys.space)) {
            console.log("atak?")
            ctx.drawImage(playerImg, this.#frameX, 5 * this.#spriteHeight, this.#spriteWidth, this.#spriteHeight,
                this.#x, this.#y, this.#width, this.#height)
            let position = Math.floor(this.#animFrame/this.#staggerFrames-10) % 5
            this.#frameX = 140 + (480 * position)
        }
        this.#animFrame++
        
        if(this.#isCurrentPlayer){
            ctx.beginPath()
            ctx.arc(this.#x + this.#height/2, this.#y + this.#width/2, 550 + this.#width, 0, 2 * Math.PI, false)
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