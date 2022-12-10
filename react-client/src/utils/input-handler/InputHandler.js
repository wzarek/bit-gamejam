import AudioHandler from "../../audio/AudioHandler"
import { assets } from "../game/Assets"

export default class InputHandler {
    #keysAvailable = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', ' ']
    keysPressed = []

    constructor(keysAvailable = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', ' ']) {
        this.#keysAvailable = keysAvailable
        this.#setEventListeners()
    }

    #setEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (this.#keysAvailable.some((el) => el === e.key) && !this.keysPressed.some((el) => el === e.key)) {
                this.keysPressed.push(e.key)
                //this.#audioHandler.playRandom(Object.keys(assets.sfxWalk))
                if(e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'ArrowLeft' || e.key == 'ArrowRight'){
                    let audio = new Audio(assets.sfxWalk.walk1)
                    audio.play()
                }else if(e.key == 'E'){
                    let audio = new Audio(assets.lever)
                    audio.play()
                }
                
                
                //console.log(assets.sfxWalk)
            }
        })

        window.addEventListener('keyup', (e) => {
            if (this.#keysAvailable.some((el) => el === e.key) && this.keysPressed.some((el) => el === e.key)) {
                this.keysPressed.splice(this.keysPressed.indexOf(e.key), 1)
            }
        })

        // window.addEventListener("mousemove", (e) => {
            
        // })
    }
}