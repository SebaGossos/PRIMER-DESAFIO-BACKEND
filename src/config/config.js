import dotenv from 'dotenv';

const environment = 'DEV';

dotenv.config({
    path: environment === 'PROD' ? './.env.production' : './.env.development'
});

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    persistance: process.env.PERSISTANCE,
    environment,
    admin: {
        adminEmail: process.env.ADMIN_EMAIL,
        adminPassword: process.env.ADMIN_PASSWORD
    },
    gitHubPassport: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    jwt: {
        keyToken: process.env.KEY_JWT
    },
    cookie: {
        keyCookie: process.env.KEY_COOKIE
    },
    nodemailer: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
}