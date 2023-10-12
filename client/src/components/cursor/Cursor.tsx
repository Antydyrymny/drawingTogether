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
            style={{ top: y.toString() + '%', left: x.toString() + '%' }}
        >
            <div className={styles.name}>{name}</div>
            <Image src={cursor} className={styles.img} />
        </div>
    );
}

export default Cursor;
