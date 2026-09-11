import type { Project } from "@/types/project";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type FetchProjectsResult =
  | { success: true; projects: Project[] }
  | { success: false };

export async function fetchProjects(): Promise<FetchProjectsResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false };
    }

    const projects: Project[] = await response.json();
    return { success: true, projects };
  } catch {
    return { success: false };
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // pas d'action utile si le backend est déjà injoignable : on redirige quand même
  }
}
