import React, { Component } from 'react';
import MysqlLayer from 'utils/MysqlLayer';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Col, Form, Row } from 'react-bootstrap';

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      surname: '',
      email: '',
      phone: '',
      password: '',
      role: '',
      storeId: '1',
      type: 'business',
      f_clientId: '',
      createdDate: '',
      registrationErrors: '',
      clients: [],
    };

    this.mysqlLayer = new MysqlLayer();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    //console.log('Registration props: ', this.props);
    let clients = await this.mysqlLayer.Get(`/admin/clients`, {
      withCredentials: true,
    });
    //console.log('clients: ', clients);
    await this.setState({ clients: clients });
  }

  handleChange(event) {
    //console.log('[event.target.name]: ', [event.target.name]);
    //console.log('event.target.value: ', event.target.value);
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    // Don't let the missing this.state.values confuse you below :)
    const {
      firstName,
      surname,
      email,
      phone,
      //password,
      role,
      storeId,
      type,
      f_clientId,
    } = this.state;

    if (f_clientId !== '' && role !== '' && storeId !== '') {
      // bcrypt password
      const salt = bcrypt.genSaltSync(10);
      //const hash = bcrypt.hashSync("b0oBi35", salt);

      bcrypt.hash(this.state.password, salt, (err, hash) => {
        this.setState({ password: hash });
        //console.log('hashed password: ', this.state.password);

        const createdDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        const user = {
          firstName: firstName,
          surname: surname,
          email: email,
          phone: phone,
          password: hash,
          role: role,
          storeId: storeId,
          type: type,
          f_clientId: f_clientId,
          active: 1,
          createdDate: createdDate,
        };

        //console.log('user: ', user);

        this.mysqlLayer
          .Post(`/admin/user`, user, { withCredentials: true })
          .then((response) => {
            //console.log('response: ', response);
            if (response.data === 'user exists') {
              let message =
                'User already exists. Please create a new username (email).';
              this.handleFailedReg(message);
            } else if (response.data.affectedRows === 1) {
              this.handleSuccessfulAuth();
            } else {
              console.log('Log error to registrationErrors');
            }
          })
          .catch((error) => {
            console.log('Registration error: ', error);
          });
      });
    } else {
      toast(
        'Please ensure you have selected a role and client from the lists',
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  }

  handleFailedReg(message) {
    toast(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  handleSuccessfulAuth() {
    toast(`${this.state.firstName} has been added to the system`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    this.setState({
      firstName: '',
      surname: '',
      email: '',
      phone: '',
      password: '',
      role: '',
      storeId: '',
      type: '',
      f_clientId: '',
      createdDate: '',
    });

    this.props.loadUsers();
  }

  render() {
    const clientList = this.state.clients.map((client, idx) => (
      <option key={idx} value={client.id}>
        {client.name}
      </option>
    ));

    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="firstNameInput">
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={this.state.firstName}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="surnameInput">
                <Form.Control
                  type="text"
                  name="surname"
                  placeholder="Surname"
                  value={this.state.surname}
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
                  placeholder="Cell phone"
                  value={this.state.phone}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="passwordInput">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="roleSelect">
                <Form.Control
                  as="select"
                  onChange={this.handleChange}
                  name="role"
                  required
                >
                  <option>Role</option>
                  <option value="agent">Agent</option>
                  <option value="store">Store agent</option>
                  <option value="admin">Administrator</option>
                  <option value="kam">KAM</option>
                  <option value="client">Client</option>
                  <option value="superuser">Super user</option>
                </Form.Control>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="clientSelect">
                <Form.Control
                  as="select"
                  onChange={this.handleChange}
                  name="f_clientId"
                  required
                >
                  <option>Client</option>
                  {clientList}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Button
            type="submit"
            style={{
              background: '#48B711',
              borderColor: '#48B711',
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
