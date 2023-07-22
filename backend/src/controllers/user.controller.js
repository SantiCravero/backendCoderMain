import { deleteUserById, findInactiveUsers, findUserById, findUsers, updateUser } from "../services/userService.js";
// import { sendDeleteEmail } from "../utils/email.js";

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
    const currentDate = new Date()

    const twoDays = new Date(currentDate)
    twoDays.setDate(currentDate.getDate() - 2)

    const inactiveUsers = await findInactiveUsers(twoDays)

    // Compruebo si existe usuarios inactivos
    if (!inactiveUsers || inactiveUsers.length === 0) {
      req.logger.info('Usuarios inactivos no encontrados')
      return res.status(200).send('Usuarios inactivos no encontrados')
    }

    inactiveUsers.forEach(user => {
      transporter.sendMail({
        from: "Michael Kors",
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
      })
    });

    const result = await deleteInactiveUsers(twoDays)

    req.logger.info(`Usuarios inactivos eliminados`)
    res.status(200).send({
      status: 'success',
      deletedCount: `${result.deletedCount} usuarios inactivos eliminados`,
      deletedUsers: inactiveUsers
    })

  } catch (error) {
    req.logger.error(error)
    res.status(500).send(`Error en el servidor`)
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
