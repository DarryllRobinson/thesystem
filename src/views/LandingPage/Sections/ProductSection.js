import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import DvrIcon from '@material-ui/icons/Dvr';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import InfoArea from "components/InfoArea/InfoArea.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>How can we help you?</h2>
          <h5 className={classes.description}>
            Our aim is to provide a service that reduces stress in your business life. Few things
            are more stressful than having to collect money. We have designed a system to make this
            as simple as possible for you. Or, if you want us to help even further, allow our call
            centre team to handle the entire process.
          </h5>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="The System"
              description="Use The System to handle all your collections activites. This includes uploading existing accounts, taking each account through the workflow engine and drawing reports."
              icon={DvrIcon}
              iconColor="info"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Call Centre"
              description="Our professional call centre agents will follow up on your outstanding accounts for you. With daily updates and your own client dashboard (coming soon) you are always in control."
              icon={HeadsetMicIcon}
              iconColor="success"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Best of Both Worlds"
              description="Any accounts that you don't want to handle yourself can be assigned to our call centre team instead (coming soon)."
              icon={EmojiEmotionsIcon}
              iconColor="danger"
              vertical
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
