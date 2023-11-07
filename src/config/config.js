import dotenv from 'dotenv';

const environment = 'PRODUCTION';

dotenv.config({
    path: environment === 'PRODUCTION' ? './.env.production' : './.env.development'
});

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    persistance: process.env.PERSISTANCE
}