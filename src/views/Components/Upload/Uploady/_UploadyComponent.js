import React from 'react';
import { Uploady } from '@rpldy/uploady';
import MyForm from './UploadForm';

const UploadyComponent = () => {
  return (
    <Uploady
      clearPendingOnAdd
      multiple={false}
      destination={{ url: 'my-server.com/upload' }}
    >
      <h3>Using a Form with file input and additional fields</h3>
      <MyForm />
    </Uploady>
  );
};

export default UploadyComponent;
