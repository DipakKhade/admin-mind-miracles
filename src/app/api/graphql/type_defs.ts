
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

  type ContactUs {
    _id: String!
    firstName: String
    lastName: String
    email: String
    age: Int
    place: String
  }

  type Query {
    users: [User]
    contactUs: [ContactUs]
  }
`;