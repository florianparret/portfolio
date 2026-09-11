import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

function makeRequest(pathname: string, cookie?: string) {
  const url = `http://localhost:3000${pathname}`;
  const headers = new Headers();
  if (cookie) {
    headers.set("cookie", `auth_token=${cookie}`);
  }
  return new NextRequest(url, { headers });
}

describe("admin proxy", () => {
  it("redirige vers /admin/login si le cookie auth_token est absent", () => {
    const response = proxy(makeRequest("/admin"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/admin/login");
  });

  it("laisse passer la requête si le cookie auth_token est présent", () => {
    const response = proxy(makeRequest("/admin", "some-token"));

    expect(response.status).toBe(200);
  });

  it("ne redirige jamais la page de login elle-même", () => {
    const response = proxy(makeRequest("/admin/login"));

    expect(response.status).toBe(200);
  });
});
