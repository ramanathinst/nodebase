import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
/**
 * Creates a preconfigured TanStack QueryClient for the application.
 *
 * The client is configured with a 30-second query stale time and a dehydrate
 * policy that treats queries as dehydrated when the default criteria match or
 * when a query's state `status` is `'pending'`.
 *
 * @returns A `QueryClient` instance with the described default options
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}