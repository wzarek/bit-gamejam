import { assets, roomsGrid } from "./Assets"
import { levels } from "../../media/rooms/rooms.js"

export default class Room {
    #roomID
    #tileSize = 64

    render(ctx, roomName){
        let room = assets.rooms.room01
        console.log(room.src)

        let img = new Image()
        img.onload = function () {
            ctx.drawImage(img, 0, 0)
        }
        img.src = room
    }

}