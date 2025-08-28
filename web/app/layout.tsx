import "./../styles/globals.css";
import { ApolloWrapper } from "../lib/apollo-wrapper";
import { Navbar } from "../components/navbar";
import ErrorBoundary from "./errorBoundary";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-4xl mx-auto p-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Mini Event Manager</h1>

          </header>
          <ErrorBoundary>
            <ApolloWrapper>
              <Navbar />
              {children}
            </ApolloWrapper></ErrorBoundary>
        </div>
      </body>
    </html>
  );
}