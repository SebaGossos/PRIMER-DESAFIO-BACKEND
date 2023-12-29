import {
  CartService,
  ProductService,
  UserService,
} from "../repositories/index.js";
import { PORT } from "../app.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import config from "../config/config.js";
import { generateToken,generateRandonString } from "../utilis/utils.js";
import { userPasswordModel } from "../models/UserPassword.js";

export default class ViewController {
  async login(req, res) {
    try {
      let messageRecovery = false;
      if (process.env.isPasswordRecovery === "true") messageRecovery = true;
      process.env.isPasswordRecovery = false;

      res
        .clearCookie("jwt-coder")
        .render("authenticate/login", { messageRecovery });
    } catch (err) {
      res.render("errors/errorAuth", { error: err });
    }
  }

  async forgetPassword(req, res) {
    res.render("authenticate/forget_password");
  }

  async recoveryPassword(req, res) {
    const addressee = req.body.email;
    const user = await UserService.getByEmail(addressee);
    if (!user)
      return res.render("errors/errorAuth", {
        error: "User Email not found try again with a correct email",
      });

    const PORT = config.port;
    const token = generateRandonString(22);
    const urlRecovery = `http://${req.hostname}:${PORT}/verify-token/${token}`;

    let configNodeMailer = {
      service: "gmail",
      auth: {
        user: config.nodemailer.user,
        pass: config.nodemailer.pass,
      },
    };

    let transporter = nodemailer.createTransport(configNodeMailer);

    let Mailgenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Coder App",
        link: "http://www.coderhouse.com",
      },
    });

    let response = {
      body: {
        intro:
          "YOUR LINK TO RECOVER YOUR PASSWORD IS HERE, YOU ONLY HAVE 1 HOUR TO USE IT",
        outro: urlRecovery,
      },
    };
    let mail = Mailgenerator.generate(response);

    let message = {
      from: "DEPARTMENT SECURITY - Coder <codershop@coderhouse.com>",
      to: addressee,
      subject: `Finish purchase successfully`,
      html: mail,
    };

    transporter.sendMail(message)
      .then( async() => {
        process.env.isPasswordRecovery = true;
        try {
          //SAVE MODEL USERPASSWORD
          const userPassword = new userPasswordModel({
            email: addressee,
            token
          })
          userPassword.save()
          return res.redirect("/");
        } catch( error ) {
          console.log(error)
        }
      })
      .catch((err) => res.status(500).json({ status: "error", error: err }));
  }

  async verifyToken(req, res) {
    // Find Token in DB
    const token = req.params.passToken;
    const userP = await userPasswordModel.findOne({ token })
    if( !userP ) return res.render("errors/errorAuth", { error: 'Your time to change your password has just expired' });

    return res.render('authenticate/put_password')
  }

  async register(req, res) {
    try {
      res.clearCookie("jwt-coder").render("authenticate/register");
    } catch (err) {
      res.render("errors/errorAuth", { error: err });
    }
  }
  
  async products(req, res, next) {
    try {
      let user;

      const {
        payload,
        totalPages,
        prevPage,
        nextPage,
        prevLink,
        nextLink,
        page,
        hasPrevPage,
        hasNextPage,
      } = await ProductService.getAllPaginate(req, PORT);
      
      user = req.user;
      if(req.user.role !== 'admin') user = await UserService.getByEmail( req.user.email )

      const { first_name, last_name, email, age, role, cart } = user;

      const objectForHandlebars = {
        products: payload,
        prevLink,
        nextLink,
        hasPrevPage,
        hasNextPage,
        page,
        user: { first_name, last_name, email, age, role, cart },
        role: {
          isAdmin: role === "admin",
          isPremium: role === "premium",
          isUser: role === 'user'
        },
      }

      const newToken = generateToken( user )
      
      return res.cookie("jwt-coder", newToken, { signed: true }).render("home", objectForHandlebars);
 
    } catch (error) {
      next(error);
      res.render("errors/errorPlatform", { error });
    }
  }

  async realTimeProducts(req, res) {
    try {
      let products;
      if( req.user.role === 'admin' ) products = await ProductService.getAll();
      else {
        products = await ProductService.getAllByEmail( req.user.email )
      }
      return res.render("realTimeProducts", { products, user: req.user });
    } catch (err) {
      res.render("errors/errorPlatform", { error: err });
    }
  }

  async cartId(req, res) {
    const cid = req.params.cid;
    try {
      const dataCart = await CartService.getById(cid);
      const cart = JSON.parse(JSON.stringify(dataCart));
      const products = cart.products.map((p) => {
        const prod = { ...p.pId, quantity: p.quantity };
        return prod;
      });

      res.render("cart", { cartId: cart._id, products });
    } catch (err) {
      res.render("errors/errorPlatform", { error: err });
    }
  }

  async chat(req, res) {
    try {
      res.render("chat");
    } catch (err) {
      res.render("errors/errorPlatform", { error: err });
    }
  }

  async profile(req, res) {
    try {
      const { first_name, last_name, email, age, cart, role } = req.user;
      res.render("authenticate/profile", {
        first_name,
        last_name,
        email,
        age,
        role,
        isUser: role === "user",
        cartId: cart,
      });
    } catch (err) {
      res.render("errors/errorAuth", { error: err });
    }
  }

  failToken = (req, res) =>
    res
      .clearCookie("jwt-coder")
      .render("errors/errorAuth", { error: "Error to Authenticate" });
}
