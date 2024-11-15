export interface GuessResultMessageProps {
    isWinner: boolean;
}

export const GuessResultMessage = ({isWinner}: GuessResultMessageProps) => {
    // const {isWinner, guess, guessPrice, resolvedPrice} = result;
    return (
        <section role='alert'>
            You {isWinner ? 'won' : 'lost'}!
            {/*<br/>*/}
            {/*You guessed: {guess === Guess.Up ? 'the price would go up' : 'the price would go down'}.*/}
            {/*<br/>*/}
            {/*The original vs final price: {guessPrice} vs {resolvedPrice}.*/}
        </section>
    )
}