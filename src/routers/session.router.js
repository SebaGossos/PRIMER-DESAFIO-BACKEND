import { Router } from "express";
import { birthday } from "../middlewares/birthdate.middleware.js";
import { UserManagerDB } from "../dao/db/user_managerDB.js";

const router = Router();

const userManagerDB = new UserManagerDB();


router.post('/login', async( req, res ) => {
    try{

        const { email, password } = req.body;

        const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123'
                            ? true 
                            : false;

        const user = await userManagerDB.getUserByEmail( email )

        const isAPassword = await userManagerDB.isTheTruePassword( user, password )

        if ( isAdmin ) {
            req.session.user = { role: 'admin' }
            return res.redirect('/products')
        }
        if( (!user || !isAPassword) && !isAdmin ) {

            req.session.isNotUser = true;
            return res.redirect('/')
        }

        req.session.isNotUser = false;

        if( user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123' ){
            user.role = 'admin';
        } else {
            user.role = 'user';
        }
        req.session.user = user;
        res.redirect('/products')
    } catch( err ) {
        res.render('errors/errorSession', { error: err } )
    }
})

router.post('/register', birthday , async( req, res ) => {
    try{
        const userToRegister = req.body;

        await userManagerDB.createUser( userToRegister )

        res.redirect('/')
    } catch( err ) {
        res.render('errors/errorSession', { error: err } )
    }
})

router.get('/logout', ( req, res ) => {

    req.session.destroy( err => {
        if(err) {
            return res.status(500).send({error: err})
        }else res.redirect('/');
    })

})

export default router; 