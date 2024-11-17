import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup = () => {
  const [isRecording, setIsRecording] = useState(false);

  const requestPermissions = async () => {
    try {
      // Only request permissions that are in the manifest
      const chromePermissions = {
        permissions: ['tabCapture', 'audioCapture'],  // Only these need explicit request
        origins: ['<all_urls>']
      };

      // Request chrome permissions
      const granted = await new Promise((resolve) => {
        chrome.permissions.request(chromePermissions, (result) => {
          if (chrome.runtime.lastError) {
            console.error('Permission request error:', chrome.runtime.lastError);
            resolve(false);
          } else {
            resolve(result);
          }
        });
      });

      if (!granted) {
        throw new Error('Chrome permissions not granted');
      }

      // After Chrome permissions are granted, request microphone
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });

        // Stop the test stream
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (micError) {
        console.error('Microphone permission error:', micError);
        alert('Please enable microphone access in your browser settings and try again.');
        return false;
      }

    } catch (err) {
      console.error('Detailed permission error:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });

      alert('This extension needs permissions to access your microphone. Please try again and accept the permissions.');
      return false;
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      console.log('Requesting permissions...');
      const hasPermission = await requestPermissions();

      if (hasPermission) {
        console.log('Starting recording...');
        chrome.runtime.sendMessage({ action: 'startRecording' });
        setIsRecording(true);
      } else {
        console.log('Permission denied or error occurred');
      }
    } else {
      console.log('Stopping recording...');
      chrome.runtime.sendMessage({ action: 'stopRecording' });
      setIsRecording(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button
          onClick={toggleRecording}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            margin: '20px',
            backgroundColor: isRecording ? '#ff4444' : '#44ff44',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {isRecording ? 'Recording in progress...' : 'Click to start recording'}
        </div>
      </header>
    </div>
  );
};

export default Popup;
