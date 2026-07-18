import { useState } from "react";
import { Link } from "react-router-dom";
import { useList } from "@/hooks/use-api";
import { Search, Plus } from "lucide-react";
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

type DepartmentListItem = {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  totalSubjects?: number | null;
};

const DepartmentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch departments list
  const { data, isLoading } = useList<DepartmentListItem>("departments", {
    page,
    limit,
    search: searchQuery,
  });

  const departments = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground">
          Quick access to essential metrics and management tools.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or code..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <Button asChild>
          <Link to="/departments/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Department</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-[100px] text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><div className="h-6 w-16 animate-pulse rounded bg-muted" /></TableCell>
                      <TableCell><div className="h-6 w-32 animate-pulse rounded bg-muted" /></TableCell>
                      <TableCell><div className="h-6 w-16 animate-pulse rounded bg-muted" /></TableCell>
                      <TableCell className="hidden md:table-cell"><div className="h-6 w-48 animate-pulse rounded bg-muted" /></TableCell>
                      <TableCell className="text-right"><div className="ml-auto h-8 w-16 animate-pulse rounded bg-muted" /></TableCell>
                    </TableRow>
                  ))
                ) : departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No departments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  departments.map((dept: DepartmentListItem) => (
                    <TableRow key={dept.id}>
                      <TableCell>
                        {dept.code ? (
                          <Badge>{dept.code}</Badge>
                        ) : (
                          <span className="text-muted-foreground">No code</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {dept.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{dept.totalSubjects ?? 0}</Badge>
                      </TableCell>
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

      {!isLoading && departments.length > 0 && (
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

export default DepartmentsList;
