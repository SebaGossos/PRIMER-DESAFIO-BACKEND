import passport from "passport";
import { birthday } from "../middlewares/birthdate.middleware.js";
import { generateToken } from "../utils.js";
import MyRouter from "./router.js";


export default class AuthRouter extends MyRouter {
    init(){
        this.post('/login', passport.authenticate('login', { failureRedirect:'failLogin', session: false }), (req, res) => {
            const user = req.user;
            const accessToken = generateToken( user );
            res.cookie('jwt-coder', accessToken, { signed: true }).redirect('/products')
        })

        this.get('/failLogin', ( req, res ) => res.render('errors/errorAuth',{error: 'Bad Request, try again with a correct email or password'}))

        this.post('/register', birthday, passport.authenticate('register', { failureRedirect: 'failRegister', session: false }), (req, res) => res.redirect('/'))

        this.get('/failRegister', ( req, res ) => res.render('errors/errorAuth',{error: 'Email already existt'}))

        this.get( '/logout', (req, res) => res.clearCookie('jwt-coder').redirect('/') )

        this.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }), (req, res)  => {})
        
        this.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/', session: false }), async( req, res ) => {
            const user = req.user;
            const accessToken = generateToken( user );
            res.cookie('jwt-coder', accessToken, { signed: true }).redirect('/products')
        })
    }
}




// router.post('/login', passport.authenticate('login', {failureRedirect: 'failLogin', session: false} ), async( req, res ) => {
//     // console.log( req.body )
//     // if ( !req.user ) {
//     //     return res.status(400).send({ status: 'error', error: 'Invalid Credentials' })
//     // }
//     const user = req.user;
//     const accessToken = generateToken( user );
//     // console.log(req.user)
//     // req.session.user = {
//         //     first_name: req.user.first_name,
//         //     last_name: req.user.last_name,
//         //     email: req.user.email,
//         //     age: req.user.age,
//         //     role: req.user.role
//         // };
//     res.cookie('jwt-coder', accessToken, { signed: true }).redirect('/products')
 
// })

// router.get('/failLogin', ( req, res ) => res.render('errors/errorAuth',{error: 'Bad Request, try again with a correct email or password'}))



// router.post('/register', birthday , passport.authenticate('register', {failureRedirect: 'failRegister', session: false} ),  async( req, res ) => {
//     res.redirect('/')
// })

// router.get('/failRegister', ( req, res ) => {
//     return res.render('errors/errorAuth',{error: 'Email already exist'})
// })

// router.get('/logout', ( req, res ) => {
//     return res.clearCookie('jwt-coder').redirect('/')
// })

// router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }), (req, res)  => {

// })

// router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/', session: false }), async( req, res ) => {
//     const user = req.user;
//     const accessToken = generateToken( user );
//     res.cookie('jwt-coder', accessToken, { signed: true }).redirect('/products')

// })

// export default router; 