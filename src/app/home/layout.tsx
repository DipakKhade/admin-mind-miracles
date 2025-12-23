import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "@/graphql_confs/apollo-client";

export default function HomeLayout({children}:{children: ReactNode}) {
    return <ApolloProvider client={apolloClient}>
      <AppSidebar children={children} />
    </ApolloProvider>   
}