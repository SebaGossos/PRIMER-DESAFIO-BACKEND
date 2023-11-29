import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import { ProductService } from "../repositories/index.js";

import config from '../config/config.js'

const getBill = async( req, res ) => {
    
    let productsPurchased = [];

    let ticket = req.body.ticket;

    const destinatario = ticket.emailToSend
    
    let productsTicket = ticket.products;

    for ( let prod of await productsTicket ) {
        
        const pid = prod.product;

        const p = await ProductService.getById( pid )

        const prodToAdd = { ...p, quantity: prod.quantity }

        productsPurchased.push(prodToAdd)
        
    }

    let configNodeMailer = {
        service: 'gmail',
        auth: {
            user: config.nodemailer.user,
            pass: config.nodemailer.pass
        }
    }

    let transporter = nodemailer.createTransport(configNodeMailer)

    let Mailgenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Coder Shop',
            link:'http://www.coderhouse.com'
        }
    })
    
    let response = {
        body: {
            intro: "Your bill has arrived!",
            table: {
                data: productsPurchased.map( p => {
                    return {
                        title: p.title,
                        description: p.description,
                        price: 0,
                        code: p.code,
                        stock: p.stock,
                        category: p.category,
                        thumbnail: p.thumbnail,
                        status: p.status,
                        quantity: p.quantity
                    }
                })
            },
            outro: 'Looking forward to do more business'
        }
    }
    let mail = Mailgenerator.generate(response)

    let message = {
        from: 'Dpto Ventas - Coder <codershop@coderhouse.com>',
        to: destinatario,
        subject: `Finish purchase successfully`,
        html: mail
    }


    transporter.sendMail(message)
        .then(() => {
            return res.status(200).json({ message: 'Yo have received an email' })
        })
        .catch(err => res.status(500).json({ err }))

}
export default getBill;