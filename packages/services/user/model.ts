import { z } from "zod";

export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().describe("Full name of the user"),
  email: z.email().describe("Email adress of the user"),
  password: z.string().describe("Password of the user"),
});

export type CreateUserWithEmailAndPasswordInputType = z.infer<
  typeof createUserWithEmailAndPasswordInput
>;
