import { Router } from "express";
import UserModel from '../dao/models/user.model.js';
import { birthday } from "../middlewares/birthdate.middleware.js";

const router = Router();

router.post('/login', async( req, res ) => {
    
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password }).lean().exec();
    if( !user ) {
        return res.redirect('/')
    }
    if( user.email === ' adminCoder@coder.com' && user.password === 'adminCod3r123' ){
        user.role = 'admin';
    }  else {
        user.role = 'user';
    }
    req.session.user = user;
    res.redirect('/products')
})

router.post('/register', birthday , async( req, res ) => {

    const userToRegister = req.body;
    const user = new UserModel( userToRegister )
    await user.save() 


    res.redirect('/')
})

router.get('/logout', ( req, res ) => {
    //Todo
    req.session.destroy( err => {
        if(err) {
            return res.status(500).send({error: err})
        }else res.redirect('/');
    })

})



export default router; 