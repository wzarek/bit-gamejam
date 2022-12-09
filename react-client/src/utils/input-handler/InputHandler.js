class InputHandler {
    #keysAvailable = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft']
    keysPressed = []

    constructor(keysAvailable = this.#keysAvailable) {
        this.#keysAvailable = keysAvailable
        this.#setEventListeners()
    }

    #setEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (this.#keysAvailable.some((el) => el === e.ey) && !this.keysPressed.some((el) => el === e.key)) {
                this.keysPressed.push(e.key)
            }
        })

        window.addEventListener('keyup', (e) => {
            if (this.#keysAvailable.some((el) => el === e.ey) && this.keysPressed.some((el) => el === e.ey)) {
                this.keysPressed.splice(this.keysPressed.indexOf(e.key), 1)
            }
        })
    }
}