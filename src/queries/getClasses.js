import { gql } from 'apollo-boost'
export const GET_CLASSES = gql`
    query classes{
        classes {
            name
            id
        }
    }
`