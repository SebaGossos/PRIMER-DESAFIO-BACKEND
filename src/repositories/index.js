//? ---- PRODUCTS ----
import { Product } from "../dao/factory/products.factory.js";
import ProductRepository from "./products.repository.js";
export const ProductService = new ProductRepository( new Product );

//? ---- CARTS ----
import { Carts } from "../dao/factory/carts.factory.js";
import CartRepository from "./carts.repository.js";
export const CartService = new CartRepository( new Carts( ProductService ) );

//? ---- CHAT ----
import { Chat } from "../dao/factory/chat.factory.js";
import ChatRepository from "./chat.repository.js";
export const ChatService = new ChatRepository( new Chat );

//? ---- USERS ----
import { User } from "../dao/factory/user.factory.js";
import UserRepository from "./user.repository.js";
export const UserService = new UserRepository( new User );


