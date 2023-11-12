import {applyMiddleware, combineReducers, createStore} from "redux";
import userReducer from "./userReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";


const rootReducer = combineReducers({
    user: userReducer
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
