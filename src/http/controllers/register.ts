import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { registerUseCase } from '../../use-cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const reqBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { name, email, password } = reqBodySchema.parse(request.body)

  try {
    registerUseCase({ name, email, password })
  } catch {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
