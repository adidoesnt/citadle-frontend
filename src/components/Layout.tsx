import Footer from "./Footer";
import Header from "./Header";

export type LayoutProps = {
  children: JSX.Element | JSX.Element[] | null;
};

function Layout({ children }: Readonly<LayoutProps>) {
  return (
    <div
      id="container"
      className={`grid font-lexend w-[100dvw] h-[100dvh] grid-rows-[1fr_7fr_1fr] items-center justify-center`}
    >
      <Header />
      <div id="middle" className="row-start-2">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
