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
                    <Typography variant="h6" sx={{
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        fontSize: '2rem' // Adjusted for larger size
                    }}>
                        {counter.title}
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        fontSize: '1.25rem' // Adjusted for larger size
                    }}>
                        {counter.number}
                    </Typography>
                </CardContent>
            </Card>
        </IconButton>
    );
};

export default CounterCard;