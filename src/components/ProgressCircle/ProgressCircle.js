import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="static" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and static variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function CircularStatic(props) {
  console.log('CircularStatic(props): ', props);
  //const step = 1;
  const interval = 10;
  const maxProgress = 100;

  const [progressPercentage, setProgressPercentage] = useState(0);
  console.log('progressPercentage: ', progressPercentage);

  useEffect(() => {
    const updateProgress = () => setProgressPercentage(progressPercentage + props.progress)
    if (progressPercentage < maxProgress) {
      setTimeout(updateProgress, interval)
    }
  }, [progressPercentage, props]);

  return <CircularProgressWithLabel value={progressPercentage} />;
}
