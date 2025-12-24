import { TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export const useGetData = (query: TypedDocumentNode) => {
    const { loading, error, data } = useQuery(query);
    let key = "";
    let updated_data = [];
    if (data) {
        key = Object.keys(data)[0];
        updated_data = data[key].map((x: any) => {
            let id = x._id;
            return {
                ...x,
                id
            };
        });
    }

    return { loading, error, data: updated_data };
}