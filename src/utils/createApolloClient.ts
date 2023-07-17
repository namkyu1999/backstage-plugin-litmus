import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

function createApolloClient(
    httpLinkUri: string,
    wsLinkUri: string,
    apiToken: string
) {
    const httpLink = new HttpLink({
        uri: httpLinkUri,
    });
    const authLink = setContext((_, { headers }) => {
        const token = apiToken;
        return {
            headers: {
                ...headers,
                authorization: token,
            },
        };
    });

    const wsLink = new WebSocketLink({
        uri: wsLinkUri,
        options: {
            reconnect: true,
            lazy: true,
        },
    });

    const link = split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        authLink.concat(wsLink),
        authLink.concat(httpLink)
    );

    const client = new ApolloClient({
        link,
        cache: new InMemoryCache(),
    });

    return client;
}

export default createApolloClient;
