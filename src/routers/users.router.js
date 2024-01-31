import passport from "passport";
import { userController } from "../controllers/index.js";
import MyRouter from "./router.js";



export default class UserRouter extends MyRouter {

    init() {

        this.get('/premium/:uid', ['PUBLIC'], passport.authenticate('jwt', { failureRedirect: 'failLogin', session: false }), userController.premium )
        
    } 
    
}