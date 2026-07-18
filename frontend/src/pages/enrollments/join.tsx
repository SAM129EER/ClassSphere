import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useCreate } from "@/hooks/use-api";
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
import { toast } from "sonner";

const joinSchema = z.object({
  inviteCode: z.string().min(3, "Invite code is required"),
});

type JoinFormValues = z.infer<typeof joinSchema>;

const EnrollmentsJoin = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { mutateAsync: joinEnrollment, isPending } = useCreate("enrollments/join");

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  const inviteCode = form.watch("inviteCode");

  const onSubmit = async (values: JoinFormValues) => {
    if (!currentUser?.id) return;

    try {
      const response = await joinEnrollment({
        inviteCode: values.inviteCode,
        studentId: currentUser.id,
      });

      toast.success("Joined class successfully!", { richColors: true });

      navigate("/enrollments/confirm", {
        state: {
          enrollment: response?.data || response,
        },
      });
    } catch (err: any) {
      console.error("Join enrollment failed:", err);
      toast.error(err.message || "Failed to join class. Please check your invite code.", { richColors: true });
    }
  };

  const isSubmitDisabled = isPending || !currentUser?.id || !inviteCode;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Join by Invite Code</h1>
        <p className="text-muted-foreground">
          Enter the invite code provided by your instructor.
        </p>
      </div>

      <Separator />

      <div className="my-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Join Class
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
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Invite Code <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter invite code" {...field} />
                      </FormControl>
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
                  {isPending ? "Joining..." : "Join Class"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnrollmentsJoin;
