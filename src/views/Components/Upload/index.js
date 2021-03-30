import React, { useEffect, useState } from 'react';
import Workspaces from './Workspaces';

const Upload = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-8">
          <Workspaces />
        </div>
        <div className="col-4">
          <p style={{ fontWeight: 'bold' }}></p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
