import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import {
  Button,
  Input,
  Container,
  Header,
  Form,
  Message,
} from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [formErrors, setFormErrors] = useState({
    emailError: '',
    passwordError: '',
  });

  const [loginUser] = useMutation(loginMutation);

  const onSubmit = async () => {
    const response = await loginUser({
      variables: { email, password },
    });

    const {
      ok, token, refreshToken, errors,
    } = response.data.login;
    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      setFormErrors(err);
    }
  };

  const errorList = [];

  if (formErrors.emailError) {
    errorList.push(formErrors.emailError);
  }

  if (formErrors.passwordError) {
    errorList.push(formErrors.passwordError);
  }

  return (
    <Container text>
      <Header as="h2">Login</Header>
      <Form>
        <Form.Field error={!!formErrors.emailError}>
          <Input
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
            fluid
          />
        </Form.Field>
        <Form.Field error={!!formErrors.passwordError}>
          <Input
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
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

export default Login;
