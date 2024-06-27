import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
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
  const [templateLoading, setTemplateLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (templateId) {
      fetchTemplate(templateId);
    }
  }, [templateId]);

  const fetchTemplate = async (id) => {
    setTemplateLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${baseUrl}/api/get-message-template/`,
        { temp_id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const templateContent = response.data.Message_template_data[0]["Template Content"];
      setMessage(templateContent);
    } catch (error) {
      console.error("Error fetching template:", error);
      setError("Failed to fetch template");
    } finally {
      setTemplateLoading(false);
    }
  };

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
          username: JSON.parse(toUsername),
          name: JSON.parse(toName),
          custom_message: message,
          scheduled_time: scheduledTime,
        }
      : {
          instagram_account_id: 1,
          recipient_list: JSON.parse(toUsername),
          custom_message: message,
          username: JSON.parse(toUsername),
          name: JSON.parse(toName),
        };

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        scheduledTime ? `${baseUrl}/api/add-message/` : `${baseUrl}/api/single-insta-messages/`,
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
            <textarea
              id="message-input"
              className="form-input w-full bg-slate-100 border-transparent focus:bg-white focus:border-slate-300 mt-[10px]"
              type="text"
              rows={2}
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
            className="form-input m-[10px] mr-3"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
          <button
            type="submit"
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap m-[10px]"
            disabled={loading || templateLoading}
          >
            {loading || templateLoading ? "Sending... It may take a few seconds" : "Send ->"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2 mr-2 text-right">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2 mr-2 text-right">{success}</p>}
      </div>
    </div>
  );
}

export default MessagesFooter;
