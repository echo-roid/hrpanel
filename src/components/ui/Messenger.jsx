import React from "react";
import { FiSearch, FiMoreVertical, FiSend } from "react-icons/fi";
import { HiOutlinePaperClip } from "react-icons/hi";
import { IoMdMic } from "react-icons/io";
import plusBlue  from "../../assets/pluscircle.png"
import searchbar  from "../../assets/searchbar.png"
import dot  from "../../assets/threedot.svg"
import pindown  from "../../assets/pindown.svg"
import ad  from "../../assets/arrowd.png"

const ChatApp = () => {
    return (
        <>
       
        <h2 className="text-2xl font-bold mb-5  text-[36px]">Messenger</h2>
        <div className="flex h-screen bg-[#f6fafd] shadow rounded-xl overflow-hidden">
            {/* Sidebar */}
            <div className="w-[300px] border-r bg-white  flex flex-col ">
                <div className="flex justify-between items-center mb-4 p-4 border-b">
                    <h2 className="text-lg font-semibold">Conversations</h2>
                    <div className="flex gap-3 items-center">
                        <img src={searchbar} alt="searchbar" className="w-10 h-10" />
                        <img src={plusBlue} alt="plusBlue" className="w-8 h-8" />
                    </div>
                   
                </div>
               

                <div className="overflow-auto scrollbar-hide p-4">
                    <div className="text-xs font-semibold mb-2 text-[#3F8CFF] flex gap-2 items-center"><img src={ad} alt="downa" />Groups</div>
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between bg-[#F4F9FD] relative p-2 rounded-xl activetabbar2    ">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-green-100 rounded-full" ></div>
                                <div>
                                    <p className="text-sm font-medium">Medical App Team</p>
                                    <p className="text-[11px] text-gray-500">Candice: Hi guys! We shared you...</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">12:04</span>
                        </div>

                        <div className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full" />
                                <div>
                                    <p className="text-sm font-medium">Food Delivery Service</p>
                                    <p className="text-xs text-gray-500">Olive: Hi guys! We shared you...</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">12:04</span>
                        </div>
                    </div>

                    <div className=" text-xs font-semibold mb-2 text-[#3F8CFF] flex gap-2 items-center"><img src={ad} alt="downa" />Direct Messages</div>
                    <div className="space-y-3">
                        {["Garrett Watson", "Caroline Santos", "Leon Nunez", "Oscar Holloway", "Ralph Harris"].map((name, i) => (
                            <div className="flex items-center justify-between" key={i}>
                                <div className="flex items-center gap-2 p-2">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    <div>
                                        <p className="text-sm font-medium">{name}</p>
                                        <p className="text-xs text-gray-500">Hi! Please, change the status...</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">12:04</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Header */}
                <div className="flex items-center justify-between bg-white p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                        <div>
                            <h3 className="font-semibold">Oscar Holloway</h3>
                            <p className="text-xs text-gray-500">UI/UX Designer</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                    <img src={pindown} alt="pindown" className="w-10 h-10" />
                        <img src={searchbar} alt="searchbar" className="w-10 h-10" />
                        <img src={dot} alt="dot" className="w-10 h-10" />
                   
                    </div>
                </div>

                {/* Date */}
                <div className="text-center py-2 text-sm text-gray-500">Friday, September 8</div>

                {/* Messages */}
                <div className="flex-1 overflow-auto p-4 space-y-6">
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600 flex gap-3 mb-8">
                        <div className="w-10 h-10 bg-green-100 rounded-full" ></div>
                            <div>
                            <b>Olive Dixon</b> 12:04 AM
                            <p className="mt-1">
                                Hi, Evan! Nice to meet you too
                                <br />
                                I will send you all the files I have for this project. After that, we can call and discuss. I will answer all your questions! OK?
                            </p>
                            </div>
                           
                        </div>
                        <div className="text-sm text-gray-600 flex gap-3 ">
                        <div className="w-10 h-10 bg-green-100 rounded-full " ></div>
                            <div className="mb-8">
                            <b>You</b> 12:15 AM
                            <p className="mt-1">
                                Hi, Oscar! Nice to meet you
                                <br />
                                We will work with new project together
                            </p>
                            </div>
                          
                        </div>
                        <div className="text-sm text-gray-600 flex gap-3 ">
                        <div className="w-10 h-10 bg-green-100 rounded-full" ></div>
                                <div>
                                <b>Olive Dixon</b> 12:04 AM
                                <p className="mt-1">Hi! Please, change the status in this task</p>
                                </div>
                          
                        </div>
                
                    </div>
                </div>

                {/* Chat Input */}
                <div className="flex items-center gap-3 border-t bg-white p-3">
                    <HiOutlinePaperClip className="text-gray-500 w-5 h-5 cursor-pointer" />
                    <input
                        type="text"
                        placeholder="Type your message here..."
                        className="flex-1 border-none focus:outline-none text-sm"
                    />
                    <FiSend className="text-blue-500 w-5 h-5 cursor-pointer" />
                </div>
            </div>
        </div>
        </>
       
    );
};

export default ChatApp;
