import ambient1 from '../media/audio/ambient1.mp3'
import ambient2 from '../media/audio/ambient2.mp3'
import ambient3 from '../media/audio/ambient3.mp3'
import ambient4 from '../media/audio/ambient4.mp3'
import ambient5 from '../media/audio/ambient5.mp3'

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
        for (let i = 0; i < replays-1; i++) {
            audio.addEventListener('ended', () => {
                this.currentTime = 0
                this.play()
            }, false)
        }
    }

    playLoop(){
        let audio = new Audio(this.audioPath)
        audio.loop = true;
        audio.play()
    }

    stop(){
        let audio = new Audio(this.audioPath)

        audio.pause()
        audio.currentTime = 0;
    }
}