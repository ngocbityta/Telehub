import { useState } from "react";
import GroupModal from "./GroupModal";

function CreateBox({ onCreateGroup }) {
    const [openModal, setOpenModal] = useState(false);

    return (
        <div>
            <div className="bg-[var(--page-bg)] w-[324px] h-[100px] flex justify-center items-center rounded-lg shadow-md">
                <button onClick={() => { setOpenModal(true) }}
                    className="text-white bg-blue-500 w-[260px] h-[40px] font-bold "
                    style={{borderRadius: "5px"}}>
                    Create Group
                </button>
            </div>
            {openModal && <GroupModal toggleModal={setOpenModal} status={"Create"} onCreateGroup={onCreateGroup} />}

        </div>
    )
}

export default CreateBox;
