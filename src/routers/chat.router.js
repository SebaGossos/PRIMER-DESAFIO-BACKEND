import passport from "passport";

import MyRouter from "./router.js";

import { chatController } from "../controllers/index.js"; 

export default class ChatRouter extends MyRouter {
    init() {
        this.get( '/', ['USER'], chatController.getAll )

        this.post( '/', ['USER'], passport.authenticate('jwt', { failureRedirect: 'failChat' , session: false }), chatController.create )

        this.get( '/failChat', ['PUBLIC'], chatController.failChat )
    }
}
