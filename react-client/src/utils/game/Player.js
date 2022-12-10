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
    #maxSpeed = 64

    #previouslyUsedKeys = {
        'left': false,
        'right': false,
        'up': false,
        'down': false
    }

    #level
    #levelGrid

    #inputTimeout = null
    #inputKeys

    #walkEvent = new Event('walk')

    constructor(socketId, game, level, assets, isCurrentPlayer = false, x = 0, y = 0) {
        this.#socketId = socketId
        this.#gameObject = game
        this.#isCurrentPlayer = isCurrentPlayer
        this.#x = x
        this.#y = y
        this.#level = level
        this.#levelGrid = level.grid
        this.#asset = assets.player[isCurrentPlayer ? 'player1' : 'player2']
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
                if (this.#levelGrid[currentY][currentX] !== '#') {
                    this.#x -= this.#maxSpeed
                }
            } else if (inputKeys.includes(this.#keys.right)) {
                currentX = Math.floor(this.#x/ 64) + 1
                currentY = Math.floor(this.#y / 64)
                if (this.#levelGrid[currentY][currentX] !== '#') {
                    this.#x += this.#maxSpeed
                }
            }
        }

        if ((inputKeys.includes(this.#keys.up) && !this.#previouslyUsedKeys.up) || (inputKeys.includes(this.#keys.down) && !this.#previouslyUsedKeys.down)) {
            if (inputKeys.includes(this.#keys.up)) {
                currentY = Math.floor(this.#y/ 64) - 1
                currentX = Math.floor(this.#x / 64)
                if (this.#levelGrid[currentY][currentX] !== '#') {
                    this.#y -= this.#maxSpeed
                }
            }
            else if (inputKeys.includes(this.#keys.down)) {
                currentY = Math.floor(this.#y / 64) + 1
                currentX = Math.floor(this.#x / 64)
                if (this.#levelGrid[currentY][currentX] !== '#') {
                    this.#y += this.#maxSpeed
                }
            }
        }else{
            this.#speedY = 0
        }

        // if (this.#x - 64 < 0) this.#x = 0
        // if (this.#y - 64 < 0) this.#y = 0
        // if (this.#x > this.#gameObject.width + this.#width) this.#x = this.#gameObject.width - this.#width
        // if (this.#y > this.#gameObject.height + this.#height) this.#y = this.#gameObject.height - this.#height

        if (this.#inputTimeout == null && (inputKeys.includes(this.#keys.up) || inputKeys.includes(this.#keys.down) || inputKeys.includes(this.#keys.left) || inputKeys.includes(this.#keys.right))){
            this.#gameObject.socketObject.emit('player-moved', this.#gameObject.roomName, {x: this.#x, y: this.#y})
            
            this.#inputTimeout = setTimeout(() => this.#inputTimeout = null, 20)
            this.#inputTimeout = setTimeout(() => this.#inputTimeout = null, 30)
            document.dispatchEvent(this.#walkEvent);
        }

        this.#previouslyUsedKeys.up = inputKeys.includes(this.#keys.up)
        this.#previouslyUsedKeys.down = inputKeys.includes(this.#keys.down)
        this.#previouslyUsedKeys.left = inputKeys.includes(this.#keys.left)
        this.#previouslyUsedKeys.right = inputKeys.includes(this.#keys.right)
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
//         console.log(this.#speedX, this.#speedY)
//         if(this.#speedX == 0 && this.#speedY == 0){
//             ctx.drawImage(playerImg, this.#frameX, (this.#hasTorch ? 2 : 1) * this.#spriteHeight, this.#spriteWidth, this.#spriteHeight,
//                 this.#x, this.#y, this.#width, this.#height)
//             let position = Math.floor(this.#animFrame/this.#staggerFrames) % 2
//             this.#frameX = 140 + (480 * position)
//         } else if (this.#inputKeys.includes(this.#keys.up) || this.#inputKeys.includes(this.#keys.down) || this.#inputKeys.includes(this.#keys.left) || this.#inputKeys.includes(this.#keys.right)){
//             ctx.drawImage(playerImg, this.#frameX, (this.#hasTorch ? 3 : 4) * this.#spriteHeight, this.#spriteWidth, this.#spriteHeight,
//                 this.#x, this.#y, this.#width, this.#height)
//             let position = Math.floor(this.#animFrame/this.#staggerFrames) % 4
//             this.#frameX = 140 + (480 * position)
//         } else if (this.#inputKeys.includes(this.#keys.space)) {
//             console.log("atak?")
//             ctx.drawImage(playerImg, this.#frameX, 5 * this.#spriteHeight, this.#spriteWidth, this.#spriteHeight,
//                 this.#x, this.#y, this.#width, this.#height)
//             let position = Math.floor(this.#animFrame/this.#staggerFrames-10) % 5
//             this.#frameX = 140 + (480 * position)
//         }
//         this.#animFrame++
        
//         if(this.#isCurrentPlayer){

        ctx.drawImage(playerImg, 140, 160, this.#spriteWidth, this.#spriteHeight, this.#x, this.#y, this.#width, this.#height)
        if (this.#isCurrentPlayer) {
            ctx.beginPath()
            ctx.arc(this.#x + this.#height / 2, this.#y + this.#width / 2, 550 + this.#width, 0, 2 * Math.PI, false)
            ctx.lineWidth = 1100
            ctx.shadowColor = '#000'
            ctx.shadowBlur = 25
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)'
            ctx.filter = 'drop-shadow(10px)'
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