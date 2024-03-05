import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const CounterCard = ({ counter, onEdit }) => {
    return (
        <IconButton onClick={() => onEdit(counter.id)} sx={{ m: 1 }}>
            <Card sx={{ backgroundColor: 'transparent' }}>
                <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', textShadow: '0px 0px 3px rgba(0,0,0,0.5)' }}>{counter.title}</Typography>
                    <Typography variant="body1" sx={{ color: 'white', textShadow: '0px 0px 3px rgba(0,0,0,0.5)' }}>{counter.number}</Typography>
                </CardContent>
            </Card>
        </IconButton>
    );
};

export default CounterCard;