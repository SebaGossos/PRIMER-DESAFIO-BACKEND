import supertest from 'supertest'
import { expect } from 'chai'


const requester = supertest('http://localhost:8080')


describe('Testing Carts', () => {
  describe(' /api/carts', () => {

    let jwtCookie;
  
    before( async() => {
      const response = await requester.post('/api/auth/login')
            .send({ email: 'test@api.com', password: 'a' }).expect(302)

      jwtCookie = response.header['set-cookie'].find(cookie => {
        return cookie.startsWith('jwt-coder')
      })

    })
    
    it('Endpoint /api/products should receive an array of carts', async () => {
      const { status, headers , _body } = await requester.get('/api/carts')
                                                  .set('Cookie', jwtCookie)
                                                  .expect(200)

      expect(_body.status).to.be.equal('success')
      expect(_body.success).to.be.an('array');

    })

    it('Endpoint  /api/carts/:cid should receive a cart', async () => {
      const cid = '653ba14551f65a1fbea18803'
      const { status, headers, _body } = await requester.get(`/api/carts/${cid}`)
                                                  .set('Cookie', jwtCookie)
                                                  .expect( 200 )

      expect(_body.status).to.be.equal('success')
      expect(_body.payload).to.have.property('_id', cid)                                             
    })

    it('Endpoint  /api/carts/:cid/product/:pid should add a product to cart', async () => {
      const cid = '653d39772b7cacd31376fb6d'
      const pid = '65087ad12c24555677fb58fd'
      const { status, headers, _body } = await requester.post(`/api/carts/${cid}/product/${pid}`)
                                                  .set('Cookie', jwtCookie)
                                                  .expect( 200 )


      expect(_body.status).to.be.equal('success')
      expect(_body.payload).to.have.property('_id', cid)                                             
    })
    
  })
})