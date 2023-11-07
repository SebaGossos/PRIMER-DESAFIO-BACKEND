import passport from "passport";

import MyRouter from "./router.js";

import ChatController from "../controllers/chatController.js"; 
const chatController = new ChatController()

export default class ChatRouter extends MyRouter {
    init() {
        this.get( '/', ['PUBLIC'], chatController.logChat )

        this.post( '/', ['PUBLIC'], passport.authenticate('jwt', { failureRedirect: 'failChat' , session: false }), chatController.saveMessage )

        this.get( '/failChat', ['PUBLIC'], chatController.failChat )
    }
}
