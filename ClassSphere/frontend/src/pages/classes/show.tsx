import { useParams, Link, useNavigate } from "react-router-dom";
import { useShow, useList } from "@/hooks/use-api";
import { AdvancedImage } from "@cloudinary/react";
import { toast } from "sonner";
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
import { bannerPhoto } from "@/lib/cloudinary";
import { ClassDetails } from "@/types";

type ClassUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

const ClassesShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const classId = id ?? "";

  // Fetch class overview details
  const { data: detailsData, isLoading: detailsLoading, isError } = useShow<ClassDetails>("classes", classId);
  const classDetails = detailsData?.data;

  // Fetch enrolled students list
  const { data: studentsData, isLoading: studentsLoading } = useList<ClassUser>(
    `classes/${classId}/users`,
    { role: "student", limit: 10 }
  );
  const students = studentsData?.data ?? [];

  if (detailsLoading || isError || !classDetails) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          <h1 className="text-2xl font-bold tracking-tight">Class Details</h1>
        </div>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            {detailsLoading
              ? "Loading class details..."
              : isError
              ? "Failed to load class details."
              : "Class details not found."}
          </p>
        </Card>
      </div>
    );
  }

  const teacherName = classDetails.teacher?.name ?? "Unknown";
  const teacherInitials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join("");

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teacherInitials || "NA"
  )}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          <h1 className="text-2xl font-bold tracking-tight">Class Details</h1>
        </div>
      </div>

      <Separator />

      <div className="rounded-lg overflow-hidden border bg-muted/40 aspect-video md:aspect-[3/1] relative">
        {classDetails.bannerUrl ? (
          classDetails.bannerUrl.includes("res.cloudinary.com") &&
          classDetails.bannerCldPubId ? (
            <AdvancedImage
              cldImg={bannerPhoto(
                classDetails.bannerCldPubId ?? "",
                classDetails.name
              )}
              alt="Class Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={classDetails.bannerUrl}
              alt={classDetails.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-orange-400 to-rose-400" />
        )}
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{classDetails.name}</h1>
              <p className="text-muted-foreground mt-2">{classDetails.description}</p>
            </div>

            <div className="flex gap-2">
              <Badge variant="outline" className="text-sm py-1 px-3">
                {classDetails.capacity} spots
              </Badge>
              <Badge
                variant={classDetails.status === "active" ? "default" : "secondary"}
                className="text-sm py-1 px-3 uppercase"
              >
                {classDetails.status}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">👨‍🏫 Instructor</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {classDetails.teacher?.image && <AvatarImage src={classDetails.teacher.image} />}
                  <AvatarFallback>{teacherInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{teacherName}</p>
                  <p className="text-sm text-muted-foreground">{classDetails.teacher?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">🏛️ Department</h3>
              {classDetails.department ? (
                <div>
                  <p className="font-semibold text-foreground">{classDetails.department.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{classDetails.department.description}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Department not assigned.</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">📚 Subject</h3>
            <div className="space-y-2">
              <Badge variant="outline">
                Code: {classDetails.subject?.code}
              </Badge>
              <p className="font-semibold text-foreground">{classDetails.subject?.name}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {classDetails.subject?.description}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-dashed">
            <h3 className="text-lg font-bold text-foreground">🎓 Join Class</h3>
            {classDetails.inviteCode && (
              <div className="p-3 bg-primary/5 rounded border border-primary/20 flex justify-between items-center my-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Invite Code</p>
                  <code className="text-base font-extrabold text-primary">{classDetails.inviteCode}</code>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(classDetails.inviteCode ?? "");
                    toast.success("Invite code copied!", { richColors: true });
                  }}
                >
                  Copy Code
                </Button>
              </div>
            )}
            <ol className="list-decimal pl-4 space-y-1 text-sm text-muted-foreground">
              <li>Ask your teacher for the invite code.</li>
              <li>Click on &quot;Join Class&quot; button below.</li>
              <li>Paste the code and click &quot;Join&quot;.</li>
            </ol>
            <Button asChild className="w-full mt-4" size="lg">
              <Link to="/enrollments/join">Join Class</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students</CardTitle>
          <Badge variant="secondary">{students.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
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
                      No students enrolled in this class.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student: ClassUser) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            {student.image && <AvatarImage src={student.image} alt={student.name} />}
                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{student.name}</span>
                            <span className="text-xs text-muted-foreground">{student.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/faculty/show/${student.id}`}>View</Link>
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

export default ClassesShow;
