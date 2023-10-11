import { Image } from 'react-bootstrap';
import cursor from '../../assets/cursor.png';
import styles from './cursor.module.scss';

type CursorProps = {
    name: string;
    x: number;
    y: number;
};

function Cursor({ name, x, y }: CursorProps) {
    return (
        <div
            className={styles.wrapper}
            style={{ top: y.toString() + 'px', left: x.toString() + 'px' }}
        >
            <div className={styles.name}>{name}</div>
            <Image src={cursor} />
        </div>
    );
}

export default Cursor;
