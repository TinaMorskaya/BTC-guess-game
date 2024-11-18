import { usePlayerContext } from '../../hooks/usePlayerContext.tsx';

export const Score = () => {
    const {score} = usePlayerContext();

    return (
        <section className='score box flex-column'>
            <h3>Your score:</h3>
            <span className='box-value'>
                {score ?? 0}
            </span>
        </section>
    );
}