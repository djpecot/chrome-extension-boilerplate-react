let mediaRecorder = null;
let audioChunks = [];
let silenceDetectionTimer = null;
const SILENCE_THRESHOLD = -50; // dB
const SILENCE_DURATION = 1000; // ms

async function startRecording(stream) {
    console.log('Starting recording setup...');
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    source.connect(analyzer);

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        console.log('Data available:', event.data.size, 'bytes');
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        console.log('Recording stopped, audioChunks:', audioChunks.length);
        if (audioChunks.length === 0) {
            console.error('No audio data collected!');
            return;
        }

        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        console.log('Created audio blob:', audioBlob.size, 'bytes');
        await sendToOpenAI(audioBlob);
        audioChunks = [];
    };

    // Start recording
    mediaRecorder.start();

    // Implement silence detection
    const checkAudioLevel = () => {
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

        if (average < SILENCE_THRESHOLD) {
            if (!silenceDetectionTimer) {
                silenceDetectionTimer = setTimeout(() => {
                    if (mediaRecorder.state === 'recording') {
                        mediaRecorder.stop();
                    }
                }, SILENCE_DURATION);
            }
        } else {
            if (silenceDetectionTimer) {
                clearTimeout(silenceDetectionTimer);
                silenceDetectionTimer = null;
            }
        }
    };

    setInterval(checkAudioLevel, 100);
}

async function sendToOpenAI(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json'); // Add explicit response format
    formData.append('timestamp_granularities[]', 'word'); // Add timestamp granularity if needed

    try {
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${YOUR_OPENAI_API_KEY}`,
                // Remove Content-Type header as it's automatically set with FormData
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the file size is too large (25MB limit)
        if (audioBlob.size > 25 * 1024 * 1024) {
            throw new Error('Audio file size exceeds 25MB limit');
        }

        // Send transcribed text to content script
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tab.id, {
            action: 'insertText',
            text: data.text
        });
    } catch (error) {
        console.error('Error sending audio to OpenAI:', error);
    }
}

// Listen for commands to start/stop recording
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);
    if (request.action === 'startRecording') {
        console.log('Starting recording...');

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tab = tabs[0];
            chrome.tabCapture.capture({
                audio: true,
                video: false,
                audioConstraints: {
                    mandatory: {
                        chromeMediaSource: 'tab'
                    }
                }
            }, function (stream) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    return;
                }
                if (stream) {
                    startRecording(stream);
                }
            });
        });
    }
});
