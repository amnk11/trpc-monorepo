"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { useCreateForm } from "~/hooks/api/form";

type CreateFormValues = {
  title: string;
  description: string;
};

export default function FormsPage() {
  const [open, setOpen] = useState(false);
  const { createFormAsync, isError, error } = useCreateForm();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateFormValues>({
    defaultValues: { title: "", description: "" },
  });

  const onSubmit: SubmitHandler<CreateFormValues> = async (values) => {
    await createFormAsync({
      title: values.title,
      description: values.description || undefined,
    });
    reset();
    setOpen(false);
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Forms</h1>
        <Button onClick={() => setOpen(true)}>Create Form</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new form</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="e.g. Customer Feedback"
                  {...register("title", { required: true, maxLength: 55 })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="What is this form for? (optional)"
                  {...register("description", { maxLength: 300 })}
                />
              </Field>
              {isError && <p className="text-sm text-destructive">{error?.message}</p>}
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Form"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
