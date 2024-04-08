import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useCounters = (initialCounters) => {
    const [counters, setCounters] = useState(initialCounters);

    useEffect(() => {
        chrome.storage.sync.get(['counters'], (result) => {
            if (result.counters) {
                setCounters(result.counters);
            }
        });
    }, []);

    const addCounter = () => {
        const newCounter = {
            id: uuidv4(),
            title: `Counter ${counters.length + 1}`,
            number: 0
        };
        const updatedCounters = [...counters, newCounter];
        setCounters(updatedCounters);
        chrome.storage.sync.set({ counters: updatedCounters });
    };

    const deleteCounter = (counterId) => {
        const updatedCounters = counters.filter(counter => counter.id !== counterId);
        setCounters(updatedCounters);
        chrome.storage.sync.set({ counters: updatedCounters });
    };

    const updateCounterNumber = (counterId, delta) => {
        setCounters(prevCounters => {
            const updatedCounters = prevCounters.map(counter => {
                if (counter.id === counterId) {
                    return { ...counter, number: counter.number + delta };
                }
                return counter;
            });
            chrome.storage.sync.set({ counters: updatedCounters });
            return updatedCounters;
        });
    };

    const saveCounter = (editingCounter) => {
        setCounters(prevCounters => {
            const updatedCounters = prevCounters.map(counter => {
                if (counter.id === editingCounter.id) {
                    return { ...counter, ...editingCounter };
                }
                return counter;
            });
            chrome.storage.sync.set({ counters: updatedCounters });
            return updatedCounters;
        });
    };

    return { counters, addCounter, deleteCounter, updateCounterNumber, saveCounter };
};

export default useCounters;