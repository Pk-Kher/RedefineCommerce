import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const MyNotification = ({ setUserId, setFormSubmit }) => {
  const [comments, setComments] = useState(true);
  const [messages, setMessages] = useState(true);
  const [mentions, setMentions] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    setUserId(id);
  }, [id, setUserId]);
  useEffect(() => {
    setFormSubmit(null);
  }, [setFormSubmit]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl text-gray-800 font-bold mb-5">
        My Notifications
      </h2>

      {/* General */}
      <section>
        <h3 className="text-xl leading-snug text-gray-800 font-bold mb-1">
          General
        </h3>
        <ul>
          <li className="flex justify-between items-center py-3 border-b border-gray-200">
            {/* Left */}
            <div>
              <div className="text-gray-800 font-semibold">
                Comments and replies
              </div>
              <div className="text-sm">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit.
              </div>
            </div>
            {/* Right */}
            <div className="flex item-center ml-4">
              <div className="w-16 relative">
                <input
                  type="checkbox"
                  id="comments"
                  className="sr-only"
                  checked={comments}
                  onChange={() => setComments(!comments)}
                />
                <label
                  className={`text-gray-500 lef text-center h-7 cursor-pointer flex items-center justify-center rounded leading-5 bg-green-600 ${comments ? "bg-green-600" : "bg-slate-600"
                    }`}
                  htmlFor="comments"
                >
                  <span
                    className={`bg-white shadow-sm w-6 h-6 transition-all absolute rounded ${comments ? "left-[38px]" : "left-0.5"
                      }`}
                    aria-hidden="true"
                  ></span>
                  <span
                    className={`text-white text-xs inline-block absolute right-2 ${comments ? "opacity-0" : "opacity-100"
                      }`}
                  >
                    {comments ? "ON" : "OFF"}
                  </span>
                  <span
                    className={`text-white text-xs inline-block absolute left-2 ${comments ? "opacity-1" : "opacity-0"
                      }`}
                  >
                    {comments ? "ON" : "OFF"}
                  </span>
                </label>
              </div>
            </div>
          </li>
          <li className="flex justify-between items-center py-3 border-b border-gray-200">
            {/* Left */}
            <div>
              <div className="text-gray-800 font-semibold">Messages</div>
              <div className="text-sm">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit.
              </div>
            </div>
            {/* Right */}
            <div className="flex item-center ml-4">
              <div className="w-16 relative">
                <input
                  type="checkbox"
                  id="messages"
                  className="sr-only"
                  checked={messages}
                  onChange={() => setMessages(!messages)}
                />
                <label
                  className={`text-gray-500 lef text-center h-7 cursor-pointer flex items-center justify-center rounded leading-5 bg-green-600 ${messages ? "bg-green-600" : "bg-slate-600"
                    }`}
                  htmlFor="messages"
                >
                  <span
                    className={`bg-white shadow-sm w-6 h-6 transition-all absolute rounded ${messages ? "left-[38px]" : "left-0.5"
                      }`}
                    aria-hidden="true"
                  ></span>
                  <span
                    className={`text-white text-xs inline-block absolute right-2 ${messages ? "opacity-0" : "opacity-100"
                      }`}
                  >
                    {messages ? "ON" : "OFF"}
                  </span>
                  <span
                    className={`text-white text-xs inline-block absolute left-2 ${messages ? "opacity-1" : "opacity-0"
                      }`}
                  >
                    {messages ? "ON" : "OFF"}
                  </span>
                </label>
              </div>
            </div>
          </li>
          <li className="flex justify-between items-center py-3 border-b border-gray-200">
            {/* Left */}
            <div>
              <div className="text-gray-800 font-semibold">Mentions</div>
              <div className="text-sm">
                Excepteur sint occaecat cupidatat non in culpa qui officia
                deserunt mollit.
              </div>
            </div>
            {/* Right */}
            <div className="flex item-center ml-4">
              <div className="w-16 relative">
                <input
                  type="checkbox"
                  id="mentions"
                  className="sr-only"
                  checked={mentions}
                  onChange={() => setMentions(!mentions)}
                />
                <label
                  className={`text-gray-500 lef text-center h-7 cursor-pointer flex items-center justify-center rounded leading-5 bg-green-600 ${mentions ? "bg-green-600" : "bg-slate-600"
                    }`}
                  htmlFor="mentions"
                >
                  <span
                    className={`bg-white shadow-sm w-6 h-6 transition-all absolute rounded ${mentions ? "left-[38px]" : "left-0.5"
                      }`}
                    aria-hidden="true"
                  ></span>
                  <span
                    className={`text-white text-xs inline-block absolute right-2 ${mentions ? "opacity-0" : "opacity-100"
                      }`}
                  >
                    {mentions ? "ON" : "OFF"}
                  </span>
                  <span
                    className={`text-white text-xs inline-block absolute left-2 ${mentions ? "opacity-1" : "opacity-0"
                      }`}
                  >
                    {mentions ? "ON" : "OFF"}
                  </span>
                </label>
              </div>
            </div>
          </li>
        </ul>
      </section>

      {/* Shares */}
      <section>
        <h3 className="text-xl leading-snug text-gray-800 font-bold mb-1">
          Shares
        </h3>
        <ul>
          <li className="flex justify-between items-center py-3 border-b border-gray-200">
            {/* Left */}
            <div>
              <div className="text-gray-800 font-semibold">
                Shares of my content
              </div>
              <div className="text-sm">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit.
              </div>
            </div>
            {/* Right */}
            <div className="flex items-center ml-4">
              <button className="btn-sm border-gray-200 hover:border-gray-300 shadow-sm">
                Manage
              </button>
            </div>
          </li>
          <li className="flex justify-between items-center py-3 border-b border-gray-200">
            {/* Left */}
            <div>
              <div className="text-gray-800 font-semibold">Team invites</div>
              <div className="text-sm">
                Excepteur sint occaecat cupidatat non in culpa qui officia
                deserunt mollit.
              </div>
            </div>
            {/* Right */}
            <div className="flex items-center ml-4">
              <button className="btn-sm border-gray-200 hover:border-gray-300 shadow-sm">
                Manage
              </button>
            </div>
          </li>
          <li className="flex justify-between items-center py-3 border-b border-gray-200">
            {/* Left */}
            <div>
              <div className="text-gray-800 font-semibold">
                Smart connection
              </div>
              <div className="text-sm">
                Excepteur sint occaecat cupidatat non in culpa qui officia
                deserunt mollit.
              </div>
            </div>
            {/* Right */}
            <div className="flex items-center ml-4">
              <div className="text-sm text-gray-400 italic mr-2 hidden md:block">
                Active
              </div>
              <button className="btn-sm border-gray-200 hover:border-gray-300 shadow-sm text-red-500">
                Disable
              </button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default MyNotification;
