import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { InvalidCredentials } from './errors/invalid-credentials'
import { compare } from 'bcryptjs'

interface AuthenticateServiceRequest {
  email: string
  password: string
}
interface AuthenticateServiceReply {
  user: User
}

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceReply> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentials()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentials()
    }

    return {
      user,
    }
  }
}
