import { findUserById, findUsers, updateUser, } from "../services/userService.js";

export const getUsers = async (req, res) => {
  try {
    const users = await findUsers();
    res.status(200).json({ users });
  } catch (error) {
    req.logger.fatal("Error en el servidor");
    res.status(500).send({
      message: "Hubo un error en el servidor",
      error: error.message,
    });
  }
};

export const addDocs = async (req, res, next) => {
  try {
    const file = req.file;
    const userID = req.params.uid;

    // Comprueba que exista algun archivo
    if (!file) {
      req.logger.info("Archivo no recibido");
      return res.status(400).send("Archivo no recibido");
    }

    // Comprueba que el usuario existe
    const userFound = await findUserById(userID);
    if (!userFound) {
      req.logger.info("Usuario no encontrado");
      return res.status(400).send("Usuario no encontrado");
    }

    const newDocsItem = {
      name: file.filename,
      reference: file.path,
    };

    // Actualiza el usuario
    const isInfoUpdated = await updateUser(userID, {
      $push: { documents: newDocsItem },
    });

    res.status(201).send(`El archivo '${file.originalname}' fue subido exitosamente`);
  } catch (error) {
    res.status(500).send(`Error en el servidor`);
  }
};