import { DataGrid } from '@mui/x-data-grid';
import { graphql_confs } from '@/graphql_confs/queries';
import { useGetData } from '@/hooks/use-get-data';

export default function MUITableWrapper({collection_key, columns}: {collection_key: string, columns: any[]}) {

    const { loading, error, data } : any = useGetData(graphql_confs.Query.GET_USERS);

    if(loading || error || !data) return <div>Loading...</div>

    return <DataGrid
        rows={data}
        columns={columns}
        initialState={{
        pagination: {
            paginationModel: {
            pageSize: 10,
            page: 0,
            },
        },
        }}
        pageSizeOptions={[10, 20, 50]}
        filterModel={{
        items: [
            {
            field: 'name',
            operator: 'contains',
            value: '',
            },
        ],
    }}
  />
}