import React from 'react';
import { NextPage } from 'next';

import { UserLoginType, LoginVarsType, LOGIN } from 'requests/auth';

interface LoginPageProps {}

const LoginPage: NextPage<LoginPageProps> = ({}) => {

  return(
    <div>Login!</div>
  );
}

export default LoginPage;
