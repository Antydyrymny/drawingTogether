import { Button, Image } from 'react-bootstrap';
import leave from '../../assets/leave.png';
import styles from './leave.module.scss';

function Leave({ onClick }: { onClick: () => void }) {
    return (
        <Button
            onClick={onClick}
            variant='danger'
            className={`${styles.wrapper} d-flex justify-content-between align-items-center`}
        >
            <div>
                Leave room
                <Image src={leave} className={styles.image} />
            </div>
        </Button>
    );
}

export default Leave;
