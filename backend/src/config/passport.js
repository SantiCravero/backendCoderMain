import local from "passport-local";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { createUser, findUserByEmail, findUserById } from "../services/userService.js";
import { createCart } from "../services/cartService.js";

const localStrategy = local.Strategy;

const initializatePassport = () => {
  
  passport.use("register", new localStrategy(   //Passport define done como si fuera un res.status()
      { passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        const { first_name, last_name, email, birthDate } = req.body;

        try {
          const user = await findUserByEmail(username); // username = email

          if (user) {   // Usuario existe 
            return done(null, false)   //null que no hubo errores y false que no se creo el usuario
          }

          const passwordHash = createHash(password);
          const cart = await createCart()
          const userCreated = await createUser([
            {
              first_name: first_name,
              last_name: last_name,
              email: email,
              birthDate: birthDate,
              password: passwordHash,
              idCart: cart._id
            },
          ]);
          
          const token = generateToken(userCreated);
          req.logger.info("Usuario creado: ", token)
          return done(null, userCreated);

        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use('login', new localStrategy(
    { usernameField: 'email' }, async (username, password, done) => {

    try {
        const user = await findUserByEmail(username)

        if (!user) { //Usuario no encontrado
            return done(null, false)
        }
        if (validatePassword(password, user.password)) { //Usuario y contraseña validos
            return done(null, user)
        }

        return done(null, false) //Contraseña no valida

    } catch (error) {
        return done(error)
    }
}))

  passport.use('github', new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/authSession/githubSession'
  }, async (accessToken, refreshToken, profile, done) => {

    try {
        console.log(profile)
        const user = await findUserByEmail(profile._json.email)

        if (user) { //Usuario ya existe en BDD
            done(null, user)
        } else {
            const cart = await createCart()
            const passwordHash = createHash('coder123')
            const userCreated = await createUser([{
                first_name: profile._json.name,
                last_name: ' ',
                email: profile._json.email,
                age: 18,
                password: passwordHash, //Contraseña por default ya que no puedo accder a la contraseña de github
                cartId: cart._id
              }])

            done(null, userCreated)
        }
    } catch (error) {
        return done(error)
    }
  }))

  //Iniciar la session del usuario
  passport.serializeUser((user, done) => {
    if (!user) {
        done(null, null);
    }
    if (Array.isArray(user)) {
        done(null, user[0]._id);
    } else {
        done(null, user._id);
    }
});

  //Eliminar la sesion del usuario
  passport.deserializeUser(async (id, done) => {
    const user = await findUserById(id)
    done(null, user)
  });
};

export default initializatePassport;
