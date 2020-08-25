import winston from 'winston';
import { Utils } from '../utils';

const transports = [] as winston.transport[];
if (Utils.getConfig('env') !== 'development') {
  /**
   * @TODO Setup a transporter for non dev environment
   */
} else {
  transports.push(
    new winston.transports.File({ filename: './logs/combined.log' })
  )
}

const Logger = winston.createLogger({
  level: 'info',
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports
});

Logger.stream = {
  write: function (message, encoding) {
    Logger.info(message);
  }
} as any

export default Logger;