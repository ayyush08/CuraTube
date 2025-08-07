
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ServerState {
    serverReady: boolean
}

const initialState: ServerState = {
    serverReady: false,
}

const serverSlice = createSlice({
    name: 'server',
    initialState,
    reducers: {
        setServerReady(state, action: PayloadAction<boolean>) {
            state.serverReady = action.payload
        },
        },
})

export const { setServerReady } = serverSlice.actions
export default serverSlice.reducer