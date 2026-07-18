import { useQuery, useMutation, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ListResponse, GetOneResponse } from "@/types";

// Hook to fetch a list of items
export function useList<T = any>(
  resource: string, 
  params?: Record<string, any>
): UseQueryResult<ListResponse<T>, Error> {
  return useQuery<ListResponse<T>, Error>({
    queryKey: [resource, params],
    queryFn: async () => {
      const response = await apiClient.get(resource, params);
      return response; // Expecting structure: { data: T[], pagination?: { total: number } }
    },
  });
}

// Hook to fetch a single item's details
export function useShow<T = any>(
  resource: string, 
  id: string | number | undefined
): UseQueryResult<GetOneResponse<T>, Error> {
  return useQuery<GetOneResponse<T>, Error>({
    queryKey: [resource, id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const response = await apiClient.get(`${resource}/${id}`);
      return response; // Expecting structure: { data: T }
    },
    enabled: !!id,
  });
}

// Hook to create a new item
export function useCreate<TVariables = any, TData = any>(resource: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.post(resource, variables);
      return response as TData;
    },
    onSuccess: () => {
      // Invalidate queries for this resource to trigger auto refetch
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
}

// Hook to delete an item
export function useDelete(resource: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await apiClient.delete(`${resource}/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
}
