import { ApolloClient, InMemoryCache } from "@apollo/client"
import env from "lib/env"

export const asyncApolloClient = new ApolloClient({
	uri: env.graphqlUrl,
	cache: new InMemoryCache(),
})
