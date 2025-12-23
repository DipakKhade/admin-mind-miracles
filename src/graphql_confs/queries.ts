import { collection_mapper } from '@/lib/collection_mapper';
import { gql } from '@apollo/client';


export const graphql_confs = {
    Query: {
        GET_USERS: gql`
            query User {
                users {
                    name
                    email
                    age
                    whatsAppNo
                }
            }
        `
    }
}