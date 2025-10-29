import { WorkflowsContainer, WorkflowsList } from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requiredAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"

const Page = async() => {
    await requiredAuth();

    prefetchWorkflows();

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