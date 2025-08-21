import React, { Component } from 'react';

class VoiceInput extends Component {
    state = {
        isListening: false,
        transcript: ''
    };

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    componentDidMount() {
        this.recognition.interimResults = true;
        this.recognition.onresult = (event) => {
            const transcript = event.results[event.resultIndex][0].transcript;
            this.setState({ transcript });
        };
    }

    startListening = () => {
        this.setState({ isListening: true });
        this.recognition.start();
    };

    stopListening = () => {
        this.setState({ isListening: false });
        this.recognition.stop();
    };

    render() {
        return (
            <div>
                <button onClick={this.startListening} disabled={this.state.isListening}>
                    Start Listening
                </button>
                <button onClick={this.stopListening} disabled={!this.state.isListening}>
                    Stop Listening
                </button>
                <p>Transcript: {this.state.transcript}</p>
            </div>
        );
    }
}

export default VoiceInput;