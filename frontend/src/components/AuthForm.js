// src/components/AuthForm.js
import React from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsExports from '../aws-exports';

Amplify.configure(awsExports);

function AuthForm({ signOut, user }) {
  return (
    <div>
      <h2>📚 Welcome, {user.username}</h2>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default withAuthenticator(AuthForm);
