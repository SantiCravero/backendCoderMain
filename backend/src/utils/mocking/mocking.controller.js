import { faker } from '@faker-js/faker'
import { insertProducts } from '../../services/productService.js';

export const mockingProducts = async (req, res) => {

    const products = [];

    const createRandomProduct = () => { 
        return {
            productId: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            code: faker.datatype.string(10),
            price: faker.commerce.price({ min: 5000, max: 100000 }),
            status: faker.datatype.boolean(),
            stock: faker.string.numeric(2),
            category: faker.commerce.department(),
            thumbnails: faker.image.imageUrl()
        }
    }

    for(let i = 0; i < 100; i++) {
        products.push(createRandomProduct());
    }
    
    await insertProducts(products);
    res.status(200).send({
        message: "Productos agregados correctamente",
        payload: products
    })
}
