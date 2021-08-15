const parse = require('pg-connection-string').parse;
console.log("config/database.js");
console.log(`--DATABASE_URL: ${process.env.DATABASE_URL}`);
module.exports = ({env}) => {
  console.log(`--NODE_ENV: ${env('NODE_ENV')}`);
  if (env('NODE_ENV') === 'production') {
    const config = parse(process.env.DATABASE_URL);
    console.log("--config:");
    console.log(config);
    return {
      defaultConnection: 'default',
      connections: {
        default: {
          connector: 'bookshelf',
          settings: {
            client: 'postgres',
            host: config.host,
            port: config.port,
            database: config.database,
            username: config.user,
            password: config.password
            // ssl: {
            //   rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), // For self-signed certificates
            // }
          },
          options: {
            ssl: false
          }
        }
      }
    };
  }
  return {
    defaultConnection: 'default',
    connections: {
      default: {
        connector: 'bookshelf',
        settings: {
          client: 'sqlite',
          filename: env('DATABASE_FILENAME', '.tmp/fc-data.db')
        },
        options: {
          useNullAsDefault: true
        }
      }
    }
  }
};
