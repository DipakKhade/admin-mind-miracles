import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import type { NextRequest } from 'next/server';
import { type_defs } from './type_defs';
import { resolvers } from './resolvers';

const server = new ApolloServer({ typeDefs: type_defs, resolvers });

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    return {
      userId: req.headers.get('x-user-id'),
    };
  },
});

export { handler as GET, handler as POST };