import { VueQueryPlugin, QueryClient, type VueQueryPluginOptions } from '@tanstack/vue-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60, // 1min
            gcTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

const vueQueryOptions: VueQueryPluginOptions = { queryClient }

export { vueQueryOptions }
export default queryClient