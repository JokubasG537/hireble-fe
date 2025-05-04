import React, { createContext, useReducer, useEffect, Dispatch, ReactNode } from "react";


const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};


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

// Ensure user has role from token
const ensureUserRole = (user: User | null, token: string | null): User | null => {
  if (!user || !token) return user;

  // If user already has role, return as is
  if (user.role) return user;

  // Try to extract role from token
  const decodedToken = decodeJWT(token);
  if (decodedToken && decodedToken.role) {
    return {
      ...user,
      role: decodedToken.role
    };
  }

  return user;
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "LOGIN":
      const tokenPayload = decodeJWT(action.payload.token);
      const userWithRole = {
        ...action.payload.user,
        role: action.payload.user.role || tokenPayload?.role
      };

      localStorage.setItem("user", JSON.stringify(userWithRole));
      localStorage.setItem("token", action.payload.token);

      return {
        user: userWithRole,
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
    const token = localStorage.getItem("token");
    let user = JSON.parse(localStorage.getItem("user") || "null");

    if (user && token) {
      // Ensure user has role from token if missing
      user = ensureUserRole(user, token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "LOGIN", payload: { user, token } });
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
