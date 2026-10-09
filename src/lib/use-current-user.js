import { useAuth } from "@/lib/AuthContext";

export default function useCurrentUser() {
  return useAuth().user;
}