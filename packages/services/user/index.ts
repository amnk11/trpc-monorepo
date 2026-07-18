import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import { randomBytes, createHmac } from "node:crypto";
import {
  type CreateUserWithEmailAndPasswordInputType,
  createUserWithEmailAndPasswordInput,
} from "./model";

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result;
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUserWithEmail = await this.getUserByEmail(email);
    if (existingUserWithEmail) throw new Error("User with email already user");

    const salt = randomBytes(16).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    const userInsertResult = await db
      .insert(usersTable)
      .values({ fullName, email, salt, password: hash })
      .returning({
        id: usersTable.id,
      });

    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id)
      throw new Error(`Something went wrong while creating a user`);

    return {
      id: userInsertResult[0]?.id,
    };
  }
}

export default UserService;
