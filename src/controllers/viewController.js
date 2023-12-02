import { CartService, ProductService } from "../repositories/index.js";
import { PORT } from "../app.js";

export default class ViewController {
  async login(req, res) {
    try {
      res
        .clearCookie("jwt-coder")
        .render("authenticate/login", { userRegister: false });
    } catch (err) {
      res.render("errors/errorAuth", { error: err });
    }
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
      const { first_name, last_name, email, age, role, cart } = req.user;
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

      // const { payload, totalPages, prevPage, nextPage, prevLink, nextLink, page, hasPrevPage, hasNextPage } = await getProducts( req, res )

      res.render("home", {
        products: payload,
        prevLink,
        nextLink,
        hasPrevPage,
        hasNextPage,
        page,
        user: { first_name, last_name, email, age, role, cart },
        isAdmin: req.user.role === "admin",
      });
    } catch (error) {
      next( error )
      res.render("errors/errorPlatform", { error });
    }
  }

  async realTimeProducts(req, res) {
    try {
      const products = await ProductService.getAll();
      res.render("realTimeProducts", { products });
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
