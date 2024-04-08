import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const LinkCard = ({ card, onEdit, onDelete, onUpdate }) => {
    const [cardData, setCardData] = useState({
        title: card.title,
        description: card.description,
        image: card.image || '/static/images/cards/contemplative-reptile.jpg'
    });

    useEffect(() => {
        // Function to fetch and update card details
        const fetchCardDetails = async () => {
            try {
                const response = await fetch(`https://api.linkpreview.net/?key=9436900793e50c4f6cf7c18f0ad0bcaf&q=${encodeURIComponent(card.link)}`);
                const data = await response.json();
                setCardData({
                    title: data.title,
                    description: data.description,
                    image: data.image
                });
                onUpdate({
                    title: data.title,
                    description: data.description,
                    image: data.image
                });
            } catch (error) {
                console.error('Error fetching card details:', error);
            }
        };

        if (card.link) {
            fetchCardDetails();
        }
    }, [card.link]);

    return (
        <Card
            key={card.id}
            sx={{ maxWidth: 345, m: 1, display: 'flex', flexDirection: 'column' }}
            onClick={() => window.open(card.link, '_blank')}
        >
            <CardMedia
                component="img"
                alt={cardData.title}
                height="140"
                image={cardData.image}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {cardData.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {cardData.description}
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