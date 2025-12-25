import { get_db_connection } from "@/db";
import { collection_mapper } from "@/lib/collection_mapper";


export const resolvers = {
    Query: {
        users: async (_: any, __: any, ___: any) => {  
            const data = (await get_db_connection()).collection(collection_mapper.user_collection).find({}).sort({"name": 1}).toArray();
            return data;    
        },
        contactUs: async (_: any, __: any, ___: any) => {  
            const data = (await get_db_connection()).collection(collection_mapper.contact_us_collection).find({}).sort({"firstName": 1}).toArray();
            return data;    
        },
    },
};