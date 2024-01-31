import { UserService } from "../repositories/index.js";

export default class UserController {
    premium = async( req, res ) => {

        const uid = req.params.uid
        const user = await UserService.findById( uid );
    
        if (user.role === 'premium') {
          await UserService.update(uid, { role: 'user' })
          return res.json({'siu': 33})
        }
    
        await UserService.update( uid, { role: 'premium' })
    
        return res.json({'siu': 33})
    }
}