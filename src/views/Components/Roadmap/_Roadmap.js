import React from 'react';
import RoadmapProgress from 'react-roadmap-progress';

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

export default function Roadmap(props) {
  return (
    <div>
      <RoadmapProgress milestones={milestones} />
    </div>
  )
}
