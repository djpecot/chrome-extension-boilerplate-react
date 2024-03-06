import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const UpworkTimeline = ({ feedItems }) => {
    return (
        <List>
            {feedItems.map((item, index) => (
                <ListItem key={index}>
                    <ListItemText primary={item.title} />
                </ListItem>
            ))}
        </List>
    );
};

export default UpworkTimeline;