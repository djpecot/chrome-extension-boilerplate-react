import React, { useState, useEffect, useRef } from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';
import CounterCard from './components/CounterCard';
import EditModal from './components/EditModal';
import LinkCard from './components/LinkCard';
import UpworkTimeline from './components/UpworkTimeline'
import NavigationDrawer from './components/NavigationDrawer';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { v4 as uuidv4 } from 'uuid'; // You need to install uuid to generate unique ids
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Drawer from '@mui/material/Drawer';
import BarChartIcon from '@mui/icons-material/BarChart';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';


import useUpworkFeed from '../../hooks/useFeedItems';
import useCounters from '../../hooks/useCounter';
import TextField from '@mui/material/TextField';
import useBackgroundImage from '../../hooks/useBackgroundImage'


// Styled components for the search bar
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Newtab = () => {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const initialCounters = [
    { id: uuidv4(), title: 'Counter 1', number: 0 },
    // ... other initial counters
  ];
  const backgroundImageUrl = useBackgroundImage();
  const { counters, addCounter, deleteCounter, updateCounterNumber, saveCounter } = useCounters(initialCounters);
  // At the top of your component, add a new state for the quote
  const [inspirationalQuote, setInspirationalQuote] = useState('Persistence powers passion.');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false); // State for the new navigation drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for the other existing drawer
  const [currentPage, setCurrentPage] = useState('default');
  const [inputUrl, setInputUrl] = useState('');
  const { feedItems, setUrl, refresh } = useUpworkFeed('https://www.upwork.com/ab/feed/jobs/rss?paging=0%3B10&sort=recency&api_params=1&q=&securityToken=...');
  const [searchText, setSearchText] = useState('');

  // Handler for search input changes
  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleUrlChange = (event) => {
    setInputUrl(event.target.value);
  };

  const handleUrlSubmit = () => {
    setUrl(inputUrl);
  };

  const handleRefresh = () => {
    refresh();
  };

  // Handler for key press on the search input
  const handleKeyPress = (event) => {
    // Check if the Enter key was pressed
    if (event.key === 'Enter') {
      // Call the search function
      searchHistory(searchText);
    }
  };


  // Function to search the browser history
  const searchHistory = (queryText) => {
    if (queryText) {
      chrome.history.search({ text: queryText, maxResults: 10 }, (results) => {
        // Do something with the results
        console.log("here's some history")
        console.log(results);
      });
    } else {
      console.error('Search text is empty');
    }
  };

  // Handler for search submission
  const handleSearchSubmit = () => {
    searchHistory(searchText);
  };

  const showDefaultPage = () => setCurrentPage('default');
  const showUpworkTimeline = () => setCurrentPage('upwork');
  const showLinksPage = () => setCurrentPage('links')

  // Refs for both drawers
  const navDrawerRef = useRef(null);
  const counterDrawerRef = useRef(null);

  // Handlers for the navigation drawer
  const handleNavDrawerMouseEnter = () => {
    setIsNavDrawerOpen(true);
  };
  const handleNavDrawerMouseLeave = () => {
    setIsNavDrawerOpen(false);
  };

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
    'Face them, no one else will for you.'
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
      saveCounter(editingCard);
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
      <Box sx={{ display: 'flex' }}>
        <NavigationDrawer
          isNavDrawerOpen={isNavDrawerOpen}
          currentPage={currentPage}
          showDefaultPage={showDefaultPage}
          showUpworkTimeline={showUpworkTimeline}
          showLinksPage={showLinksPage}
          handleMouseEnter={handleNavDrawerMouseEnter}
          handleMouseLeave={handleNavDrawerMouseLeave}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* Main content goes here */}
        </Box>
      </Box>
      {currentPage === 'default' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <header className="App-header">
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
                fontSize: '5rem', // Doubled from '4rem' to '8rem'
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchText} // Set the value to the state variable
                  onChange={handleSearchInputChange} // Set the handler to update the state
                  onKeyPress={handleKeyPress}
                />
              </Search>
              <Typography variant="subtitle1" sx={{
                fontWeight: 'bold',
                fontSize: '2rem', // Doubled from '1.5rem' to '3rem'
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
        </Box>
      )}
      {currentPage === 'upwork' && (
        <>
          <div>
            <TextField
              label="RSS URL"
              value={inputUrl}
              onChange={handleUrlChange}
            />
            <Button onClick={handleUrlSubmit}>Load Feed</Button>
            <Button onClick={handleRefresh}>Refresh Feed</Button>
          </div>
          <UpworkTimeline feedItems={feedItems} />

        </>
      )}
      {currentPage === 'links' && (
        <>
          <div>hello</div>

        </>
      )}
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
