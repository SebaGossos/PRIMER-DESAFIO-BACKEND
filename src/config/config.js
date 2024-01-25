import dotenv from "dotenv";
import { Command } from "commander";
import { initMongoDB } from "../utilis/utils.js";

const program = new Command();
program
  .option("-p <port>", "Puerto del servidor", 8080)
  .option("--mode <mode>", "Modo de ejecución", "DEV");
program.parse();

const environment = program.opts().mode;

dotenv.config({
  path: environment === "PROD" ? "./.env.production" : "./.env.development",
});

if (process.env.PERSISTANCE === "MONGO") await initMongoDB();

export default {
  port: program.opts().p,
  mongoUrl: process.env.MONGO_URL,
  persistance: process.env.PERSISTANCE,
  environment,
  program,
  admin: {
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
  },
  test: {
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD,
  },
  gitHubPassport: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  },
  jwt: {
    keyToken: process.env.KEY_JWT,
  },
  cookie: {
    keyCookie: process.env.KEY_COOKIE,
  },
  nodemailer: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
};
