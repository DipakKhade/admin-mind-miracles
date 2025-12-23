import { get_db_connection } from "@/db";
import { collection_mapper } from "@/lib/collection_mapper";


export const resolvers = {
    Query: {
        users: async (_: any, __: any, ___: any) => {  
            const data = (await get_db_connection()).collection(collection_mapper.User).find({}).toArray();
            return data;    
        }
    },
};