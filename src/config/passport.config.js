import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utilis/utils.js";
import jwt from "passport-jwt";
import config from "./config.js";

const emailAdmin = config.admin.adminEmail;
const passwordAdmin = config.admin.adminPassword;

import { CartService, UserService } from "../repositories/index.js";

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

// const cookieExtractor = req => (req && req.signedCookies) ? req.signedCookies['jwt-coder'] : null;
const cookieExtractor = (req) => req?.signedCookies["jwt-coder"] || null;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwt.keyToken,
      },
      async (jwt_payload, done) => {
        
        try {
          const user = jwt_payload.user ? jwt_payload.user : false;
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
          const user = await UserService.getByEmail(username);
          if (user) {
            return done(null, false, { info: "error del regis" });
          }
          const cart = await CartService.create( username );

          const result = await UserService.create({
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
            cart,
            source: "ourApp",
          });

          return done(null, result);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (username === emailAdmin && password === passwordAdmin)
            return done(null, {
              email: username,
              password,
              role: "admin",
              first_name: "admin",
            });
          const user = await UserService.getByEmail(username);
          if (!user)
            return done(null, false, {
              err: "no se encuentra estoy en passport ",
            });
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
          
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.gitHubPassport.clientId,
        clientSecret: config.gitHubPassport.clientSecret,
        callbackURL: config.gitHubPassport.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await UserService.getByEmail(profile._json.email);
          if (user) return done(null, user);

          const newUser = await UserService.create({
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            password: "",
            age: "",
            role: "user",
            cart: await CartService.create(profile._json.email),
            source: profile.provider,
          });
          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // !ESTO ERA PARA SESSIONS
  // passport.serializeUser((user, done) => {
  //     done( null, user._id )
  // })

  // passport.deserializeUser(async (id, done) => {
  //     const user = await UserService.findById(id);
  //     done(null, user)
  // })
};

export default initializePassport;
