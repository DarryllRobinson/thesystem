import React from 'react';
//import { library } from '@fortawesome/fontawesome-svg-core';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';

//library.add(faPlusSquare);

//library.add(faIgloo)

function AppButton(props) {
  //console.log('AppButton props: ', props);
  if (props.workspace === 'applications' && sessionStorage.getItem('cwsRole') === 'store') {

    return (
      <>
        <Link to="/workspace/new-application">
        {/*  <FontAwesomeIcon icon={faPlusSquare} size="5x"  />*/}
          <p>New Application</p>
        </Link>
      </>
    );
  } else {
    return null
  }
}


export default AppButton;
