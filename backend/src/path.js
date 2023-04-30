import { dirname } from 'path'
import {fileURLToPath} from 'url'

export const __filename = fileURLToPath(import.meta.url) // Me dice la ruta del archivo
export const __dirname = dirname(__filename)