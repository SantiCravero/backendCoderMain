import mongoose from "mongoose";
import userModel from "../src/models/MongoDB/userModel.js";
import Assert from 'assert'
import { createHash } from "../src/utils/bcrypt.js";
import { createCart } from "../src/services/cartService.js";
import 'dotenv/config.js'
import cartModel from "../src/models/MongoDB/cartModel.js";
import { type } from "os";
import chai, { expect } from "chai"

const assert = Assert.strict

await mongoose.connect(process.env.URLMONGODB)
describe("Testing de consulta a todos los usuarios", () => {
    // Previo a arrancar todos los test
    before(function () {
        console.log("Arrancando test")
    })
    // Previo a arrancar UN test
    beforeEach(function(){
        this.timeout(3000);
    })

    it("Test para obtener todos los usuarios de mi DB", async function () {
        //Contexto del test (scope propio)
        const users = await userModel.find();
        assert.strictEqual(Array.isArray(users), true)
    })

    it("Test para crear un usuario nuevo usuario en mi DB", async function () {
        //Para este tipo de test se consulta a una BDD para Testing
        const cart = await createCart();
        const hashPassword = createHash("admin");
        const newUser = {
            first_name: "Santiago",
            last_name: "Cravero",
            email: "santi@santi.com",
            role: "Admin",
            password: hashPassword,
            idCart: cart._id
        }

        const response = await userModel.create(newUser);
        assert.ok(response._id)
        // Eliminamos el carrito del usuario ya que no hago un test para el cart acá
        await cartModel.findByIdAndDelete(response.idCart)
    })
    it("Eliminar usuario creado anteriormente", async function(){
        const email = "santi@santi.com"
        const response = await userModel.findOneAndDelete({ email: email })
        console.log (response)
        // Me fijo que el usuario borrado sea un objeto, si es null al estar implementado con chai falla el test
        expect(response).to.be.an('object');
    })
});