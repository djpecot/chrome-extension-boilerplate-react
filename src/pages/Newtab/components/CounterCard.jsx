import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

const CounterCard = ({ counter, onEdit }) => {
    return (
        <Card sx={{ m: 1 }}>
            <CardContent>
                <Typography variant="h6">{counter.title}</Typography>
                <Typography variant="body1">{counter.number}</Typography>
            </CardContent>
            <CardActions>
                <IconButton onClick={() => onEdit(counter.id)}>
                    <EditIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default CounterCard;