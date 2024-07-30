export interface ScoreProps {
    score?: number;
}

export const Score = ({score}: ScoreProps) => {
    return (
        <p>Score: {score ?? 0}</p>
    );
}