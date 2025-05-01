import React, { createContext, useReducer, useEffect, Dispatch, ReactNode } from "react";

// User type including role
export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "recruiter" | "admin";
}

interface UserState {
  user: User | null;
  token: string | null;
}

type UserAction =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User };

const initialState: UserState = {
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return { user: null, token: null };
    case "UPDATE_USER":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

interface UserContextProps extends UserState {
  dispatch: Dispatch<UserAction>;
}

export const UserContext = createContext<UserContextProps>({
  ...initialState,
  dispatch: () => undefined,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (user && token) {
      dispatch({ type: "LOGIN", payload: { user, token } });
    }
  }, []);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
