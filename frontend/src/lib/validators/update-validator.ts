import { z } from "zod";

export const UpdateCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long.',
  }),
  name: z.string().min(2, {
	message: 'Name must be at least 2 characters long.',
  }).regex(/^[A-Za-z]+$/, {
	message: 'Name must contain only letters.',
  }),
  
 
});

export type TUpdateCredentialsValidator = z.infer<
  typeof UpdateCredentialsValidator
>;
