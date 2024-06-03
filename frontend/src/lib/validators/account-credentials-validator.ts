import { z } from "zod"

export const AuthCredentialsValidator = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters long.',
  }).regex(/^[A-Za-z]+$/, {
    message: 'Name must contain only letters.',
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long.',
  }),
  password_confirm: z.string().min(6, {
    message: 'Confirm password must be at least 6 characters long.',
  })
})

export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>
