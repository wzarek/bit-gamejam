import ambient1 from './ambient1.mp3'
import ambient2 from './ambient2.mp3'
import ambient3 from './ambient3.mp3'
import ambient4 from './ambient4.mp3'
import ambient5 from './ambient5.mp3'

export default class AudioHandler {
    
    constructor(audioPath){
        this.audioPath = audioPath
    }

    playRandom(){
        let path = this.audioPath[Math.floor(Math.random()*this.audioPath.length)]

        let audio = new Audio(path)
        audio.play()
    }

    play(replays){
        let audio = new Audio(this.audioPath)

        if(!replays) {
            audio.play()
            console.log('???')
            return
        }

        audio.play()
        for (let i = 0; i < replays; i++) {
            audio.addEventListener('ended', () => {
                this.currentTime = 0
                this.play()
            }, false)
        }
    }

    stop(){
        let audio = new Audio(this.audioPath)

        audio.pause()
        audio.currentTime = 0;
    }
}