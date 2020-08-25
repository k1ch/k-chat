import * as express from 'express';

import { IError, errors } from './errors.model';
import { Utils } from '../../utils';
import logger from '../../loaders/logger'

export function handleError(res: express.Response, err: IError) {
    let responseStatusCode = 500;
    let responseBody = {
      code: 'Unhandled',
      message: 'Unhandled error!',
      stack: Utils.serializeError(err.stack || err),
    };
    
    if (err && err.code) {    
      const definedError = errors.find((de) => {
        return de.code === err.code;
      });
      
      if (definedError) {
        responseStatusCode = definedError.http_status
    
        responseBody.code = definedError.code;
        responseBody.message = definedError.message;
      }
    }

    /**
     * Record the error in logs
     */
    logger.error(responseBody)

    /**
     * Removes the error stack in production environment
     */
    if (Utils.getConfig('env') === 'production') {
      delete responseBody.stack;
    }

    res.status(responseStatusCode).send(responseBody);
}
