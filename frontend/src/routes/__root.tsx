import {createRootRouteWithContext, Outlet} from '@tanstack/react-router'
import {Navbar} from "@/components";
import { type QueryClient } from '@tanstack/react-query'
import { AuthContext } from '@/hooks/useAuth';

interface RouterContext {
    queryClient: QueryClient,
    authentication: AuthContext,
  } 
export const Route = createRootRouteWithContext<RouterContext>()({     
    component: () => {
        return (
            <>

                <Outlet />
            </>
        );
    },
})
  