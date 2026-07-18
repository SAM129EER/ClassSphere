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
import type { User } from "@/types";

type FacultyDepartment = {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
};

type FacultySubject = {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  department?: {
    id: number;
    name: string;
    code?: string | null;
  } | null;
};

const FacultyShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = id ?? "";

  // Fetch faculty user profile details
  const { data: userData, isLoading: userLoading, isError } = useShow<User>("users", userId);
  const user = userData?.data;

  // Fetch departments tied to this user
  const { data: deptsData, isLoading: deptsLoading } = useList<FacultyDepartment>(
    `users/${userId}/departments`,
    { limit: 10 }
  );
  const departments = deptsData?.data ?? [];

  // Fetch subjects associated with this user
  const { data: subsData, isLoading: subsLoading } = useList<FacultySubject>(
    `users/${userId}/subjects`,
    { limit: 10 }
  );
  const subjects = subsData?.data ?? [];

  if (userLoading || isError || !user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          <h1 className="text-2xl font-bold tracking-tight">Faculty Details</h1>
        </div>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            {userLoading
              ? "Loading faculty details..."
              : isError
              ? "Failed to load faculty details."
              : "Faculty details not found."}
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
          <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
        </div>
        <Badge variant="outline" className="w-fit text-sm py-1 px-3">
          {user.role}
        </Badge>
      </div>

      <Separator />

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.department && (
                <Badge variant="secondary" className="mt-2">
                  {user.department}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Departments tied to {user.name} based on classes and enrollments.
          </p>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Code</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-[100px] text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deptsLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading departments...
                    </TableCell>
                  </TableRow>
                ) : departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No departments associated.
                    </TableCell>
                  </TableRow>
                ) : (
                  departments.map((dept: FacultyDepartment) => (
                    <TableRow key={dept.id}>
                      <TableCell>
                        {dept.code ? <Badge>{dept.code}</Badge> : <span className="text-muted-foreground">No code</span>}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{dept.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                        {dept.description ?? "No description"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/departments/show/${dept.id}`}>View</Link>
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
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Subjects associated with {user.name} in this term.
          </p>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Code</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="w-[100px] text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subsLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading subjects...
                    </TableCell>
                  </TableRow>
                ) : subjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No subjects associated.
                    </TableCell>
                  </TableRow>
                ) : (
                  subjects.map((sub: FacultySubject) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        {sub.code ? <Badge>{sub.code}</Badge> : <span className="text-muted-foreground">No code</span>}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{sub.name}</TableCell>
                      <TableCell>
                        {sub.department ? (
                          <Badge variant="secondary">{sub.department.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
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

export default FacultyShow;
