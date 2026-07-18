import { useParams, Link, useNavigate } from "react-router-dom";
import { useShow, useList } from "@/hooks/use-api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Department, Subject } from "@/types";

type SubjectDetails = {
  subject: Subject & {
    department?: Department | null;
  };
  totals: {
    classes: number;
  };
};

type SubjectClass = {
  id: number;
  name: string;
  status?: string | null;
  capacity?: number | null;
  teacher?: {
    id: string;
    name: string;
    email?: string | null;
    image?: string | null;
  } | null;
};

type SubjectUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

const SubjectsShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const subjectId = id ?? "";

  // Fetch details of subject
  const { data: detailsData, isLoading: detailsLoading, isError } = useShow<SubjectDetails>("subjects", subjectId);
  const details = detailsData?.data;

  // Fetch classes for this subject
  const { data: classesData, isLoading: classesLoading } = useList<SubjectClass>(
    `subjects/${subjectId}/classes`,
    { limit: 10 }
  );
  const classes = classesData?.data ?? [];

  // Fetch teachers for this subject
  const { data: teachersData, isLoading: teachersLoading } = useList<SubjectUser>(
    `subjects/${subjectId}/users`,
    { role: "teacher", limit: 10 }
  );
  const teachers = teachersData?.data ?? [];

  // Fetch students for this subject
  const { data: studentsData, isLoading: studentsLoading } = useList<SubjectUser>(
    `subjects/${subjectId}/users`,
    { role: "student", limit: 10 }
  );
  const students = studentsData?.data ?? [];

  if (detailsLoading || isError || !details) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          <h1 className="text-2xl font-bold tracking-tight">Subject Details</h1>
        </div>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            {detailsLoading
              ? "Loading subject details..."
              : isError
              ? "Failed to load subject details."
              : "Subject details not found."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          <h1 className="text-2xl font-bold tracking-tight">{details.subject.name}</h1>
        </div>
        <Badge variant="outline" className="w-fit text-sm py-1 px-3">
          {details.subject.code}
        </Badge>
      </div>

      <Separator />

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Subject Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {details.subject.description ?? "No description provided."}
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Department</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {details.subject.department ? (
            <>
              <Link
                to={`/departments/show/${details.subject.department.id}`}
                className="text-lg font-semibold text-primary hover:underline"
              >
                {details.subject.department.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {details.subject.department.description ??
                  "No department description provided."}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Department not assigned.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Classes</CardTitle>
          <Badge>{details.totals?.classes ?? classes.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px] text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classesLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading classes...
                    </TableCell>
                  </TableRow>
                ) : classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No classes for this subject.
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((cls: SubjectClass) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium text-foreground">{cls.name}</TableCell>
                      <TableCell>
                        {cls.teacher ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                              {cls.teacher.image && (
                                <AvatarImage src={cls.teacher.image} alt={cls.teacher.name} />
                              )}
                              <AvatarFallback>{getInitials(cls.teacher.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col truncate">
                              <span className="text-sm">{cls.teacher.name}</span>
                              <span className="text-xs text-muted-foreground">{cls.teacher.email}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={cls.status === "active" ? "default" : "secondary"}>
                          {cls.status ?? "unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/classes/show/${cls.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="w-[100px] text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachersLoading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">
                        Loading teachers...
                      </TableCell>
                    </TableRow>
                  ) : teachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">
                        No teachers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    teachers.map((t: SubjectUser) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                              {t.image && <AvatarImage src={t.image} alt={t.name} />}
                              <AvatarFallback>{getInitials(t.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{t.name}</span>
                              <span className="text-xs text-muted-foreground">{t.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/faculty/show/${t.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="w-[100px] text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsLoading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">
                        Loading students...
                      </TableCell>
                    </TableRow>
                  ) : students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">
                        No students found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((s: SubjectUser) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                              {s.image && <AvatarImage src={s.image} alt={s.name} />}
                              <AvatarFallback>{getInitials(s.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{s.name}</span>
                              <span className="text-xs text-muted-foreground">{s.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/faculty/show/${s.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${
    parts[parts.length - 1][0] ?? ""
  }`.toUpperCase();
};

export default SubjectsShow;
