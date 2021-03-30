import React from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
library.add(faExternalLinkAlt);

function clickableNumber(tel) {
  if (tel) {
    let clickableTel = `tel:${tel}`;
    return clickableTel;
  } else {
    return '';
  }
}

function clickableEmail(email) {
  if (email) {
    let clickableLink = `mailto:${email}`;
    return clickableLink;
  } else {
    return '';
  }
}

function Contacts(props) {
  //console.log('Contacts props: ', props);
  // setting variables in state for the new tab to pick up
  localStorage.setItem('accNum', props.accountNumber);
  localStorage.setItem('clientId', props.clientId);
  localStorage.setItem('contacts', JSON.stringify(props.contacts));

  return (
    <Accordion>
      <Card>
        <Accordion.Toggle
          as={Card.Header}
          eventKey="0"
          style={{ cursor: 'pointer' }}
        >
          Click for more contact details
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Label>Primary contact name</Form.Label>
                  <Form.Control
                    placeholder={props.contacts.primaryContactName}
                    readOnly
                  />
                </Col>
                <Col>
                  <Form.Label>Primary contact number</Form.Label>
                  <a
                    href={clickableNumber(props.contacts.primaryContactNumber)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={clickableNumber(
                        props.contacts.primaryContactNumber
                      ).substring(4)}
                      readOnly
                    />
                  </a>
                </Col>
                <Col>
                  <Form.Label>Primary contact email</Form.Label>
                  <a
                    href={clickableEmail(props.contacts.primaryContactEmail)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={props.contacts.primaryContactEmail}
                      readOnly
                    />
                  </a>
                </Col>
              </Row>
              <br />

              <Row>
                <Col>
                  <Form.Label>Representative name</Form.Label>
                  <Form.Control
                    placeholder={props.contacts.representativeName}
                    readOnly
                  />
                </Col>
                <Col>
                  <Form.Label>Representative number</Form.Label>
                  <a
                    href={clickableNumber(props.contacts.representativeNumber)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={clickableNumber(
                        props.contacts.representativeNumber
                      ).substring(4)}
                      readOnly
                    />
                  </a>
                </Col>
                <Col>
                  <Form.Label>Representative email</Form.Label>
                  <a
                    href={clickableEmail(props.contacts.representativeEmail)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={props.contacts.representativeEmail}
                      readOnly
                    />
                  </a>
                </Col>
              </Row>
              <br />

              <Row>
                <Col>
                  <Form.Label>Alternative representative name</Form.Label>
                  <Form.Control
                    placeholder={props.contacts.alternativeRepName}
                    readOnly
                  />
                </Col>
                <Col>
                  <Form.Label>Alternative representative number</Form.Label>
                  <a
                    href={clickableNumber(props.contacts.alternativeRepNumber)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={clickableNumber(
                        props.contacts.alternativeRepNumber
                      ).substring(4)}
                      readOnly
                    />
                  </a>
                </Col>
                <Col>
                  <Form.Label>Alternative representative email</Form.Label>
                  <a
                    href={clickableEmail(props.contacts.alternativeRepEmail)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={props.contacts.alternativeRepEmail}
                      readOnly
                    />
                  </a>
                </Col>
              </Row>
              <br />

              <Row>
                <Col>
                  <Form.Label>Other number 1</Form.Label>
                  <a
                    href={clickableNumber(props.contacts.otherNumber1)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={clickableNumber(
                        props.contacts.otherNumber1
                      ).substring(4)}
                      readOnly
                    />
                  </a>
                </Col>
                <Col>
                  <Form.Label>Other number 2</Form.Label>
                  <a
                    href={clickableNumber(props.contacts.otherNumber2)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={clickableNumber(
                        props.contacts.otherNumber2
                      ).substring(4)}
                      readOnly
                    />
                  </a>
                </Col>
                <Col>
                  <Form.Label>Other number 3</Form.Label>
                  <a
                    href={clickableNumber(props.contacts.otherNumber3)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={clickableNumber(
                        props.contacts.otherNumber3
                      ).substring(4)}
                      readOnly
                    />
                  </a>
                </Col>
              </Row>
              <br />

              <Row>
                <Col>
                  <Form.Label>Other number 4</Form.Label>
                  <a
                    href={clickableNumber(props.contacts.otherNumber4)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={clickableNumber(
                        props.contacts.otherNumber4
                      ).substring(4)}
                      readOnly
                    />
                  </a>
                </Col>
                <Col>
                  <Form.Label>Other number 5</Form.Label>
                  <a
                    href={clickableNumber(props.contacts.otherNumber5)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={clickableNumber(
                        props.contacts.otherNumber5
                      ).substring(4)}
                      readOnly
                    />
                  </a>
                </Col>
                <Col></Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Other email 1</Form.Label>
                  <a
                    href={clickableEmail(props.contacts.otherEmail1)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={props.contacts.otherEmail1}
                      readOnly
                    />
                  </a>
                </Col>
                <Col>
                  <Form.Label>Other email 2</Form.Label>
                  <a
                    href={clickableEmail(props.contacts.otherEmail2)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={props.contacts.otherEmail2}
                      readOnly
                    />
                  </a>
                </Col>
                <Col>
                  <Form.Label>Other email 3</Form.Label>
                  <a
                    href={clickableEmail(props.contacts.otherEmail3)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={props.contacts.otherEmail3}
                      readOnly
                    />
                  </a>
                </Col>
              </Row>
              <br />

              <Row>
                <Col>
                  <Form.Label>Other email 4</Form.Label>
                  <a
                    href={clickableEmail(props.contacts.otherEmail4)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={props.contacts.otherEmail4}
                      readOnly
                    />
                  </a>
                </Col>
                <Col>
                  <Form.Label>Other email 5</Form.Label>
                  <a
                    href={clickableEmail(props.contacts.otherEmail5)}
                    style={{ textDecoration: 'underline' }}
                  >
                    <Form.Control
                      placeholder={props.contacts.otherEmail5}
                      readOnly
                    />
                  </a>
                </Col>
                <Col></Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Do not contact 1</Form.Label>
                  <Form.Control placeholder={props.contacts.dnc1} readOnly />
                </Col>
                <Col>
                  <Form.Label>Do not contact 2</Form.Label>
                  <Form.Control placeholder={props.contacts.dnc2} readOnly />
                </Col>
                <Col>
                  <Form.Label>Do not contact 3</Form.Label>
                  <Form.Control placeholder={props.contacts.dnc3} readOnly />
                </Col>
              </Row>
              <br />

              <Row>
                <Col>
                  <Form.Label>Do not contact 4</Form.Label>
                  <Form.Control placeholder={props.contacts.dnc4} readOnly />
                </Col>
                <Col>
                  <Form.Label>Do not contact 5</Form.Label>
                  <Form.Control placeholder={props.contacts.dnc5} readOnly />
                </Col>
                <Col></Col>
              </Row>
              <br />

              <Row>
                <Col>
                  <Link
                    className="nav-link"
                    to={{
                      pathname: `/workzone/collections/contacts/${props.accountNumber}`,
                    }}
                    style={{ padding: 0 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      style={{
                        background: '#48B711',
                        borderColor: '#48B711',
                      }}
                    >
                      Edit contact details{' '}
                      <FontAwesomeIcon icon={faExternalLinkAlt} size="1x" />
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default Contacts;
