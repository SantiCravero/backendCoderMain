# 💻 Backend - Proyecto Final Coderhouse
_Comisión: 39685
_Alumno: Santiago Cravero

## Requerimientos previos 📋

_Antes de iniciar la aplicacion, se necesita instalar las dependencias con el siguiente comando:_
```
npm i
```
## Rutas de la API a testear

###### Todas las rutas detalladas pueden ser testeadas en Postman (excepto las rutas de 'vistas en la web', que se testean en un navegador) 
### Products: 
```
http://localhost:5000/api/product [GET] => Ruta para visualizar TODOS los productos
http://localhost:5000/api/product/:pid [GET] => Ruta para visualizar UN producto especifico
http://localhost:5000/api/product [POST] => Ruta para crear un producto
http://localhost:5000/api/product/:pid [PUT] => Ruta para actualizar un producti
http://localhost:5000/api/product/:pid [DELETE] => Ruta para eliminar un producto
```
### Cart:
```
http://localhost:5000/api/cart [GET] => Ruta para visualizar el carrito
http://localhost:5000/api/cart [PUT] => Ruta para actualizar los productos del carrito
http://localhost:5000/api/cart/product/:pid [POST] => Ruta para agregar productos al carrito
http://localhost:5000/api/cart/product/:pid [PUT] => Ruta para actualizar la cantidad de un producto
http://localhost:5000/api/cart/product/:pid [DELETE] => Ruta para eliminar UN producto del carrito
http://localhost:5000/api/cart [DELETE] => Ruta para eliminar TODOS los productos del carrito
http://localhost:5000/api/cart/purchase [POST] => Ruta para generar ticket de compra

```
### Github Auth:
```
http://localhost:5000/authSession/github [GET] 
http://localhost:5000/authSession/githubSession [GET]

```
### Sessions:
```
http://localhost:5000/api/session/login [POST] => Ruta para loguearse con un usuario
http://localhost:5000/api/session/register [POST] => Ruta para registrar un usuario
http://localhost:5000/api/session/logout [GET] => Ruta para cerrar sesion con un usuario
http://localhost:5000/api/session/current [GET] => Ruta para ver la sesion activa
```
### User:
```
http://localhost:5000/api/user [GET] => Ruta para visualizar TODOS los usuarios
http://localhost:5000/api/user/:uid/documents [POST] => Ruta para agregar una imagen a documents
http://localhost:5000/api/user [DELETE] => Ruta que elimina a los usuarios inactivos
```
### Vistas en la web:
```
http://localhost:5000/login
http://localhost:5000/register
http://localhost:5000/forgotPassword
http://localhost:5000/resetPassword
http://localhost:5000/product
http://localhost:5000/cart
http://localhost:5000/profile
http://localhost:5000/chat
```