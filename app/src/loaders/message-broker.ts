import amqp from 'amqplib/callback_api'

import { Utils } from '../utils';
import Logger from './logger';


export enum IExchange {
  MESSAGES = 'messages'
}
const exchanges = [IExchange.MESSAGES]
const callbackFunctions = {}
let channel: amqp.Channel

export const MessageBroker = {
  init: async () => {
    return new Promise<boolean>((resolve, reject) => {
      try {
        // return if already is initialized
        if (channel) return resolve()

        // initialize callback function object which stors all the cb of consumers
        exchanges.forEach((e) => callbackFunctions[e] = new Map())

        // Create connection
         amqp.connect(Utils.getConfig('services.rabbitmq.connection'), (err, connection) => {
          if (err) throw new Error(`Failed to connect to rabbitMQ ${Utils.serializeError(err)}`)

          // Create a channel
           connection.createChannel(async (err, ch) => {
            if (err) throw err
            channel = ch;


            const allExchangePromises = []
            // Create exchanges and bind an exclusive queue to them
            for (const exchange of exchanges) {
              const exchangePromise = new Promise((resolve, reject) => {
                channel.assertExchange(exchange, 'fanout', { durable: false }, (err) => { if (err) throw err })

                // Create exclusive queue which will be destroyed when connection is closed
                channel.assertQueue('', { exclusive: true }, (err, q) => {
                  if (err) reject(err);

                  channel.bindQueue(q.queue, exchange, '');
                  Logger.info(`Bound exclusive queue (${q.queue}) to exchange: ${exchange}`);

                  channel.consume(q.queue, (m) => {
                    callbackFunctions[exchange].forEach((cb) => {
                      if (typeof cb === 'function')
                        cb(JSON.parse(m.content.toString()))
                    })
                  })
                  resolve(true)
                });
              });

              allExchangePromises.push(exchangePromise)
            }
            await Promise.all(allExchangePromises);
            return resolve(true)
          });
        });
      } catch (err) {
        MessageBroker._handleError({
          code: 'BROKER_001',
          message: 'Failed to initialize message broker!',
          stack: err
        })
      }
    })
  },

  /**
   * Publishes the message to the specified exchange
   */
  publish: (exchange: IExchange, message: string): boolean => {
    try {
      const succeded = channel.publish(exchange, '', Buffer.from(message));
      return succeded
    } catch (err) {
      MessageBroker._handleError({
        code: 'BROKER_002',
        message: 'Failed to publish a message!',
        stack: err
      })
    }
  },

  /**
   * Starts consuming the queue which is bounded to the specified exchnage  
   * @param {IExchange} exchange - Name of exchaneg
   * @param {Function} cd - A callback function which will be called with the recieved message from queue as an argument 
   * 
   * @returns the unique key of callback function - The fromat of the key is: [EXCHANGE]_[RANDOM STRING]
   */
  consume: (exchange: IExchange, cb: Function) => {
    try {
      let key = `${exchange}_${Utils.generateRandomString(8)}`
      while (callbackFunctions[exchange].has(key)) {
        key = `${exchange}_${Utils.generateRandomString(8)}`
      }
      callbackFunctions[exchange].set(key, cb);
      return key
    } catch (err) {
      MessageBroker._handleError({
        code: 'BROKER_002',
        message: 'Failed to add the cb function to the list to start consuming the exchange!',
        stack: err
      })
    }
  },

  /**
   * Removes the callback function from the list of functions
   * @param {string} key - a unique key which was provided when strat consuming
   */
  stopConsume: (key) => {
    const exchange = key.split('_')[0]
    return callbackFunctions[exchange] ? callbackFunctions[exchange].delete(key) : false
  },

  _handleError: (err) => {
    Logger.error(err)
    throw err
  }
}