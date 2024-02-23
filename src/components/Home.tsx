import Game from "./Game";
import Layout from "./Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OnlyMobile from "./OnlyMobile";
import { isMobile } from "react-device-detect";

const queryClient = new QueryClient();

function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>{isMobile ? <Game /> : <OnlyMobile />}</Layout>
    </QueryClientProvider>
  );
}

export default Home;
