import { getManagerUsers } from "../dao/daoManager.js";
import { createHash } from "../utils/bcrypt.js";

const data = await getManagerUsers();
export const managerUser = new data.ManagerUserMongoDB();

export const createUser = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    const user = await managerUser.getUserByEmail(email);

    if (user) {
      res.status(200).json({
        status: "failure",
        message: "El email ya esta en uso, pruebe otro",
      });
    } else {
      const hashPassword = createHash(password);
      await managerUser.addElements([
        {
          first_name: first_name,
          last_name: last_name,
          email: email,
          age: age,
          password: hashPassword,
        },
      ]);

      res.status(200).json({
        status: "success",
        message: "El usuario ha sico creado con exito",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
