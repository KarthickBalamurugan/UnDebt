import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect users to login page
  },
});

export const config = { matcher: ["/"] }; // Protect only the homepage
