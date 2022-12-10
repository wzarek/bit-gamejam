const config = {
    server: {
        hostname: '0.0.0.0',
        port: 3000,
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    },
    game: {
        reconnectTimeout: 5 // seconds
    }
}

export default config