import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid'; // You need to install uuid to generate unique ids
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';


const Newtab = () => {

  // Step 1: Add state for the link title and URL
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [counter, setCounter] = useState(23);
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  // Load the cards from chrome.storage when the component mounts
  useEffect(() => {
    chrome.storage.sync.get(['cards'], (result) => {
      if (result.cards) {
        setCards(result.cards);
      }
    });
  }, []);

  // Function to add a new card and save to chrome.storage
  const addCard = () => {
    const newCard = {
      id: uuidv4(),
      title: 'New Card',
      description: 'Description here',
      links: []
    };
    const newCards = [...cards, newCard];
    setCards(newCards);
    chrome.storage.sync.set({ cards: newCards });
  };

  // Function to delete a card and update chrome.storage
  const deleteCard = (cardId) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    setCards(updatedCards);
    chrome.storage.sync.set({ cards: updatedCards });
  };

  // Function to open the modal with the card's data
  const editCard = (cardId) => {
    const cardToEdit = cards.find(card => card.id === cardId);
    setEditingCard(cardToEdit);
    setIsModalOpen(true);
  };

  // Function to handle the changes in the modal's input fields
  const handleEditChange = (e, field) => {
    setEditingCard({ ...editingCard, [field]: e.target.value });
  };

  // Function to save the edited card
  const saveCard = () => {
    const updatedCards = cards.map(card => {
      if (card.id === editingCard.id) {
        return editingCard;
      }
      return card;
    });
    setCards(updatedCards);
    chrome.storage.sync.set({ cards: updatedCards });
    setIsModalOpen(false);
  };

  // Function to increase the counter and save to chrome.storage
  const increaseCounter = () => {
    setCounter(prevCounter => {
      const newCounter = prevCounter + 1;
      chrome.storage.sync.set({ counter: newCounter });
      return newCounter;
    });
  };

  // Function to decrease the counter and save to chrome.storage
  const decreaseCounter = () => {
    setCounter(prevCounter => {
      const newCounter = prevCounter - 1;
      chrome.storage.sync.set({ counter: newCounter });
      return newCounter;
    });
  };

  // Load the counter value from chrome.storage when the component mounts
  useEffect(() => {
    chrome.storage.sync.get(['counter'], (result) => {
      if (result.counter !== undefined) {
        setCounter(result.counter);
      } else {
        // If no counter value is stored, initialize it to 23
        setCounter(23);
        chrome.storage.sync.set({ counter: 23 });
      }
    });
  }, []);

  // Step 2: Update the addLink function
  const addLink = () => {
    if (linkTitle && linkUrl) {
      let modifiedUrl = linkUrl;
      if (!/^https?:\/\//i.test(modifiedUrl)) {
        modifiedUrl = 'https://' + modifiedUrl;
      }

      const newLinks = [...links, { title: linkTitle, url: modifiedUrl }];
      setLinks(newLinks);
      setLinkTitle('');
      setLinkUrl('');
      // Save the new links array to chrome.storage
      chrome.storage.sync.set({ links: newLinks });
    }
  };

  // Step 4: Load links from chrome.storage when component mounts
  useEffect(() => {
    // Get the links from chrome.storage
    chrome.storage.sync.get(['links'], (result) => {
      if (result.links) {
        setLinks(result.links);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Box sx={{ display: 'flex', overflowX: 'auto', p: 1 }}>
          {cards.map((card) => (
            <Card key={card.id} sx={{ maxWidth: 345, m: 1, display: 'flex', flexDirection: 'column' }}>
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
                <Button size="small" onClick={() => editCard(card.id)}>
                  <EditIcon />
                </Button>
                <Button size="small" onClick={() => deleteCard(card.id)}>
                  <DeleteIcon />
                </Button>
              </CardActions>
            </Card>
          ))}
          <Button onClick={addCard} sx={{ minWidth: 345, height: 'fit-content', m: 1 }}>
            <AddCircleOutlineIcon sx={{ fontSize: 'large' }} />
          </Button>
        </Box>
      </header>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isModalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            outline: 'none' // Disable focus outline for accessibility, consider a visible alternative
          }}>
            <Typography variant="h6" component="h2">
              Edit Card
            </Typography>
            <TextField
              label="Title"
              value={editingCard?.title || ''}
              onChange={(e) => handleEditChange(e, 'title')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={editingCard?.description || ''}
              onChange={(e) => handleEditChange(e, 'description')}
              fullWidth
              margin="normal"
              multiline
            />
            {/* Add more fields if needed */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" onClick={saveCard}>
                Save
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Newtab;
