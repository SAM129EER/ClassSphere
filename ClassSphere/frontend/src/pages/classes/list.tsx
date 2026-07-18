import { useState } from "react";
import { Link } from "react-router-dom";
import { useList } from "@/hooks/use-api";
import { Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import type { Subject, User } from "@/types";

type ClassListItem = {
  id: number;
  name: string;
  status: "active" | "inactive";
  bannerUrl?: string;
  subject?: {
    name: string;
  };
  teacher?: {
    name: string;
  };
  capacity: number;
};

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch subjects for filtering options
  const { data: subjectsData } = useList<Subject>("subjects", { limit: 100 });
  const subjects = subjectsData?.data || [];

  // Fetch teachers for filtering options
  const { data: teachersData } = useList<User>("users", { role: "teacher", limit: 100 });
  const teachers = teachersData?.data || [];

  // Fetch classes list with current page, search, and filters
  const { data: classesData, isLoading } = useList<ClassListItem>("classes", {
    page,
    limit,
    search: searchQuery,
    subject: selectedSubject,
    teacher: selectedTeacher,
  });

  const classes = classesData?.data ?? [];
  const pagination = classesData?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSubjectChange = (val: string) => {
    setSelectedSubject(val);
    setPage(1);
  };

  const handleTeacherChange = (val: string) => {
    setSelectedTeacher(val);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
        <p className="text-muted-foreground">
          Quick access to essential metrics and management tools.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedSubject} onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject: Subject) => (
                <SelectItem key={subject.id} value={subject.name}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTeacher} onValueChange={handleTeacherChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teachers</SelectItem>
              {teachers.map((teacher: User) => (
                <SelectItem key={teacher.id} value={teacher.name}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button asChild>
            <Link to="/classes/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Class</span>
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Banner</TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead className="w-[100px] text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><div className="h-10 w-10 animate-pulse rounded bg-muted" /></TableCell>
                      <TableCell><div className="h-6 w-32 animate-pulse rounded bg-muted" /></TableCell>
                      <TableCell><div className="h-6 w-16 animate-pulse rounded bg-muted" /></TableCell>
                      <TableCell><div className="h-6 w-24 animate-pulse rounded bg-muted" /></TableCell>
                      <TableCell><div className="h-6 w-24 animate-pulse rounded bg-muted" /></TableCell>
                      <TableCell><div className="h-6 w-12 animate-pulse rounded bg-muted" /></TableCell>
                      <TableCell className="text-right"><div className="ml-auto h-8 w-16 animate-pulse rounded bg-muted" /></TableCell>
                    </TableRow>
                  ))
                ) : classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No classes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((cls: ClassListItem) => (
                    <TableRow key={cls.id}>
                      <TableCell>
                        {cls.bannerUrl ? (
                          <img
                            src={cls.bannerUrl}
                            alt={cls.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">No image</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {cls.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={cls.status === "active" ? "default" : "secondary"}>
                          {cls.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {cls.subject ? (
                          <Badge variant="secondary">{cls.subject.name}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {cls.teacher?.name ?? <span className="text-xs text-muted-foreground">Not assigned</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cls.capacity}
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

      {!isLoading && classes.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((old) => (old < totalPages ? old + 1 : old))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClassesList;
