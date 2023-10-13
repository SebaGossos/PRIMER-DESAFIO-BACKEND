// export const auth = ( req, res, next ) => {
//     if(req.session.user?.role === 'admin') {
//         next()
//     } else {
//         res.send('Not Allowed')
//         res.redirect('/')
//     }
// }

export const isAdmin = ( req, res, next ) => { 
    const { email, password } = req.body;
    if ( email === 'adminCoder@coder.com' || password === 'adminCod3r123' ) {
        req.session.user = { email, role: 'admin' }
        return res.redirect('/products')
    }
    next()
}

export const privateRoutes = ( req, res, next ) => {
    if( req.session.user ) return res.redirect('/profile')
    next()
}

export const publicRoutes = ( req, res, next ) => {
    
    if( !req.session.user ) return res.redirect('/')
    next()
}