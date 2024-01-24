import supertest from 'supertest'
import { expect } from 'chai'


const requester = supertest('http://localhost:8080')


describe('Testing Auth', () => {
  describe(' /api/Auth', () => {

    const userLogged = 'test@api.com'
    const passwordLogged = 'a'

    const userNotLogged = 'hola@hola.com'
    const passwordNotLogged = 'abc'
  
    it('Endpoint /api/auth/login should recibe a jwtCookie', async() => {
      const response = await requester.post('/api/auth/login')
            .send({ email: userLogged, password: passwordLogged }).expect(302)

      const jwtCookie = response.header['set-cookie'].find(cookie => {
        return cookie.startsWith('jwt-coder')
      })

      expect( response.headers.location ).to.equal('/products')

      expect(jwtCookie).not.to.be.undefined;

    })

    it('Endpoint /api/auth/login recibe an error', async() => {
      const response = await requester.post('/api/auth/login')
            .send({ email: userNotLogged, password: passwordNotLogged }).expect(302)
            
      // console.log(response.headers)
      const jwtCookie = response.header['set-cookie']?.find(cookie => {
        return cookie.startsWith('jwt-coder')
      })
      
      expect(jwtCookie).to.be.undefined;
      expect( response.headers.location ).to.equal('failLogin')


    })

    
    // it('Endpoint /api/products should receive an array of carts', async () => {
    //   const { status, headers , _body } = await requester.get('/api/carts')
    //                                               .set('Cookie', jwtCookie)
    //                                               .expect(200)

    //   expect(_body.status).to.be.equal('success')
    //   expect(_body.success).to.be.an('array');

    // })

    // it('Endpoint  /api/carts/:cid should receive a cart', async () => {
    //   const cid = '653ba14551f65a1fbea18803'
    //   const { status, headers, _body } = await requester.get(`/api/carts/${cid}`)
    //                                               .set('Cookie', jwtCookie)
    //                                               .expect( 200 )

    //   expect(_body.status).to.be.equal('success')
    //   expect(_body.payload).to.have.property('_id', cid)                                             
    // })
    
  })
})