import winston from 'winston'

const customLevelOpt = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'blue'
    }
}

const devLogger = winston.createLogger({
    levels: customLevelOpt.levels,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOpt.levels,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: './errors.log', level: 'error' })
    ]
})

const getLogger = () => {   // Elegir que logger usar
    if (process.env.NODE_ENVIROMENT === "prod") {
        return prodLogger
    }
    return devLogger
}

export const addLogger = (req, res, next) => {
    req.logger = getLogger()
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} `)
    next()
}