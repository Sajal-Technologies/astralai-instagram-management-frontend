import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../constants";

function MessagesBody() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const template = queryParams.get("template");
  const toUsername = queryParams.get("toUsername");

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [messageTemplates, setMessageTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClickTemplate = (templateId, messageText) => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("template") === templateId.toString()) {
      params.delete("template");
    } else {
      params.set("template", templateId);
    }
    if (params.get("messageText") === messageText.toString()) {
      params.delete("messageText");
    } else {
      params.set("messageText", messageText);
    }
    navigate({ search: params.toString() });
  };

  useEffect(() => {
    axios
      .post(
        `${baseUrl}/api/get-message-template/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((response) => {
        setMessageTemplates(response.data.Message_template_data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching message templates:", error);
        setLoading(false);
        setError("Failed to fetch message templates");
      });
  }, []);

  const handleClickLead = (username) => {
    if (!username) {
      setError("Username cannot be empty");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.set("toUsername", JSON.stringify([username]));
    navigate({ search: params.toString() });
  };

  if (loading) {
    return (
      <div className="grow sm:px-6 md:px-5 py-6 flex justify-center items-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-[-webkit-fill-available] flex justify-center items-center">
      <div>
        {toUsername && (
          <div className="text-center bg-[#6366f1] text-white p-2">
            Message Templates
          </div>
        )}

        <div className="grow sm:px-6 md:px-5 py-6">
          {!toUsername && (
            <div className="rounded-lg flex justify-center items-center">
              <div
                className={`w-[50%] bg-white shadow-lg rounded-sm border border-slate-200`}
              >
                <div className="flex flex-col h-full">
                  <div className="grow p-5">
                    <div className="flex justify-between items-start">
                      <header>
                        <div className="flex mb-2">
                          <div className="mt-1 pr-1">
                            <div className="flex flex-col text-slate-800 hover:text-slate-900">
                              <h2 className="text-xl leading-snug justify-center font-semibold">
                                Select lead or enter username to send message
                              </h2>
                            </div>
                          </div>
                        </div>
                      </header>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm">
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                          placeholder="Enter username"
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setError("");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-200">
                    <div className="flex divide-x divide-slate-200">
                      <button
                        className="block flex-1 text-center text-sm text-indigo-500 hover:text-indigo-600 font-medium px-3 py-4"
                        onClick={() => handleClickLead(username)}
                      >
                        Send Message
                      </button>
                    </div>
                    {error && (
                      <p className="mt-2 text-red-500 text-sm text-center mb-2">
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {toUsername && (
            <div>
              {messageTemplates.map((item) => (
                <div
                  key={item["Message Template id"]}
                  className="flex items-start mb-4 last:mb-0 cursor-pointer"
                  onClick={() =>
                    handleClickTemplate(item["Message Template id"], item["Template Content"])
                  }
                >
                  <div>
                    <div
                      className={`text-sm text-slate-800 p-3 rounded-lg rounded-tl-none border border-slate-200 shadow-md mb-1 fixed-height ${
                        template === item["Message Template id"].toString()
                          ? "bg-[#6366f1] text-white"
                          : "bg-white"
                      }`}
                    >
                      {item["Template Content"]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesBody;
