// const amqp = require('amqplib/callback_api');
// const Utils = require('../utils');

// const exchanges = ['messages', 'chats', 'users']
// const queues = new Map();
// const channel = null

// function init() {
//   console.log('Init is called')
//   if (!channel) {
//     amqp.connect(Utils.getConfig('services.rabbitmq.address'), (err, connection) => {
//       if (err) throw new Error(`failed to connect to rabbitMQ ${Utils.serializeError(err)}`)
//       connection.createChannel((err, ch) => {
//         if (err) throw new Error(`failed to create a channel to rabbitMQ ${Utils.serializeError(err)}`)
//         channel = ch;

//         exchanges.forEach((exchange) => {
//           ch.assertExchange(exchange, 'fanout', { durable: false }, (err) => {
//             throw `Failed to create exchange: ${Utils.serializeError(err)}`
//           })

//           channel.assertQueue('', {
//             exclusive: true
//           }, function(error2, q) {
//             if (error2) {
//               throw error2;
//             }
//             console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
//             channel.bindQueue(q.queue, exchange, '');
//             queues.set(exchange, q.queue)
//           });
//         });

//       });
//     })
//   }
// }



// function publishToExchange(exchange, message) {
//   if (exchange.indexOf(exchange) === -1) throw 'Exchange does not exist!'
//   channel.publish(exchange, '', Buffer.from(message));
//   console.log(" [x] Sent %s", message);
// }

// function consumeQueue(exchange, cb) {
//   ch.consume(queues.get(exchange), cf(msg))
// }
// init()