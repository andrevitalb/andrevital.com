module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 1337),
      database: env('DATABASE_NAME', 'backend'),
      user: env('DATABASE_USERNAME', 'admin'),
      password: env('DATABASE_PASSWORD', 'admin'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
