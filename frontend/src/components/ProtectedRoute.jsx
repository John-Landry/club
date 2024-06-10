// This will be a wrapper For a protected route, you'll need an access token to get into this route
//we will wrap the vaairiable childern
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

//  Will check to see if they have an access token if they don't will redirect them to login
function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    //  as soon as we load a protected route We will go to the auth function
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])
    //  this is going to refresh the token automatically
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            // I know send a request to my backend with a refresh token to get a new access token
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            // If my response is successful 
            if (res.status === 200) {
                // set new access token
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };
    //  this checks, if we need to refresh the token or if we are ready to go
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        // If you don't have a token, you get set to false
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        // I've got to decode the token and find out what the expiration date is
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        // date in seconds, not in milliseconds
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };
    //  because until I have some state that is not null I am checking the tokens
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }
    // if we are authorized we will be wrapped, otherwise we return to login
    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;