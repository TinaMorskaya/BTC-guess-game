import { useBTCPriceContext } from '../../hooks/useBTCPriceContext.tsx';

export const CurrentPrice = () => {
    const {btcPrice} = useBTCPriceContext();

    return (
        <section className='box current-price flex-column' aria-live='polite'>
            <h3>Current price:</h3>
            <span className='box-value'>{btcPrice}</span>
        </section>
    )
}