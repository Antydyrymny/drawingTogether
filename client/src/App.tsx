import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const LazyRoomPicker = React.lazy(() => import('./pages/RoomPicker/RoomPicker'));
const LazyDrawingBoard = React.lazy(() => import('./pages/DrawingBoard/DrawingBoard'));

function App() {
    return (
        <Suspense fallback={<Spinner />}>
            <Routes>
                <Route path='/' element={<LazyRoomPicker />} />
                <Route path='/room/:roomId' element={<LazyDrawingBoard />} />
                <Route path='*' element={<Navigate to={'/'} replace />} />
            </Routes>
        </Suspense>
    );
}

export default App;
