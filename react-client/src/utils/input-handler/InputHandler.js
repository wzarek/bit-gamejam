export default class InputHandler {
    #keysAvailable = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', ' ', 'e']
    keysPressed = []

    constructor(keysAvailable = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', ' ', 'e']) {
        this.#keysAvailable = keysAvailable
        this.#setEventListeners()
    }

    #setEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (this.#keysAvailable.some((el) => el === e.key) && !this.keysPressed.some((el) => el === e.key)) {
                this.keysPressed.push(e.key)
            }
        })

        window.addEventListener('keyup', (e) => {
            if (this.#keysAvailable.some((el) => el === e.key) && this.keysPressed.some((el) => el === e.key)) {
                this.keysPressed.splice(this.keysPressed.indexOf(e.key), 1)
            }
        })
    }
}