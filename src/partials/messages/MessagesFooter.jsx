import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../constants";

function MessagesFooter() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const templateId = queryParams.get("template");
  const toUsername = queryParams.get("toUsername");
  const toName = queryParams.get("toName");

  const [message, setMessage] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!toUsername) {
      setError("Recipient username is required");
      setSuccess("");
      return;
    }

    const data = scheduledTime
      ? {
          instagram_account_id: 1,
          recipient: JSON.parse(toUsername),
          content: message || `Template message with ID: ${templateId}`,
          scheduled_time: scheduledTime,
        }
      : {
          instagram_account_id: 1,
          recipient_list: JSON.parse(toUsername),
          message_list: [[parseInt(templateId)]],
          date: "13-June-2024",
          name: "",
          company_service: "",
          company_name: "",
          address: "",
        };

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        scheduledTime ? `${baseUrl}/api/add-message/` : `${baseUrl}/api/insta_messages/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log("Message sent successfully:", response.data);
      setSuccess("Message sent successfully");
      setMessage("");
      setScheduledTime("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky bottom-0">
      <div className="flex flex-row items-center justify-between bg-white border-t border-slate-200 px-4 sm:px-6 md:px-5 h-16">
        <form className="grow flex w-[-webkit-fill-available]" onSubmit={sendMessage}>
          <div className="grow mr-3">
            <input
              id="message-input"
              className="form-input w-full bg-slate-100 border-transparent focus:bg-white focus:border-slate-300"
              type="text"
              placeholder={
                !templateId
                  ? `Type Message or Click on Templates above.. `
                  : "Template Selected, click on Send or Schedule."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={templateId ? true : false}
            />
          </div>
          <input
            type="datetime-local"
            className="form-input mr-3"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
          <button
            type="submit"
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap"
            disabled={loading}
          >
            {loading ? "Sending... It may take a few seconds" : "Send ->"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2 mr-2 text-right">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2 mr-2 text-right">{success}</p>}
      </div>
    </div>
  );
}

export default MessagesFooter;
