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


const Newtab = () => {

  // Step 1: Add state for the link title and URL
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [counter, setCounter] = useState(23);

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
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="140"
            image="/static/images/cards/contemplative-reptile.jpg"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over 6,000
              species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Button size="small" variant="outlined" startIcon={<RemoveIcon />} onClick={decreaseCounter}>
                Decrease
              </Button>
              <Typography sx={{ mx: 2 }}>{counter}</Typography>
              <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={increaseCounter}>
                Increase
              </Button>
            </Box>
          </CardActions>
        </Card>
        <Button variant="contained">Hello world</Button>;
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Newtab/Newtab.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
        {/* Step 3: Render the links */}
        <div>
          {links.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>
          ))}
        </div>
        <input
          type="text"
          placeholder="Title"
          value={linkTitle}
          onChange={(e) => setLinkTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
        />
        <button onClick={addLink}>
          Add New Link
        </button>
        <h6>The color of this paragraph is defined using SASS.</h6>
      </header>
    </div>
  );
};

export default Newtab;
