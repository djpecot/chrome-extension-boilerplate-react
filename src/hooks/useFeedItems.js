import { useState, useEffect, useCallback } from 'react';
import parseString from 'xml2js';

const useUpworkFeed = (initialUrl) => {
    const [feedItems, setFeedItems] = useState([]);
    const [url, setUrl] = useState(initialUrl);

    const fetchFeedItems = useCallback(() => {
        if (!url) return;

        fetch(url)
            .then(response => response.text())
            .then(str => parseString.parseStringPromise(str))
            .then(result => {
                const items = result.rss.channel[0].item.slice(0, 5);
                setFeedItems(items.map(item => ({
                    title: item.title[0],
                    link: item.link[0]
                })));
            })
            .catch(console.error);
    }, [url]);

    useEffect(() => {
        fetchFeedItems();
    }, [fetchFeedItems]);

    return { feedItems, setUrl, refresh: fetchFeedItems };
};

export default useUpworkFeed;