import { useBTCPriceContext } from '../../hooks/useBTCPriceContext.tsx';

export const CurrentPrice = () => {
    const {btcPrice} = useBTCPriceContext();

    return (
        <section className='box current-price flex-column' aria-live='polite'>
            <h3 className='box__header'>Current price:</h3>
            {btcPrice && <span className='box__value'>{btcPrice}</span>}
        </section>
    )
}