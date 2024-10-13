import { userQueryOptions } from "@/lib/api";
import { QueryClient } from "@tanstack/react-query";

export const useAuth = async () => {
  
  const queryClient = new QueryClient()
  try{
  const {user} = await queryClient.fetchQuery(userQueryOptions);
  return {user};
} catch (err) {
  return {user: undefined};
}

};


export type AuthContext = ReturnType<typeof useAuth>