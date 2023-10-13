import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Form,
    FloatingLabel,
    InputGroup,
    Button,
    Card,
    Image,
    Spinner,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useGetAllRoomsQuery, useCreateRoomMutation } from '../../app/services/api';
import { blankImg } from '../../assets/blankImg';
import { userNameKey } from '../../data/localStorageKeys';
import styles from './roomPicker.module.scss';

function RoomPicker() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(
        () => localStorage.getItem(userNameKey) || ''
    );
    const { data: allRooms, isLoading, isSuccess } = useGetAllRoomsQuery();
    const [createRoom, { isLoading: isCreating, isSuccess: isCreated }] =
        useCreateRoomMutation();

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const roomId = await createRoom(userName || undefined).unwrap();
            if (userName) saveNameToLocalStorage(userName);
            navigate(`/room/${roomId}`);
        } catch (error) {
            toast.error('Error creating new room');
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
        saveNameToLocalStorage(e.target.value);
    };

    return (
        <Container className='vh-100 pt-5'>
            <Row className='d-flex justify-content-center '>
                <Col lg={6}>
                    <Form onSubmit={handleCreate} className='lg-4'>
                        <InputGroup className='mb-3'>
                            <FloatingLabel label='Enter your name / get a random one'>
                                <Form.Control
                                    placeholder='Enter your name / get a random one'
                                    value={userName}
                                    onChange={handleNameChange}
                                />
                            </FloatingLabel>
                            <Button
                                type='submit'
                                disabled={isCreating || isCreated}
                                variant='primary'
                                size='sm'
                            >
                                Create new room
                            </Button>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
            {isLoading && <Spinner />}
            {isSuccess && (
                <Card className={`${styles.gallery} shadow p-2`}>
                    <Row className='p-2 '>
                        {allRooms.map((room) => (
                            <Col key={room.id} md={5} lg={4} className='gap-1 '>
                                <Card.Body className='mb-5 '>
                                    <div
                                        onClick={() => {
                                            if (userName)
                                                saveNameToLocalStorage(userName);
                                            navigate(`/room/${room.id}`);
                                        }}
                                        className={`${styles.galleryItem}`}
                                    >
                                        <Image
                                            src={room.image || blankImg}
                                            className={styles.img}
                                            thumbnail
                                        />
                                        <p>{room.roomName}</p>
                                        <p>Number of users: {room.userNumber}</p>
                                    </div>
                                </Card.Body>
                            </Col>
                        ))}
                    </Row>
                </Card>
            )}
        </Container>
    );
}

const saveNameToLocalStorage = (name: string) => {
    localStorage.setItem(userNameKey, name);
};

export default RoomPicker;
