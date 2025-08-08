import { publicRequest } from "../requestMethods";
import { loginFailure, loginStart, loginSuccess } from "./userRedux"; // Make sure it's userSlice, not userRedux

// Login function that dispatches redux actions
export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailure());
    console.error("Login failed:", error);
  }
};
