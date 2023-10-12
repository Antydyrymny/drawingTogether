import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, ButtonGroup, ToggleButton, Image } from 'react-bootstrap';
import { GithubPicker } from 'react-color';
import Canvas from './Canvas';
import Cursor from '../../components/cursor/Cursor';
import Leave from '../../components/leave/Leave';
import {
    useJoiningRoomMutation,
    useSubscribeToRoomUsersQuery,
    useMoveMouseMutation,
    useLeaveRoomMutation,
} from '../../app/services/api';
import { throttle } from '../../utils/throttle';
import { userNameKey } from '../../data/localStorageKeys';
import brush from '../../assets/brush.png';
import rect from '../../assets/square.png';
import eraser from '../../assets/eraser.png';
import type { CtxMode } from '../../utils/types';

function DrawingBoard() {
    const [color, setColor] = useState('#000');
    const [tool, setTool] = useState<CtxMode>('line');
    const handleToolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTool(e.target.value as CtxMode);
    };

    const location = useLocation();
    const [joinRoom, { data: userId, isSuccess: roomIsReady }] = useJoiningRoomMutation();
    const { data: users, isSuccess: subscribed } = useSubscribeToRoomUsersQuery(
        undefined,
        {
            skip: !roomIsReady,
        }
    );
    const [emitMouseMove] = useMoveMouseMutation();
    const [leaveRoom] = useLeaveRoomMutation();

    const navigate = useNavigate();
    const handleLeave = useCallback(() => {
        leaveRoom();
        navigate('/');
    }, [leaveRoom, navigate]);

    useEffect(() => {
        const userName = localStorage.getItem(userNameKey) ?? undefined;
        const roomId = location.pathname.split('/').slice(-1)[0];

        joinRoom({ roomId, userName });
    }, [joinRoom, location.pathname]);

    useEffect(() => {
        function onMouseMove(e: MouseEvent) {
            if (!userId) return;

            emitMouseMove({
                userId: userId,
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        }
        const onMouseMoveThrottled = throttle<MouseEvent>(onMouseMove, 75);

        window.addEventListener('mousemove', onMouseMoveThrottled);

        return () => window.removeEventListener('mousemove', onMouseMoveThrottled);
    }, [emitMouseMove, userId]);

    return (
        <Container className='vh-100 pt-2 d-flex justify-content-center align-items-center'>
            {subscribed &&
                users.map((user) => (
                    <Cursor key={user.id} name={user.name} x={user.x} y={user.y} />
                ))}
            <Cursor name={'DaKing'} x={20} y={50} />
            <Leave onClick={handleLeave} />
            <div>
                <div className='mb-3 d-flex justify-content-center '>
                    <ButtonGroup>
                        <ToggleButton
                            className='d-flex justify-content-center align-items-center'
                            id='line'
                            value={'line'}
                            type='radio'
                            variant='danger'
                            checked={tool === 'line'}
                            onChange={handleToolChange}
                        >
                            <Image src={brush} />
                        </ToggleButton>
                        <GithubPicker
                            color={color}
                            onChange={(e) => setColor(e.hex)}
                            width='215px'
                            triangle='hide'
                        />
                        <ToggleButton
                            className='d-flex justify-content-center align-items-center'
                            id='rect'
                            value={'rect'}
                            type='radio'
                            checked={tool === 'rect'}
                            onChange={handleToolChange}
                        >
                            <Image src={rect} />
                        </ToggleButton>
                        <ToggleButton
                            className='d-flex justify-content-center align-items-center'
                            id='erase'
                            value={'erase'}
                            type='radio'
                            checked={tool === 'erase'}
                            onChange={handleToolChange}
                        >
                            <Image src={eraser} />
                        </ToggleButton>
                    </ButtonGroup>
                </div>
                <Canvas options={{ color, mode: tool }} roomIsReady />
            </div>
        </Container>
    );
}

export default DrawingBoard;
