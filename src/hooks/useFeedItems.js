import { useState, useEffect, useCallback } from 'react';
import parseString from 'xml2js';

const useUpworkFeed = (initialUrl) => {
    const [feedItems, setFeedItems] = useState(() => {
        // Attempt to load feed items from local storage
        const savedFeedItems = localStorage.getItem('feedItems');
        return savedFeedItems ? JSON.parse(savedFeedItems) : [];
    });
    const [url, setUrl] = useState(() => {
        // Attempt to load the URL from local storage
        const savedUrl = localStorage.getItem('feedUrl');
        return savedUrl || initialUrl;
    });

    const fetchFeedItems = useCallback(() => {
        if (!url) return;

        fetch(url)
            .then(response => response.text())
            .then(str => parseString.parseStringPromise(str))
            .then(result => {
                const items = result.rss.channel[0].item.slice(0, 5);
                const feedData = items.map(item => ({
                    title: item.title[0],
                    link: item.link[0]
                }));
                setFeedItems(feedData);
                localStorage.setItem('feedItems', JSON.stringify(feedData)); // Persist to local storage
            })
            .catch(console.error);
    }, [url]);

    useEffect(() => {
        fetchFeedItems();
    }, [fetchFeedItems]);

    useEffect(() => {
        localStorage.setItem('feedUrl', url); // Persist URL to local storage
    }, [url]);

    return { feedItems, setUrl, refresh: fetchFeedItems };
};

export default useUpworkFeed;