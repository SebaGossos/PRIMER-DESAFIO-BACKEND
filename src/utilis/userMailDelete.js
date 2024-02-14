import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import { ProductService, UserService } from "../repositories/index.js";

import config from '../config/config.js'

export const userDeletedMail = async( req, res, userMail ) => {

    const addressee = userMail;

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
            intro: "YOUR ACCOUNT HAS BEEN DELETED DUE TO INACTIVITY",
            outro: 'IF YOU WANT JOIN US, CREATE A NEW USER'
        }
    }
    let mail = Mailgenerator.generate(response)


    let message = {
        from: 'Coder <codershop@coderhouse.com>',
        to: addressee,
        subject: `ACCOUNT DELETED DUE TO INACTIVITY`,
        date: Date.now(),
        html: mail
    }
    transporter.sendMail(message)
        .then( () => true )
        .catch(error => error)

};