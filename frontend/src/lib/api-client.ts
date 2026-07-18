import { BACKEND_BASE_URL } from "@/constants";

export const apiClient = {
  async get(endpoint: string, params?: Record<string, any>) {
    let url = `${BACKEND_BASE_URL}/api/${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && value !== "all") {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText} (${response.status})`);
    }

    return response.json();
  },

  async post(endpoint: string, body: any) {
    const url = `${BACKEND_BASE_URL}/api/${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(
        errorJson.error || 
        errorJson.message || 
        `API Error: ${response.statusText} (${response.status})`
      );
    }

    return response.json();
  },

  async delete(endpoint: string) {
    const url = `${BACKEND_BASE_URL}/api/${endpoint}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText} (${response.status})`);
    }

    return response.json();
  },
};
