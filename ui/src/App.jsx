import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { bsc, sepolia } from "wagmi/chains";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import PageNotFound from "./pages/PageNotFound";
import Spinner from "./components/Spinner";
import { BalanceProvider } from "./context/BalanceContext";

const AppLayout = lazy(() => import("./components/AppLayout"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const Homepage = lazy(() => import("./pages/Homepage"));

const chains = [bsc];
const config = createConfig(
  getDefaultConfig({
    alchemyId: "EbWpcrEoNB5gzeDJi_clFzLbpbgTtuRt",
    walletConnectProjectId: "1134b8f033ffc7945c3513d4fa5f0459",
    chains,
    appName: "Your App Name",
    appDescription: "Your App Description",
    appUrl: "https://family.co",
    appIcon: "https://family.co/logo.png",
  })
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <BalanceProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <WagmiConfig config={config}>
          <ConnectKitProvider>
            <BrowserRouter>
              <Suspense fallback={<Spinner />}>
                <Routes>
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<Homepage />} />
                    <Route path="/staking" element={<ComingSoon />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
            <Toaster
              position="top-center"
              reverseOrder={false}
              containerStyle={{
                zIndex: 999999999,
              }}
            />
          </ConnectKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </BalanceProvider>
  );
}

export default App;
