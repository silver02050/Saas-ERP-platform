import React from "react";

const Card = ({ color, title, timeFrame, value }) => {
  return (
    <div className={` ${color ? `bg-${color}` : "bg-gray-400"} border-[1px] mb-2  min-w-60 max-w-96 flex flex-grow flex-col items-center border-[#fff0.3] p-3 pt-2 rounded-lg`}>
      <span
        id="title"
        className="w-full text-center text-2xl py-2 mb-1 font-semibold border-b-[1px] mix-blend-lighten text-background border-background"
      >
        {title ? title : "untitled"}
      </span>

      <div className="w-full h-full flex items-center ">
        <span className="h-full w-[30%] border-r-[1px] text-lg flex pr-1 justify-center items-center border-background font-medium text-background">
          {timeFrame ? timeFrame : "unspecified"}
        </span>
        <span className="h-full flex pl-3 text-lg justify-center items-center font-medium text-background">
          {value ? value.toLocaleString() : 0}
        </span>
      </div>
    </div>
  );
};

export default Card;
