import 'dotenv/config';

export default () => ({
  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    cors: process.env.APP_CORS === 'true' || false,
  },
  auth: {
    secret: process.env.AUTH_SECRET,
    expiresIn: process.env.AUTH_EXPIRESIN,
    google_oauth: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    },
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dbname: process.env.DATABASE_DBNAME,
  },
  storage: {
    region: process.env.STORAGE_REGION,
    endpoint: process.env.STORAGE_ENDPOINT,
    forcePathStyle: process.env.STORAGE_FORCEPATHSTYLE === 'true' || false,
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
    bucketName: process.env.STORAGE_BUCKET_NAME,
  },
});
