import local from "passport-local";
import passport from "passport";
import { managerUser } from "../controllers/user.controller.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";

const localStrategy = local.Strategy;

const initializatePassport = () => {
  //Passport define done como si fuera un res.status()
  passport.use("register", new localStrategy(
      { passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await managerUser.getUserByEmail(username); // username = email

          if (user) {   // Usuario existe 
            return done(null, false)   //null que no hubo errores y false que no se creo el usuario
          }

          const passwordHash = createHash(password)
          const userCreated = await managerUser.addElements([{
              first_name: first_name,
              last_name: last_name,
              email: email,
              age: age,
              password: passwordHash,
            }]);

          return done(null, userCreated)

        } catch (error) {
          return done(error)
        }
      }
    )
  );

  passport.use('login', new localStrategy(
    { usernameField: 'email' }, async (username, password, done ) => {
        try {
            const user = await managerUser.getUserByEmail(username)

            if(!user) {    // Usuario NO encontrado
                return done(null, false)
            }
            if (validatePassword(password, user.password)) {  //Usuario y contraseña validos
                return done(null, user)
            }

            return done(null, false) //Contraseña no valida

        } catch (error) {
            return done(error)
        }
    }))

  //Iniciar la session del usuario
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  //Eliminar la sesion del usuario
  passport.deserializeUser(async (id, done) => {
    const user = await managerUser.getElementById(id)
    done(null, user)
  })

};

export default initializatePassport
