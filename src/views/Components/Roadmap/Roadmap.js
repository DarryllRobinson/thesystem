import React from 'react';
// nodejs library that concatenates classes
//import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

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

import RoadmapProgress from 'react-roadmap-progress';

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

export default function Roadmap(props) {
  const classes = useStyles();
  const themes = useThemes();
  const { ...rest } = props;

  const milestones = [
    {
      title: 'Milestone 1',
      version: '0.0.1',
      description: 'Just getting started...',
      complete: true,
    },
    {
      title: 'Milestone 2',
      version: '1.0.0',
      description: (
        <div>
          <h2>Launch!</h2>
          <p>Woohoo!</p>
        </div>
      ),
      complete: true,
    },
  ];

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
              <h1 className={classes.title}>What is coming next?</h1>
              <h5 className={classes.description}>
                Cool stuffs
              </h5>
              <br />
            </GridItem>

          </GridContainer>
        </div>
      </Parallax>
      <div className={classes.container}>
        <GridContainer justify="center">
            {console.log('RoadmapProgress: ', RoadmapProgress)
              /*
              <GridItem xs={12} sm={12} md={3}>
              <div>
              <RoadmapProgress milestones={milestones} />
            </div>
          </GridItem>*/}
        </GridContainer>
      </div>
      <Footer greyFont/>
    </div>
  );
}
