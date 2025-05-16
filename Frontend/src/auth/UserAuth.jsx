import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../context/user.context';
import { useNavigate } from 'react-router-dom';

const UserAuth = ({ children }) => {
    const { user } = useContext(userContext);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (user) {
            setIsLoading(false);
        }
    }, [user, navigate]);

    if (isLoading) {

        navigate('/login');
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default UserAuth;