import { WorkflowsContainer, WorkflowsList } from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { workflowsParamsLoader } from "@/features/workflows/server/workflows-loader";
import { requiredAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"

interface Props {
    searchParams : Promise<SearchParams>
}
const Page = async({searchParams}: Props) => {
    await requiredAuth();
    const  params = await workflowsParamsLoader(searchParams);
    prefetchWorkflows(params);

    return <div>
        <WorkflowsContainer>
            <HydrateClient>
                    <ErrorBoundary fallback={<p>Error!</p>}>
                        <Suspense fallback={<p>Loading...</p>}>
                            <WorkflowsList /> 
                        </Suspense>
                    </ErrorBoundary>
            </HydrateClient>
        </WorkflowsContainer>
    </div>
}

export default Page;