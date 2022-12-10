import { rooms } from "./Assets"

export default class Room {
    #roomID
    #tileSize = 64
    #roomObjects = []

    constructor(roomID){
        this.#roomID = roomID
    }

    render(ctx){
        let room = rooms[this.#roomID]

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 15; j++) {
                //let img = new Image(32, 32)
                // switch (room[i][j]) {
                //     case 'NWALL':
                //         ctx.fillStyle = 'blue'
                //         ctx.fillRect(i*32, j*32, 32, 32)
                //         break
                //     case 'FLOOR':
                //         ctx.fillStyle = 'black'
                //         ctx.fillRect(i*32, j*32, 32, 32)
                //         break
                //     default:
                //         break
                // }
                console.log("TEST")
                if(room[i][j]==='NWALL'){
                    ctx.fillStyle = 'blue'
                    ctx.fillRect(j*this.#tileSize, i*this.#tileSize, this.#tileSize, this.#tileSize)
                } else if(room[i][j]==='FLOOR'){
                    ctx.fillStyle = 'black'
                    ctx.fillRect(j*this.#tileSize, i*this.#tileSize, this.#tileSize, this.#tileSize)
                } else {
                    ctx.fillStyle = 'green'
                    ctx.fillRect(j*this.#tileSize, i*this.#tileSize, this.#tileSize, this.#tileSize)
                }
            }
        }
    }

}