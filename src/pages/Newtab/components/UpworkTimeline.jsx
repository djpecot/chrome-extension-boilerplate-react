import React from 'react';
import { List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';

const UpworkTimeline = ({ feedItems }) => {
    return (
        <Timeline position="alternate">
            {feedItems.map((item, index) => (
                <React.Fragment key={index}>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    {item.title}
                                </a>
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>
                    {index < feedItems.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </Timeline>
    );
};

export default UpworkTimeline;