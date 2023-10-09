import styles from './LoadingSpinner.module.scss';

type LoadingSpinnerProps = {
    color?: 'white' | 'black';
    centered?: boolean;
    inline?: boolean;
};

function LoadingSpinner({
    color = 'white',
    centered = false,
    inline = false,
}: LoadingSpinnerProps) {
    return (
        <div
            className={`${styles.ldsRoller} ${styles[color]} ${
                centered ? styles.centered : null
            } ${inline ? styles.inline : null}`}
        >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

export default LoadingSpinner;
