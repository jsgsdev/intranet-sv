const User = require("../models/Users");
const Email = require("../models/Email");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const createToken = (user, secreta, expiresIn) => {
    const { id, email, name, lastname, role, createAt } = user
    return jwt.sign({ id, email, name, lastname, role, createAt }, secreta, { expiresIn } )
}

const resolvers = {
    Query: {
        getUser: async (_, { token }) => {
            const userId = await jwt.verify(token, process.env.SECRETA)
            
            return userId
        },
        getUsers: async () => {
            const users = await User.find({ })
            return users
        }
    },
    Mutation: {
        createUser: async (_, { input }) => {
            const { email, password, repeatpassword } = input

            const emailExists = await Email.findOne({ email })
            if(!emailExists) {
                throw new Error("Este email no se encuentra en nuestra bases de datos")
            }

            const userExists = await User.findOne({ email })
            if(userExists) {
                throw new Error("El usuario ya existe!")
            }

            if(password !== repeatpassword) {
                throw new Error("Las contraseñas no son iguales!")
            }

            const expReg = /[a-zA-Z0-9_.+-]+@woombatcg+.com+/

            if(!expReg.test(email)) {
                throw new Error("Este correo no pertenece a Woombat Consulting Group!")
            }

            const salt = await bcryptjs.genSalt(10)
            input.password = await bcryptjs.hash(password, salt)

            const userInput = {
                name: input.name,
                lastname: input.lastname,
                email: input.email,
                password: input.password
            }

            try {
                const user = new User(userInput)
                user.save()
                return user
            } catch (error) {
                console.log(error)
            }
        },
        authUser: async (_, { input }) => {

            const { email, password } = input

            const userExists = await User.findOne({ email })
            if (!userExists) {
                throw new Error('El empleado no existe!')
            }

            const correctPassword = await bcryptjs.compare(password, userExists.password)
            if(!correctPassword) {
                throw new Error('El password es incorrecto')
            }

            return {
                token: createToken(userExists, process.env.SECRETA, '24h' )
            }
        },
        registerEmail: async (_, { input }, ctx) => {
            const { email } = input

            const emailExists = await Email.findOne({ email })
            if(emailExists) {
                throw new Error("Este empleado ya esta registrado.")
            }

            if(ctx.user.role !== "ADMINISTRADOR") {
                throw new Error("No tienes los permisos necesarios.")
            }

            try {
                const email = new Email(input)
                email.save()
                return email
            } catch (error) {
                console.log(error)
            }
        }
    }
}

module.exports = resolvers;