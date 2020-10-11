import React from 'react';

function Welcome(props) {
  //console.log('Welcome props: ', props);
  let user = '';
  if (props.user) {
    user = props.user[0].firstName;
  }

  return (

    <div className="row" style={{ marginTop: "80px" }}>
      <div className="lead">
        <h3 className="display-5">Welcome to your workspace, {user}</h3>
        <p className="lead">{`It will provide you with an overview of what's happening and is where you will start your day`}</p>

      </div>
    </div>
  );
}

export default Welcome;
