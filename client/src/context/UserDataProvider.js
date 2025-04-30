import { createContext, useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UserDataContext = createContext({});

export const UserDataProvider = ({ children }) => {
    const [listGroup, setListGroup] = useState([]);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        async function fetchGroups() {
            axiosPrivate.get('/api/group/owned').then((res) => {
                setListGroup(res.data);
            }).catch(() => {

            })
        }
        fetchGroups();
    }, [axiosPrivate]);

    return (
        <UserDataContext.Provider value={{ listGroup, setListGroup }}>
            {children}
        </UserDataContext.Provider>
    )
}

export default UserDataContext;