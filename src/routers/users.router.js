import passport from "passport";
import { userController } from "../controllers/index.js";
import MyRouter from "./router.js";

import { uploader } from "../utilis/utils.js";



export default class UserRouter extends MyRouter {

    init() {
        this.get('/', ['PUBLIC'], userController.getAll )

        this.get('/premium/:uid', ['PUBLIC'], passport.authenticate('jwt', { failureRedirect: 'failLogin', session: false }), userController.premium )

        this.post(
            '/:uid/documents', 
            ['PUBLIC'],
            uploader.fields([
                { name: 'dni', maxCount: 1 },
                { name: 'addresProof', maxCount: 1 },
                { name: 'bankProof', maxCount: 1 }
            ]),
            passport.authenticate('jwt', { failureRedirect: 'failLogin', session: false }),
            userController.premium
        )

        this.post('/:uid/profile/picture', ['PUBLIC'], uploader.single('profilePicture'), passport.authenticate('jwt', { failureRedirect: 'failLogin', session: false }), userController.profilePicture )
        
    } 
    
}