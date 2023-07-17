import { findProductById, insertProducts, updateOneProduct, paginateProducts, deleteOneProduct } from "../services/productService.js";
import CustomError from '../utils/errors/customError.js';
import { EErrors } from "../utils/errors/enums.js";
import { generateAddProductErrorInfo } from "../utils/errors/info.js";

export const getProducts = async (req, res) => {
    const { limit, page, filters, sort } = req.query

    const pagina = page != undefined ? page : 1
    const limite = limit != undefined ? limit : 10
    const orden = sort == "asc" ? 1 : -1

    const options = {
        page: pagina,
        limit: limite,
        ord: orden
    }
    
    try {
        const productos = await paginateProducts(filters, options)

        if (productos) {
            return res.status(200).json(productos)
        }

        res.status(200).json({
            message: "Productos no encontrados"
        })

    } catch (error) {
        req.logger.fatal("Fatal error: ", error.message)
        res.status(500).json({
            message: error.message
        })
    }
}

export const getProduct = async (req, res) => {
    const idProduct = req.params.pid

    try {
        const product = await findProductById(idProduct)

        if (product) {
            return res.status(200).json({product})
        }

        res.status(200).json({
            message: "Producto no encontrado"
        })

    } catch (error) {
        req.logger.error("Error al buscar el producto")
        res.status(500).json({
            message: error.message
        })
    }
}

export const createProduct = async (req, res, next) => {
  const info = req.body;

  try {
    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category'];

    if (requiredFields.every((field) => info[field])) {
        const product = await insertProducts(info);
        res.status(200).send({
            message: 'Producto agregado correctamente',
            product: product
        });
    } else {
        CustomError.createError({
            name: "Error creando el producto",
            message: "No se pudo crear el producto",
            cause: generateAddProductErrorInfo(info),
            code: EErrors.MISSING_FIELDS_ERROR
        })
        req.logger.fatal("Error por falta de campos de producto")
    }

} catch (error) {
    next(error)
}
};

export const updateProduct = async (req, res) => {
    const idProduct = req.params.pid;
    const info = req.body;

    try {
        const product = await updateOneProduct(idProduct, info);

        if (product) {
            return res.status(200).json({
                message: "Producto actualizado"
            });
        }

        res.status(200).json({
            message: "Producto no encontrado"
        });

    } catch (error) {
        req.logger.fatal("Fatal error: ", error.message)
        res.status(500).json({
            message: error.message
        });
    }
}

export const deleteProduct = async (req, res) => {
    const idProduct = req.params.pid

    try {
        const product = await deleteOneProduct(idProduct);

        if (product) {
            return res.status(200).json({
                message: "Producto eliminado"
            });
        }

        res.status(200).json({
            message: "Producto no encontrado"
        });

    } catch (error) {
        req.logger.fatal("Fatal error: ", error.message)
        res.status(500).json({
            message: error.message
        })
    }
}