
import { Db, MongoClient } from "mongodb"

const url = process.env.DATABASE_URL as string;

const client = new MongoClient(url);

const db_name = "mindmiracles";

export async function get_db_connection(): Promise<Db>  {
    const db = await client.db(db_name);
    return db
}