import { gql } from 'apollo-boost'
export const GET_SCHOOLS = gql`
    query schools{
        schools {
            name
            id
        }
    }
`