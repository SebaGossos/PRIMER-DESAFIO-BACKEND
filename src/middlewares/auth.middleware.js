export const auth = ( req, res, next ) => {
    if(req.session.user?.role === 'admin') {
        next()
    } else {
        res.send('Not Allowed')
        res.redirect('/')
    }
}

export const privateRoutes = ( req, res, next ) => {
    if( req.session.user ) return res.redirect('/profile')
    next()
}

export const publicRoutes = ( req, res, next ) => {
    
    if( !req.session.user ) return res.redirect('/')
    next()
}