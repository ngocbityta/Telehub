import React, { useState, useMemo } from "react";
import { IoTrashSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert';
import { useChatContext } from "stream-chat-react";

import GroupModal from "./GroupModal";

const GroupBox = ({ group, onDeleteGroup, onEditGroup }) => {
    const [openEdit, setOpenEdit] = useState(false);

    const { client, setActiveChannel } = useChatContext();
    const channel = useMemo(async () => {
        const foundChannels = await client.queryChannels({ cid: { $eq: group.cid } });
        return foundChannels[0];
    }, [group.cid, client]);

    async function goToChat() {
        const resolvedChannel = await channel;
        // console.log(resolvedChannel);
        setActiveChannel(resolvedChannel);
    }

    const deleteConfirm = () => {
        confirmAlert({
            closeOnEscape: true,
            closeOnClickOutside: true,
            customUI: ({ onClose }) => {
                return (
                    <div className="bg-[rgba(39,38,38,0.1)] fixed inset-0 flex items-center justify-center ">
                        <div className="bg-white p-6 rounded-lg max-w-md w-full">
                            <h1 className="text-xl text-black font-bold mb-4">{`Delete group: ${group.groupName}`}</h1>
                            <p className="text-gray-600 mb-6">Every messages, files, audios in the conversation will be deleted.</p>
                            <div className="flex justify-end">
                                <button
                                    className="mr-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-white"
                                    onClick={onClose}
                                >
                                    No
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    onClick={() => {
                                        onDeleteGroup(group.cid);
                                        onClose();
                                    }}
                                >
                                    Yes, confirm delete
                                </button>
                            </div>
                        </div>
                    </div>
                );
            },
        });
    }

    return (
        <div className="relative">
            {/* Container */}
            <div onClick={goToChat}
                className="mt-10 hover:bg-[var(--group-hover-bg)] w-[310px] h-[100px] rounded-lg shadow  bg-[var(--group-bg)] 
            hover:cursor-pointer transform transition duration-500 ease-in-out hover:translate-y-[-3px]">
                <div className="pt-[20px] px-[20px] flex items-center justify-between">
                    <p className=" text-[var(--group-text)] text-[17px] font-bold truncate max-w-[100px]" > {group.groupName} </p>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        setOpenEdit(true)
                    }}  > <FaRegEdit color="#356afc" size={20} /> </button>
                </div>

                <div className="h-[40px] pt-[20px] px-[20px] flex items-center justify-between">
                    <div className="flex items-center">
                        {
                            group.members.slice(0, 5).map((member, id) => {
                                return (
                                    <div key={id} className="inline-block mr-[-0.6rem]">
                                        <img className="w-6 h-6 rounded-full border border-white object-cover" src={member.image} alt="" />
                                    </div>
                                );
                            })
                        }
                        {group.members.length > 5 &&
                            (<div className="inline-block">
                                <div className="w-6 h-6 rounded-full border border-white bg-[#1273EB] text-white 
                                text-[12px] text-center font-bold flex justify-center items-center">+{group.members.length - 5}</div>
                            </div>)
                        }
                    </div>
                    <div className="space-x-4">
                        <button onClick={(e) => {
                            e.stopPropagation();
                            deleteConfirm()
                        }} className="mr-0.5"> <IoTrashSharp color="#ff6666" size={20} /> </button>
                    </div>
                </div>
                {/* Group Image */}
                <img className="w-10 h-10 rounded-full object-cover absolute top-[-20px] left-[20px] "
                    src={group.image}
                    alt="" />
            </div>
            {openEdit && <GroupModal toggleModal={setOpenEdit} status={"Edit"}
                editGroup={group} onEditGroup={onEditGroup} />}
        </div>
    )
}

export default GroupBox