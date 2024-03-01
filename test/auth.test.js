import supertest from 'supertest'
import { expect } from 'chai'
import { fakerES as faker } from "@faker-js/faker";
import config from "../src/config/config.js";



const requester = supertest(`http://localhost:${config.port}`)


describe('Testing Auth', () => {
  describe(' /api/auth', () => {

    let jwtCookie;

    const userLogged = 'test@api.com'
    const passwordLogged = 'a'

    const userNotLogged = 'hola@hola.com'
    const passwordNotLogged = 'abc'
  
    it('Endpoint /api/auth/login should recibe a jwtCookie', async() => {
      const response = await requester.post('/api/auth/login')
            .send({ email: userLogged, password: passwordLogged }).expect(302)

      jwtCookie = response.header['set-cookie'].find(cookie => {
        return cookie.startsWith('jwt-coder')
      })

      expect( response.headers.location ).to.equal('/products')

      expect(jwtCookie).not.to.be.undefined;

    })

    it('Endpoint /api/auth/login recibe an error', async() => {
      const response = await requester.post('/api/auth/login')
            .send({ email: userNotLogged, password: passwordNotLogged }).expect(302)
            

      const jwtCookie = response.header['set-cookie']?.find(cookie => {
        return cookie.startsWith('jwt-coder')
      })
      
      expect(jwtCookie).to.be.undefined;
      expect( response.headers.location ).to.equal('failLogin')

    })

    //! REGISTER
    //? CREATE A NEW USER EMAIL EVERYTIME THAT REGISTER
    const userToRegister = {
      first_name: 'Pepe',
      last_name: 'Sand',
      email: faker.internet.email(),
      age: 33,
      password: 'abc'
    }

    it('Register /api/auth/register register a user', async() => {

      const response = await requester.post('/api/auth/register')
                                      .send( userToRegister )
                                      .expect( 302 )
      expect(response.headers?.location).to.equal('/')
    })
    
    it('Register /api/auth/register recibe an error', async() => {

      const response = await requester.post('/api/auth/register')
                                      .send( userToRegister )
                                      .expect( 302 )

      expect(response.headers?.location).to.equal('failRegister')
    })
    
    after(async function () {

      const deleteCart = await requester.delete(`/api/carts/delete/${userToRegister.email}`)
                                      .set( 'Cookie', jwtCookie )
                                      .expect( 200 )
      // console.log( deleteCart.headers, deleteCart.body )

      const deleteUser = await requester.delete(`/api/auth/userDelete/${userToRegister.email}`)
                                      .set( 'Cookie', jwtCookie )
                                      .expect( 200 )
      // console.log( deleteUser.headers, deleteUser.body )
      
    })
  })

})
