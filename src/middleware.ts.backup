export { default } from "next-auth/middleware";

// Any route matched here requires a signed-in session.
// Unauthenticated users are redirected to /login automatically.
export const config = {
  matcher: ["/dashboard/:path*", "/clients/:path*"],
};
