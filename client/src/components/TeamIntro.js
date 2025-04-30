import React, { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";

function TeamIntro({ inLoginPage }) {
  const [avatarsVisible, setAvatarsVisible] = useState(() => (inLoginPage ? false : true));
  const [logoScale, setLogoScale] = useState(() => (inLoginPage ? false : true));
  const [flippedAvatars, setFlippedAvatars] = useState(Array(3).fill(false));

  useEffect(() => {
    setLogoScale(true);
    setAvatarsVisible(true);
  }, []);

  const handleAvatarClick = (avatarIndex) => {
    setFlippedAvatars((prev) =>
      prev.map((value, index) => (index === avatarIndex ? !value : value))
    );
  };

  const membersData = [
    {
      id: "....",
      name: "Vilavouth Inthivong",
      role: "Frontend",
      imageUrl:
        "/member2.png",
    },
    {
      id: "20224864",
      name: "Trần Mạnh Khải",
      role: "Fullstack",
      imageUrl:
        "/member1.png",
    },
    {
      id: "....",
      name: "Đặng Đình Khải",
      role: "Frontend",
      imageUrl:
        "/member3.png",
    },
  ];

  return (
    <div className="bg-transparent flex flex-col justify-center items-center gap-10 mt-[150px]">
      {/* Resize logo */}
      <img
        src="/logo512.png"
        className={`w-[200px] h-[200px] drop-shadow-2xl bg-transparent 
        transition-transform transform duration-1000 ${logoScale ? "scale-150" : "scale-0"
          }`}
        alt="Logo"
      />
      {/* Avatars */}
      <div
        className={`bg-transparent flex flex-row gap-8 mt-8 transform transition-transform
         duration-1000 ${avatarsVisible ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {membersData.map((member, index) => (
          <div
            key={member.id}
            className={`avatar flex flex-col h-[250px] w-[140px] items-center justify-center transition-opacity duration-1000 
            text-white font-bold gap-0 ${avatarsVisible ? "opacity-100" : "opacity-0"} `}
          >
            <div className="hover:-translate-y-1 hover:scale-110 hover:brightness-110 duration-500 w-24 h-24
             rounded-full ring brightness-90 border-white border-2">
              <div
                className={`relative w-full h-full`}
              >
                <ReactCardFlip isFlipped={flippedAvatars[index]} flipDirection="vertical"
                  containerClassName="absolute w-full h-full rounded-full bg-transparent hover:cursor-pointer"
                >
                  {/* Front face */}
                  <img onClick={() => handleAvatarClick(index)}
                    src={member.imageUrl}
                    alt={`Avatar ${member.id}`}
                    className="w-full h-full rounded-full object-top"
                  />

                  {/* Back face */}
                  <div onClick={() => handleAvatarClick(index)}
                    className={`w-full h-full flex items-center justify-center bg-transparent 
                  text-white text-center`}
                  >
                    <span className="block">{member.role}</span>
                  </div>
                </ReactCardFlip>
              </div>
            </div>
            {/* Member information */}
            <div className="mt-3 text-[14px] w-full text-center">
              <span >{member.name}</span><br></br>
              <span>{member.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamIntro;
