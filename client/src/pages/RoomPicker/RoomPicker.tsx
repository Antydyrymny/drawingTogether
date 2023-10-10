import { useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import getSocket from '../../app/services/getSocket';
import { Link } from 'react-router-dom';

function RoomPicker() {
    const socket = getSocket();
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        const onAns = (val: string) => setAnswer(val);
        socket.on('answer', onAns);

        return () => {
            socket.off('answer', onAns);
        };
    }, [socket]);

    return (
        <>
            <Link to={`/${nanoid}`} onClick={() => socket.connect()}>
                Join room
            </Link>
            <button onClick={() => socket.emit('ask', 'myQuestion')}>Ask</button>
            <div>{answer}</div>
        </>
    );
}

export default RoomPicker;
