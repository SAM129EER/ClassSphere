import { useParams, Link, useNavigate } from "react-router-dom";
import { useShow, useList } from "@/hooks/use-api";
import { BookOpen, Layers, Users } from "lucide-react";
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
import type { Department } from "@/types";

type DepartmentDetails = {
  department: Department & {
    code?: string | null;
  };
  totals: {
    subjects: number;
    classes: number;
    enrolledStudents: number;
  };
};

type DepartmentSubject = {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
};

type DepartmentClass = {
  id: number;
  name: string;
  status?: string | null;
  capacity?: number | null;
  subject?: {
    id: number;
    name: string;
    code?: string | null;
  } | null;
  teacher?: {
    id: string;
    name: string;
    email?: string | null;
    image?: string | null;
  } | null;
};

type DepartmentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

const DepartmentShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const departmentId = id ?? "";

  // Fetch department overview details
  const { data: detailsData, isLoading: detailsLoading, isError } = useShow<DepartmentDetails>("departments", departmentId);
  const details = detailsData?.data;

  // Fetch subjects of this department
  const { data: subjectsData, isLoading: subjectsLoading } = useList<DepartmentSubject>(
    `departments/${departmentId}/subjects`,
    { limit: 10 }
  );
  const subjects = subjectsData?.data ?? [];

  // Fetch classes of this department
  const { data: classesData, isLoading: classesLoading } = useList<DepartmentClass>(
    `departments/${departmentId}/classes`,
    { limit: 10 }
  );
  const classes = classesData?.data ?? [];

  // Fetch teachers
  const { data: teachersData, isLoading: teachersLoading } = useList<DepartmentUser>(
    `departments/${departmentId}/users`,
    { role: "teacher", limit: 10 }
  );
  const teachers = teachersData?.data ?? [];

  // Fetch students
  const { data: studentsData, isLoading: studentsLoading } = useList<DepartmentUser>(
    `departments/${departmentId}/users`,
    { role: "student", limit: 10 }
  );
  const students = studentsData?.data ?? [];

  if (detailsLoading || isError || !details) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          <h1 className="text-2xl font-bold tracking-tight">Department Details</h1>
        </div>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            {detailsLoading
              ? "Loading department details..."
              : isError
              ? "Failed to load department details."
              : "Department details not found."}
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
          <h1 className="text-2xl font-bold tracking-tight">{details.department.name}</h1>
        </div>
        {details.department.code && (
          <Badge variant="outline" className="w-fit text-sm py-1 px-3">
            {details.department.code}
          </Badge>
        )}
      </div>

      <Separator />

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {details.department.description ?? "No description provided."}
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Total Subjects</span>
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {details.totals?.subjects ?? subjects.length}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Total Classes</span>
                <Layers className="h-4 w-4" />
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {details.totals?.classes ?? classes.length}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Enrolled Students</span>
                <Users className="h-4 w-4" />
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {details.totals?.enrolledStudents ?? students.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subjects</CardTitle>
          <Badge>{details.totals?.subjects ?? subjects.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Code</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-[100px] text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectsLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading subjects...
                    </TableCell>
                  </TableRow>
                ) : subjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No subjects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  subjects.map((sub: DepartmentSubject) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        {sub.code ? <Badge>{sub.code}</Badge> : <span className="text-muted-foreground">No code</span>}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{sub.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                        {sub.description ?? "No description"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/subjects/show/${sub.id}`}>View</Link>
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
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px] text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classesLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading classes...
                    </TableCell>
                  </TableRow>
                ) : classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No classes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((cls: DepartmentClass) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium text-foreground">{cls.name}</TableCell>
                      <TableCell>
                        {cls.subject ? (
                          <span className="truncate">
                            {cls.subject.name}
                            {cls.subject.code ? ` (${cls.subject.code})` : ""}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">No subject</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {cls.teacher ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                              {cls.teacher.image && <AvatarImage src={cls.teacher.image} alt={cls.teacher.name} />}
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
                    teachers.map((t: DepartmentUser) => (
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
                    students.map((s: DepartmentUser) => (
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

export default DepartmentShow;
