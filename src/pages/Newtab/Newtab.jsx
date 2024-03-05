import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';
import CounterCard from './components/CounterCard';

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
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [counters, setCounters] = useState([
    { id: uuidv4(), title: 'Counter 1', number: 23 },
    // ... add more counters as needed
  ]);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  // At the top of your component, add a new state for the quote
  const [inspirationalQuote, setInspirationalQuote] = useState('Persistence powers passion.');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(intervalId); // Clear the interval on unmount
  }, []);

  // Define an array of quotes or fetch from an API
  const quotes = [
    'Persistence powers passion.',
    'The secret of getting ahead is getting started.',
    'All our dreams can come true, if we have the courage to pursue them.',
    // ... more quotes
  ];

  // Function to update the quote randomly
  const updateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setInspirationalQuote(quotes[randomIndex]);
  };

  // Call this function when the component mounts
  useEffect(() => {
    updateQuote();
    // Update the quote every 24 hours
    const intervalId = setInterval(updateQuote, 86400000); // 86400000 ms in a day
    return () => clearInterval(intervalId); // Clear the interval on unmount
  }, []);

  useEffect(() => {
    // Fetch a random image from Unsplash and set it as the background
    fetch('https://source.unsplash.com/random?nature')
      .then((response) => {
        setBackgroundImageUrl(response.url);
        console.log(response.url); // For debugging
      })
      .catch((error) => {
        console.error('Error fetching random image from Unsplash:', error);
      });
  }, []);

  // Function to add a new counter
  const addCounter = () => {
    const newCounter = {
      id: uuidv4(),
      title: `Counter ${counters.length + 1}`,
      number: 0
    };
    setCounters([...counters, newCounter]);
    // Save the new counters array to chrome.storage if needed
    chrome.storage.sync.set({ counters: [...counters, newCounter] });
  };

  // Function to delete a counter and update chrome.storage
  const deleteCounter = (counterId) => {
    const updatedCounters = counters.filter(counter => counter.id !== counterId);
    setCounters(updatedCounters);
    chrome.storage.sync.set({ counters: updatedCounters });
    setIsModalOpen(false); // Close the modal after deletion
  };

  // Function to open the modal for a specific counter
  const openCounterModal = (counterId) => {
    const counterToEdit = counters.find(counter => counter.id === counterId);
    setEditingCard(counterToEdit); // Reuse the editingCard state for editing counters
    setIsModalOpen(true);
  };

  // Function to update a counter's number
  const updateCounterNumber = (counterId, delta) => {
    setCounters(prevCounters => {
      const updatedCounters = prevCounters.map(counter => {
        if (counter.id === counterId) {
          return { ...counter, number: counter.number + delta };
        }
        return counter;
      });
      // Save the updated counters array to chrome.storage after updating the state
      chrome.storage.sync.set({ counters: updatedCounters });
      return updatedCounters;
    }, () => {
      // Use this space to do anything else after the state has been updated
    });
  };

  // Add UI elements for displaying counters
  const countersUI = (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
      {counters.map((counter) => (
        <CounterCard
          key={counter.id}
          counter={counter}
          onEdit={openCounterModal}
          onIncrease={() => updateCounterNumber(counter.id, 1)}
          onDecrease={() => updateCounterNumber(counter.id, -1)}
        />
      ))}
      <Button onClick={addCounter} sx={{ minWidth: 'fit-content', height: 'fit-content', m: 1 }}>
        <AddCircleOutlineIcon sx={{ fontSize: 'large' }} />
      </Button>
    </Box>
  );

  // Load the cards from chrome.storage when the component mounts
  useEffect(() => {
    chrome.storage.sync.get(['cards'], (result) => {
      if (result.cards) {
        setCards(result.cards);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(['counters'], (result) => {
      if (result.counters) {
        setCounters(result.counters);
      } else {
        // Initialize with a default counter if none are found
        const defaultCounter = { id: uuidv4(), title: 'Counter 1', number: 23 };
        setCounters([defaultCounter]);
        chrome.storage.sync.set({ counters: [defaultCounter] });
      }
    });
  }, []);

  // Function to add a new card and save to chrome.storage
  const addCard = () => {
    const newCard = {
      id: uuidv4(),
      title: 'New Card',
      link: '', // Add a link field to the card,
      description: 'Description here',
      links: []
    };
    const newCards = [...cards, newCard];
    setCards(newCards);
    chrome.storage.sync.set({ cards: newCards });
  };

  // Function to delete a card and update chrome.storage
  const deleteCard = (event, cardId) => {
    event.stopPropagation(); // Prevent event from bubbling up to the card's onClick
    const updatedCards = cards.filter(card => card.id !== cardId);
    setCards(updatedCards);
    chrome.storage.sync.set({ cards: updatedCards });
  };

  // Function to open the modal with the card's data
  const editCard = (event, cardId) => {
    event.stopPropagation(); // Prevent event from bubbling up to the card's onClick
    const cardToEdit = cards.find(card => card.id === cardId);
    setEditingCard(cardToEdit);
    setIsModalOpen(true);
  };

  // Update the handleEditChange function to include the title
  const handleEditChange = (e, field) => {
    setEditingCard(prevEditingCard => ({
      ...prevEditingCard,
      [field]: e.target.value
    }));
  };

  // Function to save the edited card or counter
  const saveCard = () => {
    if ('number' in editingCard) {
      // It's a counter card, update the counters state
      setCounters(prevCounters => {
        const updatedCounters = prevCounters.map(counter => {
          if (counter.id === editingCard.id) {
            return { ...counter, ...editingCard };
          }
          return counter;
        });
        // Save the updated counters array to chrome.storage
        chrome.storage.sync.set({ counters: updatedCounters });
        return updatedCounters;
      });
    } else {
      // It's a link card, update the cards state
      setCards(prevCards => {
        const updatedCards = prevCards.map(card => {
          if (card.id === editingCard.id) {
            return { ...card, ...editingCard };
          }
          return card;
        });
        // Save the updated cards array to chrome.storage
        chrome.storage.sync.set({ cards: updatedCards });
        return updatedCards;
      });
    }
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
    <div className="App" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover' }}>
      <header className="App-header">
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          {countersUI}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', p: 2 }}>
          <Typography variant="h2" component="h2" sx={{
            fontWeight: 'bold',
            fontSize: '8rem', // Doubled from '4rem' to '8rem'
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
          <Typography variant="subtitle1" sx={{
            fontWeight: 'bold',
            fontSize: '3rem', // Doubled from '1.5rem' to '3rem'
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            {inspirationalQuote}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', overflowX: 'auto', p: 1 }}>
          {cards.map((card) => (
            <Card
              key={card.id}
              sx={{ maxWidth: 345, m: 1, display: 'flex', flexDirection: 'column' }}
              onClick={() => window.open(card.link, '_blank')} // Make the card clickable
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
                <Button size="small" onClick={(e) => editCard(e, card.id)}>
                  <EditIcon />
                </Button>
                <Button size="small" onClick={(e) => deleteCard(e, card.id)}>
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
            {editingCard && 'number' in editingCard ? (
              // Counter card editing UI
              <>
                <Typography variant="h6" component="h2">
                  Edit Counter
                </Typography>
                <TextField
                  label="Title"
                  value={editingCard.title}
                  onChange={(e) => handleEditChange(e, 'title')}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Number"
                  type="number"
                  value={editingCard.number}
                  onChange={(e) => handleEditChange(e, 'number')}
                  fullWidth
                  margin="normal"
                />
                {/* Add any additional fields for editing counters here */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveCard}
                >
                  Save
                </Button>
                {/* Add delete button */}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteCounter(editingCard.id)}
                  sx={{ marginLeft: '8px' }} // Adjust spacing as needed
                >
                  Delete
                </Button>
              </>
            ) : (
              // Link card editing UI
              <>
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
                <TextField
                  label="Link"
                  value={editingCard?.link || ''}
                  onChange={(e) => handleEditChange(e, 'link')}
                  fullWidth
                  margin="normal"
                />
                {/* Add more fields if needed for link cards */}
              </>
            )}
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
