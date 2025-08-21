import { useEffect, useState } from 'react';

const useVoice = () => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    useEffect(() => {
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            const currentTranscript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setTranscript(currentTranscript);
        };

        recognition.onend = () => {
            if (isListening) {
                recognition.start();
            }
        };

        return () => {
            recognition.stop();
        };
    }, [isListening, recognition]);

    const startListening = () => {
        setIsListening(true);
        recognition.start();
    };

    const stopListening = () => {
        setIsListening(false);
        recognition.stop();
    };

    return { transcript, startListening, stopListening };
};

export default useVoice;