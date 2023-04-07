import local from "passport-local";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import jwt from 'passport-jwt'
import { managerUser } from "../controllers/user.controller.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";

const localStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializatePassport = () => {

  const cookieExtractor = (req) => {  //Si no existe, asigno undefined
    const token = (req && req.cookies) ? req.cookies('jwtCookies') : null
    return token
  }

  passport.use("jwt",new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SIGNED_COOKIE,
      }, async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      })
  );
  
  passport.use("register", new localStrategy(   //Passport define done como si fuera un res.status()
      { passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await managerUser.getUserByEmail(username); // username = email

          if (user) {   // Usuario existe 
            return done(null, false)   //null que no hubo errores y false que no se creo el usuario
          }

          const passwordHash = createHash(password);
          const userCreated = await managerUser.addElements([{
              first_name: first_name,
              last_name: last_name,
              email: email,
              age: age,
              password: passwordHash,
            }]);

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
        const user = await managerUser.getUserByEmail(username)

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
        const user = await managerUser.getUserByEmail(profile._json.email)

        if (user) { //Usuario ya existe en BDD
            done(null, user)
        } else {
            const passwordHash = createHash('coder123')
            const userCreated = await managerUser.addElements([{
                first_name: profile._json.name,
                last_name: ' ',
                email: profile._json.email,
                age: 18,
                password: passwordHash //Contraseña por default ya que no puedo accder a la contraseña de github
            }])

            done(null, userCreated)
        }
    } catch (error) {
        return done(error)
    }
  }))

    //Iniciar la session del usuario
  passport.serializeUser((user, done) => {
    console.log(user)
    if (Array.isArray(user)) {
      done(null, user[0]._id)
    } else {
      done(null, user._id)
    }
  })

    //Eliminar la sesion del usuario
  passport.deserializeUser(async (id, done) => {
    const user = await managerUser.getElementById(id)
    done(null, user)
  })
};

export default initializatePassport;
