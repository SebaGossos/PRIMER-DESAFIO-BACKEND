import { Router } from "express";
import passport from "passport";
import { birthday } from "../middlewares/birthdate.middleware.js";
import { UserManagerDB } from "../dao/db/user_managerDB.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

const userManagerDB = new UserManagerDB();


router.post('/login', isAdmin, passport.authenticate('login', {failureRedirect: 'failLogin'} ), async( req, res ) => {
    console.log( req.body )
    if ( !req.user ) {
        return res.status(400).send({ status: 'error', error: 'Invalid Credentials' })
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    };
    res.redirect('/products')
    // try{

    //     const { email, password } = req.body;

    // const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123'
    //                     ? true 
    //                     : false;

    //     const user = await userManagerDB.getUserByEmailForLogin({ email })

    //     const isAPassword = await userManagerDB.isTheTruePassword( user, password )

    //     if ( isAdmin ) {
    //         req.session.user = { role: 'admin' }
    //         return res.redirect('/products')
    //     }
    //     if( (!user || !isAPassword) && !isAdmin ) {

    //         req.session.isNotUser = true;
    //         return res.redirect('/')
    //     }

    //     req.session.isNotUser = false;

    //     if( user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123' ){
    //         user.role = 'admin';
    //     } else {
    //         user.role = 'user';
    //     }
    //     req.session.user = user;

    //     res.redirect('/products')
    // } catch( err ) {
    //     res.render('errors/errorSession', { error: err } )
    // }
})


router.get('/failLogin', ( req, res ) => res.render('errors/errorSession',{error: 'Bad Request, try again with a correct email or password'}))





router.post('/register', birthday , passport.authenticate('register', {failureRedirect: 'failRegister'} ),  async( req, res ) => {
    console.log(req.result)
    res.redirect('/')
})
router.get('/failRegister', ( req, res ) => res.render('errors/errorSession',{error: 'Email already exist'}))


router.get('/logout', ( req, res ) => {

    req.session.destroy( err => {
        if(err) {
            return res.status(500).send({error: err})
        }else res.redirect('/');
    })

})


router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res)  => {

})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), async( req, res ) => {
    console.log( 'Callback: ', req.user )
    req.session.user = req.user;
    req.session.user.role = 'user'
    res.redirect('/products')
})

export default router; 