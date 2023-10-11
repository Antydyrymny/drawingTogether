import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, ButtonGroup, ToggleButton, Image } from 'react-bootstrap';
import { GithubPicker } from 'react-color';
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
import styles from './drawingBoard.module.scss';

function DrawingBoard() {
    const [color, setColor] = useState('#000');
    const [tool, setTool] = useState<CtxMode>('line');

    const handleToolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTool(e.target.value as CtxMode);
    };

    const location = useLocation();
    const [joinRoom, joiningStatus] = useJoiningRoomMutation();
    const { data: users, isSuccess } = useSubscribeToRoomUsersQuery();
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
            emitMouseMove({ userId: '1', x: e.clientX, y: e.clientY });
        }
        // !-----------------------------------------------------
        const onMouseMoveThrottled = throttle<MouseEvent>(onMouseMove, 300);
        window.addEventListener('mousemove', onMouseMoveThrottled);

        () => window.removeEventListener('mousemove', onMouseMoveThrottled);
    });

    return (
        <Container className='vh-100 pt-2 d-flex justify-content-center align-items-center'>
            {isSuccess &&
                users.map((user) => <Cursor name={user.name} x={user.x} y={user.y} />)}
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
                <canvas height={600} width={600} className='bg-light'></canvas>
            </div>
        </Container>
    );
}

export default DrawingBoard;
