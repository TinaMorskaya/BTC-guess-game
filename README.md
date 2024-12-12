# BTC Guess Game

BTC Guess Game is a React application that challenges players to predict Bitcoin price movements. Players make
one-minute predictions on whether the BTC/USD price will go up or down, earning or losing points based on their
accuracy.

## Game Rules

- Players start with a score of 0
- Players can see their current score and real-time BTC/USD price
- Only one prediction ("up" or "down") can be made at a time
- Predictions are locked for 60 seconds after submission
- Correct predictions earn 1 point, incorrect predictions lose 1 point
- New predictions can only be made after the previous one is resolved

## Features

- Real-time Bitcoin price tracking
- Simple up/down prediction system
- 60-second prediction windows
- Score tracking system
- User-friendly interface
- Single prediction lock mechanism

## Technologies Used

- React
- TypeScript
- Vite
- Node.js
- npm

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

Ensure you have the following specific versions installed:

Node.js v22.11.0
npm 10.9.0

### Installation

1. Clone the repository:
    ```sh
    git clone git@github.com:TinaMorskaya/BTC-guess-game.git
    ```

2. Navigate to the project directory:
    ```sh
    cd BTC-guess-game
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

### Development

Start the development server:

```sh
npm run dev
```

### Testing

Run the test suite:

```sh
npm test
```

### Production Build

Create a production-ready build:

```sh
npm run build
```

The build will be available in the `dist` directory.

## Game Flow

1. The player sees the current BTC/USD price and their score
2. Player makes a prediction (up or down)
3. The prediction is locked for 60 seconds
4. After 60 seconds, the price is compared to the initial price
5. Score is updated based on prediction accuracy
6. Player can make a new prediction