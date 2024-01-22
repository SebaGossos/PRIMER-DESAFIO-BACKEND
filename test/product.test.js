import supertest from 'supertest'
import { expect } from 'chai'



const requester = supertest('http://localhost:8080')


describe('Testing Product', () => {
  describe('GET /api/products', () => {

    let jwtCookie;
  
    before( async() => {
      const response = await requester.post('/api/auth/login')
            .send({ email: 'test@api.com', password: 'a' }).expect(302)

      jwtCookie = response.header['set-cookie'].find(cookie => {
        return cookie.startsWith('jwt-coder')
      })

    })
    
    it('Endpoint /api/products should receive an array of products', async () => {
      const { status, headers , _body } = await requester.get('/api/products')
                                                  .set('Cookie', jwtCookie)
                                                  .expect(200)

      expect(_body.status).to.be.equal('success')
      expect(_body.payload).to.be.an('array');

    })

    it('Endpoint  /api/products/:pid should receive a product', async () => {
      const pid = '65087ad12c24555677fb58fd'
      const { status, headers, _body } = await requester.get(`/api/products/${pid}`)
                                                  .set('Cookie', jwtCookie)
                                                  .expect( 200 )

      expect(_body.status).to.be.equal('success')
      expect(_body.payload).to.have.property('_id', pid)                                             
    })
    
  })
})