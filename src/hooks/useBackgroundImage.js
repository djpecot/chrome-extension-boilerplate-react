import { useState, useEffect } from 'react';

const useBackgroundImage = () => {
    const [backgroundImageUrl, setBackgroundImageUrl] = useState('');

    useEffect(() => {
        // Fetch a random image from Unsplash and set it as the background
        fetch('https://source.unsplash.com/random?nature')
            .then((response) => setBackgroundImageUrl(response.url))
            .catch((error) => console.error('Error fetching random image from Unsplash:', error));
    }, []);

    return backgroundImageUrl;
};

export default useBackgroundImage;