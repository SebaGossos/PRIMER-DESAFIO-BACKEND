import config from "../../config/config.js";

export let Product

const persistance = config.persistance.toUpperCase();

if ( persistance === 'MONGO' ) {
    const { default: ProductsMongo } = await import('../db/productDB.js')
    Product = ProductsMongo;
}

if ( persistance === 'FILE' ) {
    const { default: ProductFile } = await import('../fs/products_managerFS.js')
    Product = ProductFile;
}