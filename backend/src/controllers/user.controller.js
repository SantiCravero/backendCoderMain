import { findInactiveUsers, findUserById, findUsers, updateUser } from "../services/userService.js";

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

export const deleteInactiveUsers = async (req, res, next) => {
  try {

    const date = new Date();
    const twoDays = new Date(date);

    twoDays.setDate(date.getDate() - 1); // Cambiar a 2
    console.log(twoDays)

    const inactiveUsers = await findInactiveUsers(twoDays);

    // Comprueba si existe algun usuario inactivos para eliminar
    if (!inactiveUsers || inactiveUsers.length === 0) {
      req.logger.info("No se encontro usuario inactivos");
      return res.status(200).send("No se encontro usuario inactivos");
    }

    inactiveUsers.forEach( async (user) => {
      await transporter.sendMail({
        from: "no-reply",
        to: user.email,
        subject: `${user.first_name}, tu cuenta ha sido eliminada por inactividad`,
        html: `<p>Hola ${user.first_name},</p>

          <p>Por desgracia, debimos eliminar tu cuenta debido a la inactividad(</p>
          <p>A partir de este momento, su email se encuentra listo para volverse a utilizar.</p>
          <small>Si desea volver a nuestra web, debe registrarse nuevamente</small>
          </br>
          <p>Esperamos volver a verlo</p>
          <h2>Michael Kors</h2>

          `,
      });
    });

    const result = await deleteInactiveUsers(twoDays);

    req.logger.info(`Usuarios inavtivos eliminados`);
    res.status(200).send({
      status: "success",
      deletedCount: `${result.deletedCount} usuarios inavtivos eliminados`,
      deletedUsers: inactiveUsers,
    });

  } catch (error) {
    req.logger.error(error);
    res.status(500).send(`Error en el servidor`);
  }
  // try {
  //   const users = await findUsers();
  //   if (users.length === 0) {
  //     return res.status(404).json({ message: "Usuario no encontrado" });
  //   }
  //   let algunBorrado = false;
  //   for (const user of users) {
  //     const lastConnection = user.lastConnection;
  //     const currentDate = new Date();
  //     const timeDay = 24 * 60 * 1000; // Cantidad de milisegundos en un día
  //     const inactiveUsersDays = Math.floor((currentDate - lastConnection) / timeDay);
  //     if (inactiveUsersDays >= 2) {
  //       algunBorrado = true;
  //       await deleteUserById(user._id);
  //       console.log(await sendDeleteEmail(user));
  //     }
  //   }

  //   if (!algunBorrado) {
  //     return res.status(404).json({ message: "Usuarios inactivos no encontrados" });
  //   }

  //   return res.status(200).json({ message: "Usuarios inactivos eliminados" });
  // } catch (error) {
  //   return res.status(500).json({ message: error });
  // }
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
