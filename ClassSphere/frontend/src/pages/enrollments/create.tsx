import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useCreate, useList } from "@/hooks/use-api";
import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
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
import type { ClassDetails } from "@/types";

const enrollSchema = z.object({
  classId: z.coerce.number().min(1, "Class is required"),
});

type EnrollFormValues = z.infer<typeof enrollSchema>;

const EnrollmentsCreate = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { mutateAsync: createEnrollment, isPending } = useCreate("enrollments");

  const { data: classesQuery } = useList<ClassDetails>("classes", { limit: 100 });
  const classes = classesQuery?.data ?? [];
  const classesLoading = !classesQuery;

  const form = useForm<EnrollFormValues>({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      classId: 0,
    },
  });

  const selectedClassId = form.watch("classId");

  const onSubmit = async (values: EnrollFormValues) => {
    if (!currentUser?.id) return;

    try {
      const response = await createEnrollment({
        classId: values.classId,
        studentId: currentUser.id,
      });

      navigate("/enrollments/confirm", {
        state: {
          enrollment: response?.data || response, // handle raw response or response.data wrapping
        },
      });
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  const isSubmitDisabled =
    isPending ||
    classesLoading ||
    !currentUser?.id ||
    !classes.length ||
    !selectedClassId;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enroll in a Class</h1>
        <p className="text-muted-foreground">
          Select a class to enroll as the current user.
        </p>
      </div>

      <Separator />

      <div className="my-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Enrollment Form
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="mt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class <span className="text-orange-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? String(field.value) : ""}
                        disabled={classesLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((classItem: ClassDetails) => (
                            <SelectItem
                              key={classItem.id}
                              value={String(classItem.id)}
                            >
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <FormControl>
                    <Input
                      value={currentUser?.email ?? "Not signed in"}
                      readOnly
                    />
                  </FormControl>
                </FormItem>

                <Button type="submit" size="lg" disabled={isSubmitDisabled}>
                  {isPending ? "Enrolling..." : "Enroll"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnrollmentsCreate;
