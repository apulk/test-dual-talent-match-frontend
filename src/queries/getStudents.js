import { gql } from 'apollo-boost'
export const GET_STUDENTS = gql`
    query students{
        students {
            name
            id
            email
            school
            class
            gender
            street
            city
            state
            country
            zipcode
            birthdate
            school_id
            class_id
            mobile
        }
    }
`

export const GET_STUDENT_BY_ID = gql`
    query getStudentById($id: ID){
        getStudentById(id: $id) {
            name
            id
            email
            school
            class
            gender
            street
            city
            state
            country
            zipcode
            birthdate
            school_id
            class_id
            mobile
            file
            file_no
        }
    }
`