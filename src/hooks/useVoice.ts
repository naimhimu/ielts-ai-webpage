import { useEffect, useState } from 'react';

const useVoice = () => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    useEffect(() => {
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
            const currentTranscript = Array.from(event.results)
                .map((result: any) => result[0])
                .map((result: any) => result.transcript)
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
