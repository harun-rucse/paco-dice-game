import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Routes from "./new-ui/routes";
import Spinner from "./components/Spinner";
import { BalanceProvider } from "./context/BalanceContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BalanceProvider>
        <ReactQueryDevtools initialIsOpen={false} />

        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Routes />
          </Suspense>
        </BrowserRouter>
        <Toaster
          position="top-center"
          reverseOrder={false}
          containerStyle={{
            zIndex: 999999999,
          }}
        />
      </BalanceProvider>
    </QueryClientProvider>
  );
}

export default App;
