import { gql } from '@apollo/client';

const LOGIN = gql`
  mutation login($email: String!,$pass: String!) {
    login(email: $email,pass: $pass) {
      id
      name
      email
      type
      student_id
    }
  }
`;

export default LOGIN