export const appName = "Shell++ Docs";
const defaultRepository = "Shellplusplus/Shellplusplus-docs";
const repository = process.env.GITHUB_REPOSITORY ?? defaultRepository;
const [
  repositoryUser = "Shellplusplus",
  repositoryName = "Shellplusplus-docs",
] = repository.split("/");

export const siteBasePath = process.env.PAGES_BASE_PATH ?? "";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";
export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN ??
  `https://${repositoryUser.toLowerCase()}.github.io`
).replace(/\/$/, "");
export const siteUrl = `${siteOrigin}${siteBasePath}`;

export function withBasePath(path: string) {
  if (!siteBasePath) return path;

  return `${siteBasePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export const gitConfig = {
  user: repositoryUser,
  repo: repositoryName,
  branch: process.env.GITHUB_REF_NAME ?? "main",
};
