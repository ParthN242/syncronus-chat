import React from "react";
import Skeleton from "react-loading-skeleton";

const ChatLoading = () => {
  return (
    <div className="flex h-[100vh] relative">
      <div className="w-full pt-20 px-5 relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] overflow-auto">
        <div className="w-full ">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} height={50} className="mb-4" />
            ))}
        </div>
      </div>
      <div className="p-6 fixed top-0 h-full w-full flex flex-col md:static flex-1 bg-[#1c1d25] text-white">
        <Skeleton height={60} />
        <div className="flex-1 flex flex-col items-end pt-5">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                height={50}
                className="mb-4"
                width={100}
                containerClassName="bolck"
              />
            ))}
        </div>
        <Skeleton height={60} />
      </div>
    </div>
  );
};

export default ChatLoading;
