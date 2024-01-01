export const birthday = async( req, res, next ) => {
    const date = req.body.age; 
    
    const today = new Date()
    const birthdateNum = new Date(date);
    let age = today.getFullYear() - birthdateNum.getFullYear()
    const month = today.getMonth() - birthdateNum.getMonth()
    
    if( month < 0 || (month === 0 && today.getDate() < birthdateNum.getDate())){
        age--
    }
    req.body.age = age


    next()

}