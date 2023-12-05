import winston from 'winston';
import config from './config/config.js';

const environment = config.environment;

const winstonCustom = {
    levels: {
        debug:0,
        http:1,
        info:2,
        warning:3,
        error:4,
        fatal:5
    },
    colors: {
        debug:'white',
        http:'green',
        info:'blue',
        warning:'yellow',
        error:'magenta',
        fatal:'red'
    }
}

winston.addColors( winstonCustom.colors )

const createLogger = ( env ) => {
    if ( env === 'PROD') {
        return winston.createLogger({
            levels: winstonCustom.levels,
            transports:[ 
                new winston.transports.File({
                    filename: 'errors.log',
                    level: 'info',
                    format: winston.format.json()
                })
            ]
        })
    } else {
        return winston.createLogger({
            levels: winstonCustom.levels,
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp(),
                        winston.format.simple()
                    )
                })
            ]
        })
    }
   
}

const logger = createLogger( environment )

export default logger; 