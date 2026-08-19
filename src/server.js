import app from './app.js'

const PORT = process.env.PORT || 0

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})
