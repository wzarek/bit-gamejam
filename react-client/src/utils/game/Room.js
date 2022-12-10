import { roomsGrid } from "./Assets"
import { assets } from "./Assets"

export default class Room {
    #roomID
    #tileSize = 64
    #roomObjects = []

    constructor(roomID){
        this.#roomID = roomID
    }

    render(ctx){
        let room = assets.rooms[this.#roomID]

        console.log(room)
        let img = new Image()
        img.onload = function () {
            ctx.drawImage(img, 0, 0)
        }
        img.src = room
    }

}