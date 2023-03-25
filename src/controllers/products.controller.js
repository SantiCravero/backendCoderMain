import { getManagerProducts } from "../dao/daoManager.js";

const data = await getManagerProducts()
export const managerProduct = new data.ManagerProductMongoDB

export const getProducts = async (req, res) => {
    const { limit, page, filter, sort } = req.query

    const pagina = page != undefined ? page : 1
    const limite = limit != undefined ? limit : 10
    const orden = sort == "asc" ? 1 : -1
    try {
        const productos = await managerProduct.getProducts(limite, pagina, filter, orden)

        if (productos) {
            return res.status(200).json(productos)
        }

        res.status(200).json({
            message: "Productos no encontrados"
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const getProduct = async (req, res) => {
    const idProduct = req.params.pid

    try {
        const product = await managerProduct.getElementById(idProduct)

        if (product) {
            return res.status(200).json({product})
        }

        res.status(200).json({
            message: "Producto no encontrado"
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const createProduct = async (req, res) => {
    const info = req.body

    try {
        const products = await managerProduct.addElements(info)

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export const updateProduct = async (req, res) => {
    const idProduct = req.params.pid;
    const info = req.body;

    try {
        const product = await managerProduct.updateElement(idProduct, info);

        if (product) {
            return res.status(200).json({
                message: "Producto actualizado"
            });
        }

        res.status(200).json({
            message: "Producto no encontrado"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export const deleteProduct = async (req, res) => {
    const idProduct = req.params.pid

    try {
        const product = await managerProduct.deleteElement(idProduct);

        if (product) {
            return res.status(200).json({
                message: "Producto eliminado"
            });
        }

        res.status(200).json({
            message: "Producto no encontrado"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}