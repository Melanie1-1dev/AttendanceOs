import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    base44.auth
      .me()
      .then((me) => {
        if (active) setUser(me);
      })
      .catch(() => {
        if (active) setUser({ full_name: "Teacher", email: "" });
      });
    return () => {
      active = false;
    };
  }, []);

  return user;
}