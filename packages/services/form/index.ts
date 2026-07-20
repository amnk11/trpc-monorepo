import { db, eq, asc } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldTable } from "@repo/database/models/form-field";
import {
  type CreateFormInputType,
  createFormInput,
  type ListFormsByUserIdInputType,
  listFormsByUserIdInput,
  type GetFormByIdInputType,
  getFormByIdInput,
} from "./model";

class FormService {
  public async createForm(payload: CreateFormInputType) {
    const { title, description, createdBy } = await createFormInput.parseAsync(payload);

    const result = await db.insert(formsTable).values({ title, description, createdBy }).returning({
      id: formsTable.id,
    });

    if (!result || result.length === 0 || !result[0]?.id)
      throw new Error(`Something went wrong while creating the form`);

    return { id: result[0].id };
  }

  public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
    const { userId } = await listFormsByUserIdInput.parseAsync(payload);

    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId));

    return forms;
  }

  public async getFormById(payload: GetFormByIdInputType) {
    const { formId } = await getFormByIdInput.parseAsync(payload);

    const rows = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
        field: {
          id: formFieldTable.id,
          label: formFieldTable.label,
          labelKey: formFieldTable.labelKey,
          type: formFieldTable.type,
          description: formFieldTable.description,
          placeholder: formFieldTable.placeholder,
          isRequired: formFieldTable.isRequired,
          index: formFieldTable.index,
        },
      })
      .from(formsTable)
      .leftJoin(formFieldTable, eq(formFieldTable.formId, formsTable.id))
      .where(eq(formsTable.id, formId))
      .orderBy(asc(formFieldTable.index));

    if (rows.length === 0) return null;

    const { id, title, description, createdAt, updatedAt } = rows[0]!;
    const fields = rows
      .filter((r) => r.field?.id !== null)
      .map((r) => r.field as NonNullable<typeof r.field>);

    return { id, title, description, createdAt, updatedAt, fields };
  }
}

export default FormService;
