# IELTS AI Webpage

This project is designed to assist IELTS students by providing an interactive AI webpage that features chat functionality, voice interaction, and the ability to upload photos. The application aims to enhance the learning experience by allowing students to engage with AI in a conversational manner.

## Features

- **Chat Functionality**: Users can chat with an AI model to get assistance with IELTS preparation.
- **Voice Interaction**: Users can interact with the AI using voice commands, making the experience more accessible.
- **Photo Upload**: Users can upload photos to share relevant materials or questions with the AI.

## Project Structure

```
ielts-ai-webpage
├── public
│   └── index.html          # Main HTML file for the webpage
├── src
│   ├── App.tsx            # Main component of the application
│   ├── components          # Contains all React components
│   │   ├── Chat.tsx       # Chat interface component
│   │   ├── VoiceInput.tsx  # Voice input component
│   │   ├── PhotoUpload.tsx # Photo upload component
│   │   └── Message.tsx     # Individual message component
│   ├── hooks               # Custom hooks
│   │   └── useVoice.ts     # Hook for voice recognition
│   ├── types               # TypeScript interfaces
│   │   └── index.ts        # Interfaces for messages and users
│   ├── styles              # CSS styles
│   │   └── main.css        # Main stylesheet
│   └── utils               # Utility functions
│       └── api.ts          # API call functions
├── package.json            # npm configuration file
├── tsconfig.json           # TypeScript configuration file
└── README.md               # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd ielts-ai-webpage
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000` to view the application.

## Usage Guidelines

- Use the chat interface to ask questions related to IELTS preparation.
- Utilize the voice input feature for hands-free interaction.
- Upload photos to share relevant materials or queries with the AI.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.