import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const publicRoutes = createRouteMatcher(['/api/webhook/clerk', "/sign-up(.*)", "/sign-in(.*)", "/api/uploadthing(.*)"])

export default clerkMiddleware((auth, request) => {
    if(!publicRoutes(request)){
        auth().protect();
    }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};