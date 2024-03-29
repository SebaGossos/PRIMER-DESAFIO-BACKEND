import mongoose from "mongoose";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";
import { fakerES as faker } from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// helpers functions
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user?.password);

//? ---- JWT ----
export const generateToken = (user) =>
  jwt.sign({ user }, config.jwt.keyToken, { expiresIn: "24h" });
export const authToken = (req, res, next) => {
  // const token = req.headers.auth;

  const token = req.signedCookies["jwt-coder"];
  if (!token)
    return res
      .status(401)
      .clearCookie("jwt-coder")
      .render("errors/errorAuth", { error: "Not authorized" });
  jwt.verify(token, config.jwt.keyToken, (err, credentials) => {
    if (err)
      return res
        .status(403)
        .clearCookie("jwt-coder")
        .render("errors/errorAuth", { error: "Not authorized" });
    req.user = credentials.user;
    next();
  });
};
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user)
        return res
          .status(401)
          .render("errors/errorAuth", { error: "Need auth!" });
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { fieldname } = file;

    let destination;

    switch( fieldname ){

      case 'thumbnail':
        destination = 'products'
        break
      
      case 'profilePicture':
        destination = 'profile'
        break

      case 'dni':
        destination = 'dni'
        break
        
      case 'addresProof':
        destination = 'addresProof'
        break

      case 'bankProof':
        destination = 'bankProof'
        break

      default:
        break
    }
    if( destination === 'profile' ) 
      cb(null, `src/public/images/${ destination }`);
    
    else cb(null, `src/documents/${ destination }/`);
    
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploader = multer({ storage })

export const initMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://winigossos:coder@cluster0.digmtmx.mongodb.net/",
      {
        dbName: "ecommerce",
      }
    );
  } catch (err) {
    console.log("Error to connect DB");
  }
};

export const createMockingProducts = async () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    code: uuidv4(),
    stock: 100,
    category: faker.commerce.productAdjective(),
    status: true,
    thumbnail: faker.image.avatar(),
  };
};

export const generateRandonString = (num) => {
  return [...Array(num)]
    .map(() => {
      const randomNum = ~~(Math.random() * 36);
      return randomNum.toString(36);
    })
    .join("")
    .toUpperCase();
};

export default __dirname;
