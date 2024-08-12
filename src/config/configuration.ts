import 'dotenv/config';

export default () => ({
  app: {
    name: process.env.APP_NAME,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dbname: process.env.DATABASE_DBNAME,
  },
});
