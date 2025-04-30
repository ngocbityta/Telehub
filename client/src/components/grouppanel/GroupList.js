import React from "react";
import GroupBox from "./GroupBox";
import useUserData from "../../hooks/useUserData";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const GroupList = () => {

    const { listGroup, setListGroup } = useUserData();
    const axiosPrivate = useAxiosPrivate();

    const handleDeleteGroup = async (cid) => {
        axiosPrivate.delete(`/api/group/${cid}`).then(() => {
            const newListGroup = listGroup.filter((group) => group.cid !== cid)
            setListGroup(newListGroup)
        }).catch(e => {

        });
    }

    const handleEditGroup = async (editedGroup) => {
        const index = listGroup.findIndex(group => group.cid === editedGroup.cid);
        if (index !== -1) {
            // Create a new array with the edited group replacing the old one
            const updatedList = [...listGroup];
            updatedList[index] = editedGroup;
            setListGroup(updatedList);
        } else {
            console.error("Edited group not found in the list");
        }
    }

    return (
        <div className="py-0 flex flex-col overflow-hidden max-h-[500px]">
            <div className="overflow-auto">
                {
                    listGroup.map(group => (
                        <GroupBox key={group._id} group={group}
                            onDeleteGroup={handleDeleteGroup} onEditGroup={handleEditGroup} />
                    ))
                }
            </div>
        </div>
    );
}

export default GroupList