import React, { useEffect, useState } from 'react';
import MysqlLayer from 'utils/MysqlLayer';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// @material-ui/icons

// core components
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import CustomInput from 'components/CustomInput/CustomInput.js';
import Button from 'components/CustomButtons/Button.js';

import styles from 'assets/jss/material-kit-react/views/landingPageSections/workStyle.js';

const useStyles = makeStyles(styles);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ContactSection() {
  // Sending message
  const [name, setName] = useState('');
  const handleName = (event) => {
    setName(event.target.value);
  };

  const [email, setEmail] = useState('');
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const [msg, setMsg] = useState('');
  const handleMsg = (event) => {
    setMsg(event.target.value);
  };

  // showing email notification
  const [open, setOpen] = useState(false);

  // handling feedback from email send attempt
  const [response, setResponse] = useState('');
  useEffect(() => {
    //console.log('response: ', response);
    if (response.status === 200) {
      setOpen(true);
      window.location.reload();
      window.scrollTo(0, 0);
    }
  }, [response]);

  const mysqlLayer = new MysqlLayer();

  const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log('about to send...');
    const emailObject = {
      purpose: 'contact form',
      to: 'darryll@thesystem.co.za',
      subject: 'Contact form',
      text: `Sender: ${name} Email: ${email} Message: ${msg}`,
      html: `Sender: ${name}\n\r
            Email: ${email}\n\r
            <br />
            Message: ${msg}`,
    };

    const response = await mysqlLayer.Post('/admin/email', emailObject);
    setResponse(response);
  };

  const handleClose = (event) => {
    setOpen(false);
  };

  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem cs={12} sm={12} md={8}>
          <h2 className={classes.title}>Contact us</h2>
          <h4 className={classes.description}>
            We would love to hear from you. Please complete the form below and
            we will get back to you as soon as possible.
          </h4>
          <form className={classes.form} onSubmit={handleSubmit}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Your Name"
                  id="name"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => handleName(event),
                    type: 'text',
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Your Email"
                  id="email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => handleEmail(event),
                    type: 'email',
                  }}
                />
              </GridItem>
              <CustomInput
                labelText="Your Message"
                id="message"
                formControlProps={{
                  fullWidth: true,
                  className: classes.textArea,
                }}
                inputProps={{
                  multiline: true,
                  onChange: (event) => handleMsg(event),
                  rows: 5,
                }}
              />
              <GridItem xs={12} sm={12} md={4}>
                <Button color="primary" type="submit">
                  Send Message
                </Button>
              </GridItem>
            </GridContainer>
          </form>
        </GridItem>
      </GridContainer>

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={10000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Thank you for your message
        </Alert>
      </Snackbar>
    </div>
  );
}
