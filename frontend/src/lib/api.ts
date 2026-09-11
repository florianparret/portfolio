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
