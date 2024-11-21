export interface GameLoadingProps {
    status: string;
}

export const GameLoading = ({status}: GameLoadingProps) => (
    <section className='loading'>
        <h2 aria-live='polite'>Loading bitcoin price...</h2>
        {status && <p aria-live='polite'>Status: {status}</p>}
    </section>
);