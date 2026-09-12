import type { ContactFormValues } from "@/lib/contact-schema";
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

export async function checkSession(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      credentials: "include",
      cache: "no-store",
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

export async function fetchProject(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as Project;
  } catch {
    return null;
  }
}

export async function createProject(project: Project): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(project),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function updateProject(
  slug: string,
  project: Omit<Project, "slug">,
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(project),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function deleteProject(slug: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${slug}`, {
      method: "DELETE",
      credentials: "include",
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function submitContactMessage(data: ContactFormValues): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch {
    return false;
  }
}
