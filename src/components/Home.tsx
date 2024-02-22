import Game from "./Game";
import Layout from "./Layout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Game />
      </Layout>
    </QueryClientProvider>
  );
}

export default Home;
