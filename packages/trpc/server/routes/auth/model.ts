import { z } from "zod";

export const createUserWithEmailAndPasswordInputModel = z.object({
  fullName: z.string().describe("name of the user"),
  email: z.email().describe("email of the user"),
  password: z.string().describe("password of the user"),
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("Id of user is created"),
});

export const signInUserWithEmailAndPasswordInputModel = z.object({
  email: z.string().describe("Email of the user"),
  password: z.string().describe("password of the user"),
});

export const signInUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("Id of the user"),
});
