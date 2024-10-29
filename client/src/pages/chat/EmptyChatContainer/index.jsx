import React from "react";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "../../../lib/utils";

const EmptyChatContainer = () => {
  return (
    <div className="hidden flex-1 md:flex items-center justify-center md:bg-[#1c1d25] text-white/80">
      <div className="flex items-center justify-center flex-col h-full gap-5">
        <Lottie
          isClickToPauseDisabled={true}
          width={200}
          height={200}
          options={animationDefaultOptions}
        />
        <div className="text-xl lg:text-4xl mt-5  ">
          <h3 className="poppins-medium text-opacity-80">
            Hi<span className="text-purple-500">!</span> Welcome to{" "}
            <span className="text-purple-500">Syncronus </span>
            Chat .
          </h3>
        </div>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
