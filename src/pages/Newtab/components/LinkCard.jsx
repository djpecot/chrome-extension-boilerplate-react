import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const LinkCard = ({ card, onEdit, onDelete }) => {
    return (
        <Card
            key={card.id}
            sx={{ maxWidth: 345, m: 1, display: 'flex', flexDirection: 'column' }}
            onClick={() => window.open(card.link, '_blank')}
        >
            <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {card.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={(e) => onEdit(e, card.id)}>
                    <EditIcon />
                </Button>
                <Button size="small" onClick={(e) => onDelete(e, card.id)}>
                    <DeleteIcon />
                </Button>
            </CardActions>
        </Card>
    );
};

export default LinkCard;