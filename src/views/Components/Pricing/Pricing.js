import React from "react";
// nodejs library that concatenates classes
//import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import DvrIcon from '@material-ui/icons/Dvr';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';

// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/views/landingPage.js";

const useStyles = makeStyles(styles);
const useThemes = makeStyles((theme) => ({
  priceCard: {
    backgroundColor: "white",
    //border: "1px solid #7b8a8b",
    borderRadius: 7,
    display: 'flex',
    minHeight: "400px",
    //padding: "15px",
    textAlign: "center"
  },
  priceDivTitle: {
    //border: "1px solid green",
    color: "#7b8a8b",
    fontSize: "15px",
    justifyContent: "center",
    minHeight: "60px",
    paddingTop: "10px"
  },
  priceIcon: {
    //border: "1px solid blue",
    color: "teal",
    fontSize: 80,
    padding: "5px"
  },
  pricePrice: {
    //border: "1px solid purple",
    color: "#343a40",
    fontSize: "25px",
    fontWeight: "bold",
    padding: "15px"
  },
  priceButton: {
    backgroundColor: "#3498db",
    borderRadius: 7,
  },
  priceDescription: {
    color: "#7b8a8b",
    padding: "15px"
  },
  priceFooter: {
    //border: "1px solid orange",
    justifyContent: "center",
    padding: 0
  }
}));

export default function Pricing(props) {
  const classes = useStyles();
  const themes = useThemes();
  const { ...rest } = props;
  
  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand="The System"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <Parallax filter image={require("assets/img/bg2.jpg")}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>Spend a little, save a lot</h1>
              <h5 className={classes.description}>
                We have the standard options to suit your budget but if you don{"'"}t
                see something that works for you, please contact us.
              </h5>
              <br />
            </GridItem>

          </GridContainer>
        </div>
      </Parallax>
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={3}>
            <Card className={themes.priceCard} >
              <form className={classes.form}>
                <CardBody>
                  <div className={themes.priceDivTitle}>
                    FULL SYSTEM ACCESS
                  </div>
                  <DvrIcon className={themes.priceIcon} />
                  <div className={themes.pricePrice}>
                    R50 pm
                  </div>
                </CardBody>
                <div className={themes.priceDescription}>
                  Unlimited access to The System for all your collections requirements
                </div>
                <CardFooter className={themes.priceFooter}>
                  <Button className={themes.priceButton}>
                    Choose plan
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </GridItem>

          <GridItem xs={12} sm={12} md={3}>
            <Card className={themes.priceCard} >
              <form className={classes.form}>
                <CardBody>
                  <div className={themes.priceDivTitle}>
                    CALL CENTRE OUTSOURCING
                  </div>
                  <HeadsetMicIcon className={themes.priceIcon} />
                  <div className={themes.pricePrice}>
                    R50 pm
                  </div>
                </CardBody>
                <div className={themes.priceDescription}>
                  Let our professional call centre agents collect on your behalf
                </div>
                <CardFooter className={themes.priceFooter}>
                  <Button className={themes.priceButton}>
                    Choose plan
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </GridItem>

          <GridItem xs={12} sm={12} md={3}>
            <Card className={themes.priceCard} >
              <form className={classes.form}>
                <CardBody>
                  <div className={themes.priceDivTitle}>
                    COMBINATION
                  </div>
                  <DvrIcon className={themes.priceIcon} />
                  <HeadsetMicIcon className={themes.priceIcon} />
                  <div className={themes.pricePrice}>
                    R90 pm
                  </div>
                </CardBody>
                <div className={themes.priceDescription}>
                  The best of both worlds at a reduced rate
                </div>
                <CardFooter className={themes.priceFooter}>
                  <Button className={themes.priceButton}>
                    Choose plan
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </GridItem>
        </GridContainer>
        <Footer />
      </div>
    </div>
  );
}
