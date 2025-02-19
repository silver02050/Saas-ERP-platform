"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient({ defaultOptions:{queries:{staleTime: 1000 * 60 * 5}}});
const queryClient = new QueryClient();

export const ReactQueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

  );
};