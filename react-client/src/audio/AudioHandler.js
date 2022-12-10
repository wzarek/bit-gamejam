import { assets } from "../utils/game/Assets"

export default class AudioHandler {
    
    // constructor(audioPath){
    //     this.audioPath = audioPath
    // }

    playRandom(audioPath){
        let path = this.audioPath[Math.floor(Math.random()*this.audioPath.length)]
        console.log(path)
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

    #setEventListeners(){
        document.addEventListener('ambient-start', (e) => {
            this.playRandom(Object.keys(assets.ambient))
        }, false)

        document.addEventListener('walk', (e) => {
            this.playRandom(Object.keys(assets.sfxWalk))
        }, false)

        document.addEventListener('attack', (e) => {
            this.play(assets.sfxHumanAttack)
        }) 
    }
}