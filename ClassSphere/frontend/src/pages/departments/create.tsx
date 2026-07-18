import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { useCreate } from "@/hooks/use-api";
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

const departmentSchema = z.object({
  code: z.string().min(2, "Department code must be at least 2 characters"),
  name: z.string().min(3, "Department name must be at least 3 characters"),
  description: z
    .string()
    .min(5, "Department description must be at least 5 characters"),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

const DepartmentsCreate = () => {
  const navigate = useNavigate();
  const { mutateAsync: createDepartment, isPending } = useCreate("departments");

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      await createDepartment(values);
      toast.success("Department created successfully!", { richColors: true });
      navigate("/departments");
    } catch (error: any) {
      console.error("Error creating department:", error);
      toast.error(error.message || "Failed to create department", { richColors: true });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create a Department</h1>
        <p className="text-muted-foreground">
          Provide the required information below to add a department.
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
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Department Code <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="CS" {...field} />
                      </FormControl>
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
                        Department Name <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} />
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
                          placeholder="Describe the department focus..."
                          className="min-h-28"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Department"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentsCreate;
