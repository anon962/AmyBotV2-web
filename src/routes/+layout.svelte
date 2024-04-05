<script>
    import '../app.css'
    import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'

    const ONE_HOUR_MS = 60 * 60 * 1000

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 4 * ONE_HOUR_MS
            }
        }
    })
</script>

<QueryClientProvider client={queryClient}>
    <slot />
</QueryClientProvider>
