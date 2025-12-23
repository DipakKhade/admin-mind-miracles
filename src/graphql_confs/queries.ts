import { collection_mapper } from '@/lib/collection_mapper';
import { gql } from '@apollo/client';


export const graphql_confs = {
    Query: {
        GET_USERS: gql`
            query User {
                users {
                    _id
                    name
                    email
                    age
                    whatsAppNo
                }
            }
        `
    }
}