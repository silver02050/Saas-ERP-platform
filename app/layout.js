import { DataContextProvider } from "@/Context/DataContext";
import SideBar from "../components/SideBar";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import FormSideBar from "@/components/FormSideBar";
import { ReactQueryProvider } from "@/Context/QueryClientProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NetworkStatus from "@/components/NetworkStatus";

export const metadata = {
  title: "Enterprise Resourse Planning System",
  description: "ERP system developed by Nay Myo Khant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background">
        <UserProvider>
          <ReactQueryProvider>
            <DataContextProvider>
              {" "}
              <main className="max-w-[2000px] mx-auto flex items-start justify-between lg:justify-evenly px-5 py-10">
                <SideBar />
                <NetworkStatus/>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
                <FormSideBar />
              </main>
            </DataContextProvider>
          </ReactQueryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
