import local from 'passport-local'
import passport from 'passport'
import { managerUser } from '../controllers/user.controller.js'
import { createHash, validatePassword } from '../utils/bcrypt.js'

