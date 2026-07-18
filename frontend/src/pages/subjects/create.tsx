import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { useList, useCreate } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Department } from "@/types";

const subjectCreateSchema = z.object({
  departmentId: z.coerce
    .number({
      required_error: "Department is required",
      invalid_type_error: "Department is required",
    })
    .min(1, "Department is required"),
  name: z.string().min(3, "Subject name must be at least 3 characters"),
  code: z.string().min(3, "Subject code must be at least 3 characters"),
  description: z
    .string()
    .min(5, "Subject description must be at least 5 characters"),
});

type SubjectFormValues = z.infer<typeof subjectCreateSchema>;

const SubjectsCreate = () => {
  const navigate = useNavigate();
  const { mutateAsync: createSubject, isPending } = useCreate("subjects");

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectCreateSchema),
    defaultValues: {
      departmentId: 0,
      name: "",
      code: "",
      description: "",
    },
  });

  const { data: departmentsQuery } = useList<Department>("departments", { limit: 100 });
  const departments = departmentsQuery?.data ?? [];
  const departmentsLoading = !departmentsQuery;

  const onSubmit = async (values: SubjectFormValues) => {
    try {
      await createSubject(values);
      toast.success("Subject created successfully!", { richColors: true });
      navigate("/subjects");
    } catch (error: any) {
      console.error("Error creating subject:", error);
      toast.error(error.message || "Failed to create subject", { richColors: true });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create a Subject</h1>
        <p className="text-muted-foreground">
          Provide the required information below to add a subject.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Fill out form
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="mt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Department <span className="text-orange-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(Number(value))
                        }
                        value={field.value ? String(field.value) : ""}
                        disabled={departmentsLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((department: Department) => (
                            <SelectItem
                              key={department.id}
                              value={String(department.id)}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subject Name <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Intro to Programming" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subject Code <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="CS101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the subject focus..."
                          className="min-h-28"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Subject"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubjectsCreate;
