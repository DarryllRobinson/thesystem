import React, { Component } from 'react';
import MysqlLayer from 'utils/MysqlLayer';
import moment from 'moment';
import Toasts from 'utils/Toasts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Col, Form, Row } from 'react-bootstrap';

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      regNum: '',
      mainContact: '',
      phone: '',
      email: '',
      createdDate: '',
      registrationErrors: '',
      clients: []
    }

    this.mysqlLayer = new MysqlLayer();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    //console.log('Registration props: ', this.props);
    let clients = await this.mysqlLayer.Get(`/admin/clients`, { withCredentials: true });
    //console.log('clients: ', clients);
    await this.setState({ clients: clients });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    // Don't let the missing this.state.values confuse you below :)
    const {
      name,
      regNum,
      mainContact,
      phone,
      email
    } = this.state;

    let unique = this.checkUnique(regNum);

    if (unique) {
      const createdDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const createdBy = sessionStorage.getItem('cwsUser');

      const client = {
        name: name,
        regNum: regNum,
        email: email,
        phone: phone,
        mainContact: mainContact,
        hasPaid: 1,
        createdDate: createdDate,
        createdBy: createdBy
      };

      await this.mysqlLayer.Post(`/admin/clients`, client, { withCredentials: true }
      ).then(async response => {
        //console.log('response: ', response);
        //console.log('response.data.insertId: ', response.data.insertId);
        if (response.data.affectedRows === 1) {
          const services = {
            f_clientId: response.data.insertId,
            service: 'collections',
            type: 'business'
          };

          await this.mysqlLayer.Post('/admin/clientservices', services, { withCredentials: true }
          ).then(serviceResponse => {
            //console.log('serviceResponse: ', serviceResponse);
            Toasts('success', 'Client successfully added to The System', true);
            this.props.loadClients();
          });
        } else {
          Toasts('error', 'Problem adding client to The System', false);
        }
      }).catch(error => {
        console.log('Client registration error: ', error);
      });

    } else {
      Toasts('error', 'The client already exists. Please check the registration nunber.', false);
    }
  }

  checkUnique(regNum) {
    let unique = true;
    this.state.clients.forEach(client => {
      if (client.regNum === regNum) unique = false;
    });
    return unique;
  }

  render() {
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="nameInput">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Client name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="regNumInput">
                <Form.Control
                  type="text"
                  name="regNum"
                  placeholder="Registration number"
                  value={this.state.regNum}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="contactInput">
                <Form.Control
                  type="text"
                  name="mainContact"
                  placeholder="Main contact"
                  value={this.state.mainContact}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="emailInput">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="phoneInput">
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Phone number"
                  value={this.state.phone}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit"
            style={{
              background: "#48B711",
              borderColor: "#48B711"
            }}
          >
            Register
          </Button>
        </Form>
        <ToastContainer />
      </>

    );
  }
}
