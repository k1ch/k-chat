import sinon from 'sinon';
import { expect, assert } from 'chai'
import { ConnectionManager, Repository, Connection } from 'typeorm';
import jwt from 'jsonwebtoken'

import { AuthService } from './auth.service';
import { Utils } from '../utils';
import { UserService } from './user.service';
import { User } from '../models/user.model';


describe('Auth service unit tests:', () => {
  const sandbox = sinon.createSandbox()
  beforeEach(() => {
    sandbox.stub(ConnectionManager.prototype, 'get').returns({
      getRepository: sandbox.stub().returns(sinon.createStubInstance(Repository))
    } as unknown as Connection)
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('login() with valid username password ', async () => {
    const args = {
      username: 'k1ch',
      password: '123456'
    }
    const accessToken = 'fakeAccessToken'
    const user = {
      id: '1',
      username: 'k1ch',
      salt: 'salt',
      password_hash: 'scrypt',
      created_at: '',
      updated_at: ''
    } as unknown as User
    sandbox.stub(UserService.prototype, 'getByUsername').withArgs(args.username).resolves(user);
    sandbox.stub(Utils, 'deriveKeyFromPassword').withArgs(args.password, user.salt, user.salt.length).returns(user.password_hash)
    sandbox.stub(AuthService.prototype, 'generateAccessToken').withArgs(user.id, {}).returns(accessToken)

    const res = await new AuthService().login(args.username, args.password)
    expect(res.id).to.equal(user.id)
    expect(res.token).to.equal(accessToken)
  })

  it('login() with wrong password. Should get AUTH04 error code', async () => {
    const args = {
      username: 'k1ch',
      password: 'wrong_password'
    }

    const user = {
      id: '1',
      username: 'k1ch',
      salt: 'salt',
      password: 'scrypt',
      created_at: '',
      updated_at: ''
    } as unknown as User
    sandbox.stub(UserService.prototype, 'getByUsername').withArgs(args.username).resolves(user);
    sandbox.stub(Utils, 'deriveKeyFromPassword').withArgs(args.password, user.salt, user.salt.length).returns('wrong Derived key')
    try {
      await new AuthService().login(args.username, args.password)
    } catch (err) {
      expect(err.code).to.equal('AUTH04')
    }
  })

  it('generateAccessToken() checks arguments', async () => {
    const args = {
      subject: 33,
      payload: {}
    }
    const signStub = sandbox.stub(jwt, 'sign')
    sandbox.stub(Utils, 'getConfig').returns('2h')
    
    await new AuthService().generateAccessToken(args.subject, args.payload)

    const signArgs = signStub.args[0]
    assert(signStub.calledOnce)
    expect(typeof signArgs[0]).to.be.equal('object')
    expect(signArgs[2]['subject']).to.be.equal(args.subject.toString())
  })

  it('generateAccessToken() should throw error AUTH05 since fails to get config', async () => {
    const args = {
      subject: 33,
      payload: {}
    }
    sandbox.stub(Utils, 'getConfig').returns(undefined)
    
    try {
      await new AuthService().generateAccessToken(args.subject, args.payload)
      assert(false) // Should not reach to this line
    } catch (err) {
      assert(err.code === 'AUTH05')
    }
  })

  it('isTokenValid() checks arguments', async () => {
    const args = {
      token: 'fake-token' 
    }
    const verifyStub = sandbox.stub(jwt, 'verify')
    sandbox.stub(Utils, 'getConfig').returns('fake-config')
    
    await new AuthService().isTokenValid(args.token)

    const verifyArgs = verifyStub.args[0]
    assert(verifyStub.calledOnce)
    expect(verifyArgs[0]).to.be.equal(args.token)
  })

  it('isTokenValid() should throw out error AUTH03', async () => {
    const args = {
      token: 'fake-token' 
    }
    sandbox.stub(Utils, 'getConfig').returns(undefined)    
    try {
      await new AuthService().isTokenValid(args.token)
      assert(false) // Should not reach to this line
    } catch (err) {
      assert(err.code === 'AUTH03')
    }
  })
})