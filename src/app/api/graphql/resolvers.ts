import { get_db_connection } from "@/db";
import { collection_mapper } from "@/lib/collection_mapper";


export const resolvers = {
    Query: {
        users: async (_: any, __: any, ___: any) => {  
            console.log("users resolver control is heree-----")
            const data = (await get_db_connection()).collection(collection_mapper.user_collection).find({}).sort({"name": 1}).toArray();
            return data;    
        }
    },
};