import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RegisterService } from '@/services/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const reqBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { name, email, password } = reqBodySchema.parse(request.body)

  try {
    
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterService(prismaUsersRepository)

    await registerUseCase.execute({
      name,
      email,
      password,
    })

  } catch (err) {

    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    } 

    return reply.status(500).send() // TODO: Fix me

  }

  return reply.status(201).send()
}
