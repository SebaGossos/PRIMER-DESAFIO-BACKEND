import config from "../../config/config.js";

export let Carts

const persistance = config.persistance.toUpperCase();

if ( persistance === 'MONGO' ) {
    const { default: CartsMongo } = await import('../db/cartsDB.js')
    Carts = CartsMongo;
}

if ( persistance === 'FILE' ) {
    const { default: CartsFile } = await import('../fs/carts_managerFS.js')
    Carts = CartsFile;
}