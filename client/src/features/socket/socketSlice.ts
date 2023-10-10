// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../app/store';
// import apiSlice from '../../app/services/api';
// import { socket } from '../../socket/socket';

// type RoomState = {
//     connected: boolean;
//     message: string;
// };

// const initialState: RoomState = { connected:false, message: '' };

// const roomSlice = createSlice({
//     name: 'room',
//     initialState,
//     reducers: {
//         connectToRoom: (state, action: PayloadAction<Authenticated>) => {
//             state.user = action.payload.user;
//             state.token = action.payload.token;
//         },
//         connect: (state) => {
//             state.connected = true;
//         }
//     },
//     extraReducers: (builder) => {
//         builder.addMatcher(
//             apiSlice.endpoints.getRoomData.matchFulfilled, (state, action) => {
//                 state.
//             }
//         );
//     },
// });

// export default authSlice.reducer;

// export const { storeAuth, clearAuth } = authSlice.actions;

// export const selectCurrentUser = (state: RootState) => state.auth.user;
