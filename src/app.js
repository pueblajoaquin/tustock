import express from 'express'
import { manejarErrores } from './lib/manejo-de-errores.js'

const app = express()

app.use(express.json())

app.use(manejarErrores)

export default app
