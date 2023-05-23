import productModel from "../models/MongoDB/productModel.js"
import CustomError from "../utils/errors/customError.js";
import { EErrors } from "../utils/errors/enums.js";

export const findProducts = async () => {
    try {
        return await productModel.find()
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos",
            message: "No se pudo encontrar los productos",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}

export const findProductById = async (id) => {
    try {
        return await productModel.findById(id);
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos",
            message: "No se pudo encontrar el producto",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}

export const paginateProducts = async (filters, options) => {
    try {
        return await productModel.paginate(filters, options);
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos",
            message: "No se pudo encontrar los productos",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}

export const insertProducts = async (products) => {
    try {
        return await productModel.insertMany(products);
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos",
            message: "No se pudo crear el producto",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}

export const deleteOneProduct = async (id) => {
    try {
        return await productModel.findByIdAndDelete(id);
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos",
            message: "No se pudo eliminar el producto",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}

export const updateOneProduct = async (id, info) => {
    try {
        return await productModel.findByIdAndUpdate(id, info);
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos",
            message: "No se pudo actualizar el producto",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}