export interface GameLoadingProps {
    status: string;
}

export const GameLoading = ({status}: GameLoadingProps) => (
    <section aria-label='Loading' className='flex-center loading'>
        <h4 aria-live='polite'>Loading bitcoin price...</h4>
        {status && <p aria-live='polite'>Status: {status}</p>}
    </section>
);