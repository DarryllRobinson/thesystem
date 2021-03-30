import React from 'react';
import ComponentRoutes from './ComponentRoutes';
//import NavBar from 'views/Components/NavBar';
import Container from '@material-ui/core/Container';
import { history } from 'services/history';

export default function AgentWorkspace() {
  //console.log('AgentWorkspace props: ', props);
  return (
    <Container style={{ marginTop: '80px' }}>
      <ComponentRoutes history={history} />
    </Container>
  );
}
