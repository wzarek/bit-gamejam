import { React, useRef } from 'react'
import Typewriter from 'typewriter-effect'
import torch from '../../media/assets/torch.png'
import player2 from '../../media/assets/player2-intro.png'

const Intro = () => {
    const imgRef = useRef()

    return (
        <div className='absolute top-0 h-[640px] w-[960px] flex flex-col justify-center items-center bg-black text-white text-lg'>
            <Typewriter
                onInit={(typewriter) => {
                    typewriter.changeDelay(40).changeDeleteSpeed(3)
                        .typeString("It's dangerous to go alone...")
                        .pauseFor(500)
                        .deleteAll()
                        .pauseFor(200)
                        .typeString("Take this!")
                        .pauseFor(200)
                        .callFunction(() => {
                            let img = imgRef.current
                            img.src = torch
                            img.classList.add('img-shown')
                        })
                        .pauseFor(1000)
                        .callFunction(() => {
                            let img = imgRef.current
                            img.classList.remove('img-shown')
                        })
                        .deleteAll()
                        .pauseFor(200)
                        .typeString("or them...")
                        .pauseFor(200)
                        .callFunction(() => {
                            let img = imgRef.current
                            img.src = player2
                            img.classList.add('img-shown')
                        })
                        .pauseFor(1000)
                        .callFunction(() => {
                            let img = imgRef.current
                            img.classList.remove('img-shown')
                        })
                        .deleteAll()
                        .pauseFor(200)
                        .typeString("Good luck!")
                        .start()
                }}
            />
            <img className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] img-hidden' ref={imgRef} src="" aria-hidden='true' />
        </div>
    )
}

export default Intro
