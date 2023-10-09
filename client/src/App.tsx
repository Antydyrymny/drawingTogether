import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

const LazyRoomPicker = React.lazy(() => import('./pages/RoomPicker/RoomPicker'));
const LazyDrawingBoard = React.lazy(() => import('./pages/DrawingBoard/DrawingBoard'));

function App() {
    return (
        <Suspense fallback={<LoadingSpinner color='black' />}>
            <Routes>
                <Route path='/' element={<LazyRoomPicker />}>
                    <Route path=':room' element={<LazyDrawingBoard />} />
                </Route>
                <Route path='*' element={<Navigate to={'/'} replace />} />
            </Routes>
        </Suspense>
    );
}

export default App;
