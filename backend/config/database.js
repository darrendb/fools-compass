console.log("config/database.js");
const parse = require('pg-connection-string').parse;
// console.log(`--DATABASE_URL: ${process.env.DATABASE_URL}`);
module.exports = ({env}) => {
  console.log(`--NODE_ENV: ${env('NODE_ENV')}`);
  if (env('NODE_ENV') === 'production') {
    const config = parse(process.env.DATABASE_URL);
    // console.log("--config:");
    // console.log(config);
    return {
      defaultConnection: 'default',
      connections: {
        default: {
          connector: 'bookshelf',
          settings: {
            client: 'postgres',
            host: config.host || 'localhost',
            port: config.port || 5432,
            database: config.database || 'strapi',
            username: config.user || 'strapi',
            password: config.password || 'strapi',
            ssl: {
              rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false)
            }
          },
          options: {
            ssl: true,
            debug: true
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
