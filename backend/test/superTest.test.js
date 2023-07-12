import chai from "chai"
import mongoose from "mongoose"
import supertest from "supertest"
import 'dotenv/config.js'
import Assert from 'assert'

const expect = chai.expect
const assert = Assert.strict

const requester = supertest('http://localhost:5000');

await mongoose.connect(process.env.URLMONGODB)

// ESTAN TODOS COMENTADOS PARA AGILIZAR LA PRUEBA DE CADA PARTE

describe("Testing de mi aplicacion con supertest",()=>{
    //Testing de products
    // describe("Testing de las rutas de productos", ()=>{
    //     beforeEach(function(){
    //         this.timeout(3000);
    //     })
    //     // Testing de la ruta /api/product => method POST
    //     it("Ruta: /api/product con el metodo POST", async function(){
    //         const newProduct = {
    //             title: "Prueba",
    //             description: "Description",
    //             code: "3333",
    //             price: 24000,
    //             stock: 2,
    //             category: "Category",
    //             thumbnails: ["prueba.png"]
    //         }
    //         const {statusCode, _body, ok} = await requester.post('/api/product').send(newProduct)
    //         console.log(ok)
    //         console.log(statusCode)
    //         console.log(_body)
    //     })

    //     // Testing de la ruta /api/product => method PUT
    //     it("Ruta: api/product con el metodo PUT", async function () {
    //         const id = "646c10e50a536997d38c6a16"
    //         const updateProduct = {
    //             title: "Modificando",
    //             description: "Modificando",
    //             code: "2312",
    //             price: 65000,
    //             stock: 1,
    //             category: "Prueba",
    //             thumbnails: ["prueba.png"]
    //         }
    //         const { statusCode, _body, ok } = await requester.put(`/api/product/${id}`).send(updateProduct)
    //         console.log(ok)
    //         console.log(statusCode)
    //         console.log(_body)
    //     })

    //     // Testing de la ruta /api/product => method GET
    //     it("Ruta: /api/product con el metodo GET", async function(){
    //         const {statusCode, _body, ok} = await requester.get('/api/product')
    //         console.log(ok)
    //         console.log(statusCode)
    //         console.log(_body)
    //     })

    //     // Testing de la ruta /api/product => method DELETE
    //     it("Ruta: /api/product con el metodo DELETE", async function(){
    //         const id = "646c10e50a536997d38c6a16"
    //         const {statusCode, _body, ok} = await requester.delete(`/api/product/${id}`)
    //         console.log(ok)
    //         console.log(statusCode)
    //         console.log(_body)
    //     })

    //     // Testing de la ruta /api/product => method GET para UN producto
    //     it("Ruta: /api/product con el metodo GET para un producto", async function(){
    //         const id = '646c10e50a536997d38c6a16'
    //         const {statusCode, _body, ok} = await requester.get(`/api/product/${id}`)
    //         console.log(ok)
    //         console.log(statusCode)
    //         console.log(_body)
    //     })
    // })  

    // Testing de sessions
    // describe("Testing de las rutas de sessions",()=>{
    //     let cookie = "";

    //     // Testing de la ruta /api/session => method POST register
    //     it("Ruta: api/session/register con metodo POST register", async function(){
    //         const newUser = {
    //             first_name: "Santiago",
    //             last_name: "Cravero",
    //             email: "santiSuperTest@santi.com",
    //             role: "User",
    //             password: "coderhouse",
    //         }
    //         const  {_body } = await requester.post('/api/session/register').send(newUser)

    //         expect(_body.payload).to.be.ok
    //     })

    //     // Testing de la ruta /api/session => method POST login
    //     it("Ruta: api/session/login con metodo POST login", async function(){
    //         const user = {
    //             email: "santiSuperTest@santi.com",
    //             password: "coderhouse"
    //         }
    //         const result = await requester.post('/api/session/login').send(user)
    //         'nombreCookie="valor"'
    //         const cookieResult = result.headers['set-cookie'][0]

    //         expect(cookieResult).to.be.ok // Verificar existencia de cookie

    //         cookie = {
    //             name: cookieResult.split("=")[0],
    //             value: cookieResult.split("=")[1]
    //         }

    //         expect(cookie.name).to.be.ok.and.equal('connect.sid') //Verificamos la cookie
    //         expect(cookie.value).to.be.ok //Verificamos que exista el valor
    //     })

    //     // Testing de la ruta /api/session => method GET
    //     it("Ruta: api/session/current con metodo GET", async function(){
    //         //Utilizamos .set() para poner como si fuera una variable unas falsas cookies de navegador del login
    //         const {_body} = await requester.get('/api/session/current').set('Cookie',[`${cookie.name}=${cookie.value}`])

    //         expect(_body.payload.email).to.be.equal('santiSuperTest@santi.com')
    //     })
    // })
   
    // Testing de carts
    // describe("Testing de las rutas de cart", () => {
    //     let userCookie;
    //     //Se genera la session para poder probar 
    //     before(async () => {
    //         const email = 'santiSuperTest@santi.com'
    //         const password = 'coderhouse'
    //         const loginResponse = await requester.post('/session/login').send({ email: email, password: password, })
    //         userCookie = loginResponse.headers['set-cookie'];
    //     });

    //     // Testing de la ruta /api/cart => method GET
    //     it("Ruta: /api/cart con metodo GET", async function () {
    //         const response = await requester.get('/api/cart').set('Cookie', userCookie);
    //         expect(response._body.message).to.be.equal("Carrito devuelto correctamente")
    //     });

    //     // Testing de la ruta /api/cart => method PUT
    //     it("Ruta: /api/cart con metodo PUT para cambiar el carrito entero", async function () {
    //         const newCart =
    //             [
    //                 {
    //                     "productId": "646c10e50a536997d38c69c9",
    //                     "quantity": 1
    //                 },
    //                 {
    //                     "productId": "646c10e50a536997d38c69d2",
    //                     "quantity": 13
    //                 }
    //             ]
    //         const { statusCode, _body, ok } = await requester.put('/api/cart').set('Cookie', userCookie).send(newCart);

    //     })

    //     // Testing de la ruta /api/cart => method POST
    //     it("Ruta: /api/cart con metodo POST", async function () {
    //         const cartId = '64387f3434bbe1aa5ab06175'
    //         const productId = '646c10e50a536997d38c69d2'
    //         const { statusCode, _body, ok } = await requester.post(`/api/cart/${cartId}/products/${productId}`).set('Cookie', userCookie)
    //     })

    //     // Testing de la ruta /api/cart => method PUT cantidad
    //     it("Ruta: /api/cart con metodo PUT para cambiar cantidad", async function () {
    //         const cartId = '64387f3434bbe1aa5ab06175'
    //         const productId = '646c10e50a536997d38c69d2'
    //         const newQuantity = 11
    //         const { statusCode, _body, ok } = await requester.put(`/api/cart/${cartId}/products/${productId}`).set('Cookie', userCookie).send({ quantity: newQuantity });
    //     })

    //     // Testing de la ruta /api/cart => method DELETE un producto por id
    //     it("Ruta: /api/cart con metodo DELETE para borrar UN producto en particular por su id", async function () {
    //         const productId = '646c10e50a536997d38c69d2'
    //         const cartId = '64387f3434bbe1aa5ab06175'
    //         const { statusCode, _body, ok } = await requester.delete(`/api/cart/${cartId}/products/${productId}`).set('Cookie', userCookie);
    //     })

    //     // Testing de la ruta /api/cart => method DELETE todos productos
    //     it("Ruta: /api/cart con metodo DELETE para borrar todos los productos del carrito", async function () {
    //         const { statusCode, _body, ok } = await requester.delete(`/api/cart`).set('Cookie', userCookie);
    //     })
    // });
})