
export const type_defs = `#graphql
  type User {
    _id: String!
    name: String
    email: String
    image: String
    token: String
    updatedAt: String
    sessionToken: String
    whatsAppNo: String
    age: Int
  }

  type Query {
    users: [User]
  }
`;