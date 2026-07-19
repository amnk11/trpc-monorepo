import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import * as jwt from "jsonwebtoken";
import { randomBytes, createHmac } from "node:crypto";
import {
  type CreateUserWithEmailAndPasswordInputType,
  createUserWithEmailAndPasswordInput,
  type GenerateUserTokenPayloadType,
  generateUserTokenPayload,
  type SignInUserWithEmailAndPasswordInputType,
  signInUserWithEmailAndPasswordInput,
} from "./model";
import { env } from "../env";

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result;
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);
    const token = jwt.sign({ id }, env.JWT_SECRET);
    return { token };
  }

  private async verifyUserToken(token: string): Promise<GenerateUserTokenPayloadType> {
    try {
      const verificationResult = jwt.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType;
      return verificationResult;
    } catch (error) {
      throw new Error(`Invalid Token`);
    }
  }

  private async generateHash(salt: string, password: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  private async getUserInfoById(id: string) {
    const user = await db
      .select({
        id: usersTable.id,
        fullname: usersTable.fullName,
        email: usersTable.email,
        profileImageUrl: usersTable.profileImageUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!user || user.length === 0) throw new Error(`User with Id: ${id} does not exists`);

    return user[0]!;
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUserWithEmail = await this.getUserByEmail(email);
    if (existingUserWithEmail) throw new Error("User with email already user");

    const salt = randomBytes(16).toString("hex");
    const hash = await this.generateHash(salt, password);

    const userInsertResult = await db
      .insert(usersTable)
      .values({ fullName, email, salt, password: hash })
      .returning({
        id: usersTable.id,
      });

    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id)
      throw new Error(`Something went wrong while creating a user`);

    const userID = userInsertResult[0].id;
    const { token } = await this.generateUserToken({ id: userID });

    return {
      id: userID,
      token,
    };
  }

  public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordInputType) {
    const { email, password } = await signInUserWithEmailAndPasswordInput.parseAsync(payload);
    const existingUser = await this.getUserByEmail(email);
    if (!existingUser) throw new Error(`User with email: ${email} does not exists`);
    const [user] = existingUser;
    if (!user?.password || !user.salt) throw new Error(`Invalid authentication method`);

    const hash = await this.generateHash(user.salt, password);

    if (hash !== user.password) throw new Error("Invalid email or password");
    const { token } = await this.generateUserToken({ id: user.id });
    return {
      id: user.id,
      token,
    };
  }

  public async verifyAndDecodeUserToken(token: string) {
    const { id } = await this.verifyUserToken(token);
    const userInfo = await this.getUserInfoById(id);
    return { ...userInfo};
  }
}

export default UserService;
