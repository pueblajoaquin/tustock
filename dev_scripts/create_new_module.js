#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

// Obtener parámetros de la línea de comandos
const moduleName = process.argv[2]
const modulePath = process.argv[3]

// Validar que se pasen ambos parámetros
if (!moduleName || !modulePath) {
  console.error('pasar dos parámetros')
  console.error('Uso: node create-module.js <nombre> <path>')
  console.error('Ejemplo: node create-module.js usuario src/modules')
  process.exit(1)
}

// Crear la ruta completa
const fullPath = path.join(modulePath, moduleName)

try {
  // Crear la carpeta del módulo
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`Carpeta creada: ${fullPath}/`)
  } else {
    console.warn(`La carpeta ya existe: ${fullPath}/`)
  }

  const files = [
    `${moduleName}.service.js`,
    `${moduleName}.controller.js`,
    `${moduleName}.routes.js`
  ]

  files.forEach(file => {
    const filePath = path.join(fullPath, file)

    if (!fs.existsSync(filePath)) {
      let content = ''

      if (file.includes('service')) {
        content = `// Servicio de ${moduleName}\n\nclass ${capitalize(moduleName)}Service {\n  // Lógica de negocio aquí\n}\n\nmodule.exports = new ${capitalize(moduleName)}Service();\n`
      } else if (file.includes('controller')) {
        content = `// Controlador de ${moduleName}\n\nclass ${capitalize(moduleName)}Controller {\n  // Manejo de rutas aquí\n}\n\nmodule.exports = new ${capitalize(moduleName)}Controller();\n`
      } else if (file.includes('routes')) {
        content = `// Rutas de ${moduleName}\n\nclass ${capitalize(moduleName)}Routes {\n  // Definición de rutas aquí\n}\n\nmodule.exports = new ${capitalize(moduleName)}Routes();\n`
      }

      fs.writeFileSync(filePath, content)
      console.log(`Archivo creado: ${file}`)
    } else {
      console.warn(`Archivo ya existe: ${file}`)
    }
  })

  console.log('\nMódulo creado exitosamente!')
} catch (error) {
  console.error('Error:', error.message)
  process.exit(1)
}

// Función auxiliar para capitalizar
function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
