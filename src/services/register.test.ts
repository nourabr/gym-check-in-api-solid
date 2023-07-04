import { it, describe, expect, beforeEach } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register service', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: RegisterService

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'João predo',
      email: 'joao@predo.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'João predo',
      email: 'joao@predo.com',
      password: '123456',
    })

    const isHashed = await compare('123456', user.password_hash)

    expect(isHashed).toBe(true)
  })

  it('should not be able to register with the same email twice', async () => {
    await sut.execute({
      name: 'João predo',
      email: 'joao@predo.com',
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        name: 'João predo',
        email: 'joao@predo.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
