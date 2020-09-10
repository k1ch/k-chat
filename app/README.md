# k-chat [server]

This is s simple chat server powered by Node.js

## Development

Perquisites: 
- [docker-compose](https://docs.docker.com/compose/install/)
- [node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) version `12.18.0`
- [awslocal](https://github.com/localstack/awscli-local) 
 
 
To start the app in development environment run the following command:
```
npm run development:up
```

When the stack is up, you need To init localstack only once:
```
npm run localstack:init
```

To test: 
```
npm run test
```

Access the app at port: 3000
