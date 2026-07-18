import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";

// Import pages
import Dashboard from "./pages/dashboard";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import SubjectsList from "./pages/subjects/list";
import SubjectsCreate from "./pages/subjects/create";
import SubjectsShow from "./pages/subjects/show";
import DepartmentsList from "./pages/departments/list";
import DepartmentsCreate from "./pages/departments/create";
import DepartmentShow from "./pages/departments/show";
import FacultyList from "./pages/faculty/list";
import FacultyShow from "./pages/faculty/show";
import EnrollmentsCreate from "./pages/enrollments/create";
import EnrollmentsJoin from "./pages/enrollments/join";
import EnrollmentConfirm from "./pages/enrollments/confirm";
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import ClassesShow from "./pages/classes/show";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes (only accessible if logged out) */}
            <Route element={<ProtectedRoute isPublicOnly={true} />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Private Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />

                <Route path="subjects">
                  <Route index element={<SubjectsList />} />
                  <Route path="create" element={<SubjectsCreate />} />
                  <Route path="show/:id" element={<SubjectsShow />} />
                </Route>

                <Route path="departments">
                  <Route index element={<DepartmentsList />} />
                  <Route path="create" element={<DepartmentsCreate />} />
                  <Route path="show/:id" element={<DepartmentShow />} />
                </Route>

                <Route path="faculty">
                  <Route index element={<FacultyList />} />
                  <Route path="show/:id" element={<FacultyShow />} />
                </Route>

                <Route path="enrollments">
                  <Route path="create" element={<EnrollmentsCreate />} />
                  <Route path="join" element={<EnrollmentsJoin />} />
                  <Route path="confirm" element={<EnrollmentConfirm />} />
                </Route>

                <Route path="classes">
                  <Route index element={<ClassesList />} />
                  <Route path="create" element={<ClassesCreate />} />
                  <Route path="show/:id" element={<ClassesShow />} />
                </Route>
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
