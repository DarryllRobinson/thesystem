import React, { Component } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import Toasts from 'utils/Toasts';
import MysqlLayer from 'utils/MysqlLayer';
import ErrorReporting from 'utils/ErrorReporting';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';

class editContacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accNum: localStorage.getItem('accNum'),
      clientId: localStorage.getItem('clientId'),
      contacts: JSON.parse(localStorage.getItem('contacts')),
    };

    this.mysqlLayer = new MysqlLayer();
    this.errorReporting = new ErrorReporting();
    this.handleChange = this.handleChange.bind(this);
    this.saveDetails = this.saveDetails.bind(this);
  }

  async saveDetails() {
    let { contacts } = this.state;
    contacts.updatedDate = moment(new Date()).format('YYYY-MM-DD');
    contacts.updatedBy = sessionStorage.getItem('cwsUser');

    await this.mysqlLayer
      .Put(
        `/business/contacts/update_item/${this.state.clientId}/${this.state.accNum}`,
        contacts
      )
      .then((response) => {
        console.log('editContacts response: ', response);
        if (response.affectedRows === 1) {
          Toasts(
            'success',
            'The contact details were updated. Please close this tab.',
            true
          );
          //this.props.history.push(`/workzone/collections/collection/${this.props.location.state.accNum}`);
        } else {
          console.log('cannot connect');
          this.errorReporting.sendMessage({
            error: 'Unable to update contacts',
            fileName: 'editContacts.js',
            dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            user: sessionStorage.getItem('cwsUser'),
            state: JSON.stringify(this.state),
          });
          Toasts(
            'error',
            'Unable to access the server. Please contact your administrator.',
            false
          );
        }
      })
      .catch((error) => {
        console.log('editContacts error: ', error);
      });
  }

  async handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;

    this.setState((prevState) => ({
      contacts: {
        // object that we want to update
        ...prevState.contacts, // keep all other key-value pairs
        [name]: value, // update the value of specific key
      },
    }));
  }

  render() {
    let { contacts } = this.state;
    console.log('render contacts: ', contacts);
    //console.log('render editContacts props: ', this.props);
    //console.log('editContacts this.props.history.location.pathname: ', this.props.history.location.pathname);
    if (!contacts || contacts === undefined) {
      return <div>Loading...</div>;
    } else {
      return (
        <Container fluid>
          <Card>
            <Card.Body>
              <Form>
                <Row>
                  <Col>
                    <Form.Label>Primary contact name</Form.Label>
                    <Form.Control
                      value={contacts.primaryContactName || ''}
                      name="primaryContactName"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Primary contact number</Form.Label>
                    <Form.Control
                      value={contacts.primaryContactNumber || ''}
                      name="primaryContactNumber"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Primary contact email</Form.Label>
                    <Form.Control
                      value={contacts.primaryContactEmail || ''}
                      name="primaryContactEmail"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                </Row>
                <br />

                <Row>
                  <Col>
                    <Form.Label>Representative name</Form.Label>
                    <Form.Control
                      value={contacts.representativeName || ''}
                      name="representativeName"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Representative number</Form.Label>
                    <Form.Control
                      value={contacts.representativeNumber || ''}
                      name="representativeNumber"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Representative email</Form.Label>
                    <Form.Control
                      value={contacts.representativeEmail || ''}
                      name="representativeEmail"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                </Row>
                <br />

                <Row>
                  <Col>
                    <Form.Label>Alternative representative name</Form.Label>
                    <Form.Control
                      value={contacts.alternativeRepName || ''}
                      name="alternativeRepName"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Alternative representative number</Form.Label>
                    <Form.Control
                      value={contacts.alternativeRepNumber || ''}
                      name="alternativeRepNumber"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Alternative representative email</Form.Label>
                    <Form.Control
                      value={contacts.alternativeRepEmail || ''}
                      name="alternativeRepEmail"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                </Row>
                <br />

                <Row>
                  <Col>
                    <Form.Label>Other number 1</Form.Label>
                    <Form.Control
                      value={contacts.otherNumber1 || ''}
                      name="otherNumber1"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Other number 2</Form.Label>
                    <Form.Control
                      value={contacts.otherNumber2 || ''}
                      name="otherNumber2"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Other number 3</Form.Label>
                    <Form.Control
                      value={contacts.otherNumber3 || ''}
                      name="otherNumber3"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                </Row>
                <br />

                <Row>
                  <Col>
                    <Form.Label>Other number 4</Form.Label>
                    <Form.Control
                      value={contacts.otherNumber4 || ''}
                      name="otherNumber4"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Other number 5</Form.Label>
                    <Form.Control
                      value={contacts.otherNumber5 || ''}
                      name="primaryContactName"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col></Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Other email 1</Form.Label>
                    <Form.Control
                      value={contacts.otherEmail1 || ''}
                      name="otherEmail1"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Other email 2</Form.Label>
                    <Form.Control
                      value={contacts.otherEmail2 || ''}
                      name="otherEmail2"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Other email 3</Form.Label>
                    <Form.Control
                      value={contacts.otherEmail3 || ''}
                      name="otherEmail3"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                </Row>
                <br />

                <Row>
                  <Col>
                    <Form.Label>Other email 4</Form.Label>
                    <Form.Control
                      value={contacts.otherEmail4 || ''}
                      name="otherEmail4"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Other email 5</Form.Label>
                    <Form.Control
                      value={contacts.otherEmail5 || ''}
                      name="otherEmail5"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col></Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Do not contact 1</Form.Label>
                    <Form.Control
                      value={contacts.dnc1 || ''}
                      name="dnc1"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Do not contact 2</Form.Label>
                    <Form.Control
                      value={contacts.dnc2 || ''}
                      name="dnc2"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Do not contact 3</Form.Label>
                    <Form.Control
                      value={contacts.dnc3 || ''}
                      name="dnc3"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                </Row>
                <br />

                <Row>
                  <Col>
                    <Form.Label>Do not contact 4</Form.Label>
                    <Form.Control
                      value={contacts.dnc4 || ''}
                      name="dnc4"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Do not contact 5</Form.Label>
                    <Form.Control
                      value={contacts.dnc5 || ''}
                      name="dnc5"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </Col>
                  <Col></Col>
                </Row>
                <br />

                <Row>
                  <Col>
                    <Button
                      style={{
                        background: '#48B711',
                        borderColor: '#48B711',
                      }}
                      onClick={this.saveDetails}
                    >
                      Save contact details
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          <ToastContainer />
        </Container>
      );
    }
  }
}

export default editContacts;
