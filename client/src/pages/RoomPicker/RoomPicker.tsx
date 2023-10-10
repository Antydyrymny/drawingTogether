import { Link } from 'react-router-dom';
import { useGetAllRoomsQuery } from '../../app/services/api';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

function RoomPicker() {
    const { data: allRooms, isLoading, isSuccess } = useGetAllRoomsQuery();
    console.log(allRooms);
    return (
        <>
            <Link to={`/`}>Join room</Link>
            {isLoading && <LoadingSpinner />}
            {isSuccess && (
                <div>
                    {allRooms.map((room) => (
                        <div key={room.id}>
                            {room.id}
                            <br />
                            {room.userNumber}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default RoomPicker;
