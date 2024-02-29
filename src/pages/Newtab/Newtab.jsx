import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';

const Newtab = () => {

  // Step 1: Add state for the link title and URL
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [links, setLinks] = useState([]);

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
