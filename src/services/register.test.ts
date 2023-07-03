import { it, describe, expect } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

describe('Register service', () => {
  it('should be able to register', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(UsersRepository)

    const { user } = await registerService.execute({
      name: 'João predo',
      email: 'joao@predo.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(UsersRepository)

    const { user } = await registerService.execute({
      name: 'João predo',
      email: 'joao@predo.com',
      password: '123456',
    })

    const isHashed = await compare('123456', user.password_hash)

    expect(isHashed).toBe(true)
  })

  it('should not be able to register with the same email twice', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(UsersRepository)

    await registerService.execute({
      name: 'João predo',
      email: 'joao@predo.com',
      password: '123456',
    })

    expect(async () => {
      await registerService.execute({
        name: 'João predo',
        email: 'joao@predo.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
