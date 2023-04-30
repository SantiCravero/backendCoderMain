import bcrypt from 'bcrypt'

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))

// El parametro de la IZQUIERDA es la password que envia el usuario, la de la DERECHA es la de la BDD que hay que consultar
export const validatePassword = (passwordSend, passwordBDD) => {
    return bcrypt.compareSync(passwordSend, passwordBDD)
}