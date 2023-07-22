import { deleteUserById, findUserById, findUsers, updateUser } from "../services/userService.js";
import { sendDeleteEmail } from "../utils/email.js";

export const getUsers = async (req, res) => {
  try {
    const users = await findUsers()
    return res.status(200).send(users)

} catch (error) {
    req.logger.fatal("Hubo un error en el servidor")
    return res.status(500).send(error)
}
};

export const deleteInactiveUsers = async (req, res, next) => {
  try {
    const users = await findUsers();
    if (users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    let deleted = false;
    for (const user of users) {
      const lastConnection = user.lastConnection;
      const currentDate = new Date();
      const timeDay = 24 * 60 * 60 * 1000; // Cantidad de milisegundos en un día
      const inactiveUsersDays = Math.floor((currentDate - lastConnection) / timeDay);
      if (inactiveUsersDays >= 2) {
        deleted = true;
        await deleteUserById(user._id);
        console.log(await sendDeleteEmail(user));
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: "Usuarios inactivos no encontrados" });
    }

    return res.status(200).json({ message: "Usuarios inactivos eliminados" });
  } catch (error) {
    return res.status(500).json({ message: error });
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

    const newDocs = {
      name: file.filename,
      reference: file.path,
    };

    // Actualiza el usuario
    const info = await updateUser(userID, {
      $push: { documents: newDocs },
    });

    res
      .status(201)
      .send(`El archivo '${file.originalname}' fue subido exitosamente`);
  } catch (error) {
    res.status(500).send(`Error en el servidor`);
  }
};
