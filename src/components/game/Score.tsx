import { usePlayerContext } from '../../hooks/usePlayerContext.tsx';

export const Score = () => {
    const {score} = usePlayerContext();

    return (
        <section className='score box flex-column'>
            <h3 className='box__header'>Your score:</h3>
            <span className='box__value'>
                {score}
            </span>
        </section>
    );
}