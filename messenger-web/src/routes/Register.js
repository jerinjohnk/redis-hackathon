/* eslint-disable */
import React, { useReducer } from 'react';
import {
  Button,
  Input,
  Container,
  Header,
  Message,
  Form,
} from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

const Register = () => {
  const [addUser] = useMutation(registerMutation);
  const history = useHistory();

  const [inputValues, setInputValues] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      username: '',
      usernameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
    },
  );

  const onChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ [name]: value });
  };

  const onSubmit = async () => {
    setInputValues({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });
    const { username, email, password } = inputValues;
    const response = await addUser({
      variables: { username, email, password },
    });

    const { ok, errors } = response.data.register;

    if (ok) {
      history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        // err['passwordError'] = 'too long..';
        err[`${path}Error`] = message;
      });

      setInputValues(err);
    }
  };

  const errorList = [];
  if (inputValues.usernameError) {
    errorList.push(inputValues.usernameError);
  }

  if (inputValues.emailError) {
    errorList.push(inputValues.emailError);
  }

  if (inputValues.passwordError) {
    errorList.push(inputValues.passwordError);
  }

  return (
    <Container text>
      <Header as="h2">Register</Header>
      <Form>
        <Form.Field error={!!inputValues.usernameError}>
          <Input
            name="username"
            onChange={onChange}
            value={inputValues.username}
            placeholder="Username"
            fluid
          />
        </Form.Field>
        <Form.Field error={!!inputValues.emailError}>
          <Input
            name="email"
            onChange={onChange}
            value={inputValues.email}
            placeholder="Email"
            fluid
          />
        </Form.Field>
        <Form.Field error={!!inputValues.passwordError}>
          <Input
            name="password"
            onChange={onChange}
            value={inputValues.password}
            type="password"
            placeholder="Password"
            fluid
          />
        </Form.Field>
        <Button onClick={onSubmit}>Submit</Button>
      </Form>
      {errorList.length ? (
        <Message
          error
          header="There was some errors with your submission"
          list={errorList}
        />
      ) : null}
    </Container>
  );
};

export default Register;
