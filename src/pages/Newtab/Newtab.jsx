import React, { useState, useEffect, useRef } from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';
import CounterCard from './components/CounterCard';
import EditModal from './components/EditModal';
import LinkCard from './components/LinkCard';


import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { v4 as uuidv4 } from 'uuid'; // You need to install uuid to generate unique ids
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Drawer from '@mui/material/Drawer';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent } from '@mui/lab';
import parseString from 'xml2js';


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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [feedItems, setFeedItems] = useState([]);

  useEffect(() => {
    fetch('https://www.upwork.com/ab/feed/jobs/rss?paging=0%3B10&sort=recency&api_params=1&q=&securityToken=1790f12c4e0908e109a7acdfccbcff0623d32bcfe388941ad614e2c8e9e1d86b729812c664e2ba5fe52357a2709d8e90ec96afb7abcb3a46e72fa80ac3bd74dc&userUid=1316015600783425536&orgUid=1625602512699682816')
      .then(response => response.text())
      .then(str => parseString.parseStringPromise(str))
      .then(result => {
        const items = result.rss.channel[0].item.slice(0, 5);
        // Update the setFeedItems to include both title and link
        setFeedItems(items.map(item => ({
          title: item.title[0],
          link: item.link[0]
        })));
      })
      .catch(console.error);
  }, []);



  // Add a ref to the drawer
  const drawerRef = useRef(null);

  // Function to open the drawer on hover
  const handleMouseEnter = () => {
    setIsDrawerOpen(true);
  };

  // Function to close the drawer when the mouse leaves the drawer area
  const handleMouseLeave = () => {
    setIsDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

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

  // Function to open the modal for a specific counter
  const openCounterModal = (counterId) => {
    const counterToEdit = counters.find(counter => counter.id === counterId);
    setEditingCard(counterToEdit); // Reuse the editingCard state for editing counters
    setIsModalOpen(true);
  };

  const countersDrawer = (
    <Drawer
      anchor="right" // This specifies which side of the screen the drawer will appear from
      open={isDrawerOpen} // This controls whether the drawer is open or closed
      onClose={toggleDrawer(false)} // This function is called when the drawer should close
      onMouseLeave={handleMouseLeave}
    >
      <Box
        sx={{ width: 250 }} // Adjust the width of the drawer content as needed
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        {counters.map((counter) => (
          <CounterCard
            key={counter.id}
            counter={counter}
            onEdit={openCounterModal}
            onIncrease={() => updateCounterNumber(counter.id, 1)}
            onDecrease={() => updateCounterNumber(counter.id, -1)}
          />
        ))}
        <Button onClick={addCounter}>
          <AddCircleOutlineIcon />
          Add Counter
        </Button>
      </Box>
    </Drawer>
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
        <Timeline position="alternate">
          {feedItems.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography><a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a></Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
        <div
          onMouseEnter={handleMouseEnter}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '10px',
            height: '100%',
            zIndex: 1300 // Ensure it's above other content
          }}
        />
        <BarChartIcon
          sx={{
            position: 'fixed',
            top: '50%',
            right: '10px', // Align with the invisible div
            transform: 'translateY(-50%)',
            fontSize: '3rem', // Increased icon size
            zIndex: 1300 // Ensure it's above other content
          }} />
        {countersDrawer}
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
            <LinkCard
              key={card.id}
              card={card}
              onEdit={editCard}
              onDelete={deleteCard}
            />
          ))}
          <Button onClick={addCard} sx={{ minWidth: 345, height: 'fit-content', m: 1 }}>
            <AddCircleOutlineIcon sx={{ fontSize: 'large' }} />
          </Button>
        </Box>
      </header >
      <EditModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingCard={editingCard}
        handleEditChange={handleEditChange}
        saveCard={saveCard}
        deleteCounter={deleteCounter}
        deleteCard={deleteCard}
      />
    </div >
  );
};

export default Newtab;
