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

export const getLoggedInUserInfoInputModel = z.undefined();

export const getLoggedInUserInfoOutPutModel = z.object({
  id: z.string().describe("user id of the user"),
  fullname: z.string().describe("Full name of the user"),
  email: z.email().describe("email of the user"),
  profileImageUrl: z.string().describe("profile image url of the user").optional().nullable(),
});
