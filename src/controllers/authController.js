import { generateToken } from "../utils.js";
import UserDTO from "../dto/user.dto.js";


export default class AuthController {
    
    //!REGISTER
    registerUser = ( req, res ) => res.redirect('/')
    failRegister = ( req, res ) => res.render('errors/errorAuth',{error: 'Email already existt'})
   
    //!LOGIN
    loginUser = ( req, res ) => { 

        const user = new UserDTO( req.user );
        const accessToken = generateToken( user );
        return res.cookie('jwt-coder', accessToken, { signed: true }).redirect('/products')
    }
    failLogin = ( req, res ) => res.render('errors/errorAuth',{error: 'Bad Request, try again with a correct email or password'})

    //!GITHUBLOGIN
    loginGithub = ( req, res ) => {}
    githubCallback = async( req, res ) => {
        const user = req.user;
        const accessToken = generateToken( user );
        return res.cookie('jwt-coder', accessToken, { signed: true }).redirect('/products')
    }
    
    //!LOGOUT
    logout = (req, res) => res.clearCookie('jwt-coder').redirect('/')
    
}