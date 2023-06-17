# Establecer la imagen base
FROM node:18.16.0

#Crear y establecer el directorio de mi contenedor
WORKDIR /backCoder_main

#Copio todos los archivos de src al directorio de trabajo
# El ./ significa => que estan en mi directorio actual
COPY src ./src
COPY package*.json ./
COPY .env ./

#Instalar dependencias
RUN npm install

# Puerto de app
EXPOSE 5000

#Comando para iniciar mi aplicacion 
CMD ["node", "src/index.js"]