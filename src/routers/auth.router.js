import passport from "passport";

import MyRouter from "./router.js";
import { authController } from '../controllers/index.js'


import { birthday } from "../middlewares/birthdate.middleware.js";

export default class AuthRouter extends MyRouter {
    init(){

        this.post('/register', ['PUBLIC'], birthday, passport.authenticate('register', { failureRedirect: 'failRegister', session: false }), authController.registerUser )

        this.get('/failRegister', ['PUBLIC'], authController.failRegister)

        this.get('/changePassword', ['PUBLIC'], authController.changePassword )

        this.post('/login', ['PUBLIC'], passport.authenticate('login', { failureRedirect:'failLogin', session: false }), authController.loginUser)

        this.get('/failLogin', ['PUBLIC'], authController.failLogin)

        this.get('/github', ['PUBLIC'], passport.authenticate('github', { scope: ['user:email'], session: false }), authController.loginGithub)

        this.get('/githubcallback', ['PUBLIC'], passport.authenticate('github', { failureRedirect: '/', session: false }), authController.githubCallback )

        this.get( '/logout', ['PUBLIC'], authController.logout)
        
    }
}
