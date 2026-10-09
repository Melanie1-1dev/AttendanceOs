import { Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PageNotFound() {
  const { pathname } = useLocation();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <section className="surface w-full max-w-md p-8 text-center">
        <p className="font-heading text-7xl font-extrabold tracking-tight text-primary">404</p>
        <h1 className="mt-3 font-heading text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          There is no AttendanceOS page at <span className="font-mono text-foreground">{pathname}</span>.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Return to dashboard
          </Link>
        </Button>
      </section>
    </main>
  );
}
