import { TicketService } from "../repositories/index.js";
import { CartService } from "../repositories/index.js";

export default class TicketController {

    async purchase(req, res) {
        try{
            const cid = req.params.cid;
            const email = req.user.email;

            const { withoutStock, ticket } = await TicketService.purchase( cid, email )
            const cartUpdated = await CartService.update( cid, withoutStock );
            res.json({ status: 'success', payload: { withoutStock, ticket } })
        } catch(err){
            console.log( err )
        }
    }
    
}


