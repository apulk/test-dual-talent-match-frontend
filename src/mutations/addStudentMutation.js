import { gql } from '@apollo/client';

const ADD_STUDENT_MUTATION = gql`
  mutation addStudent($input: StudentInput!) {
    addStudent(input: $input) {
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
`;

export default ADD_STUDENT_MUTATION