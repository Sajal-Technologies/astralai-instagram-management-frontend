import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../constants";

import Header from "../Header";
import Sidebar from "../Sidebar";

function MessageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${baseUrl}/api/get-message-template/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setTemplates(response.data.Message_template_data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setError("Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTemplate = async (event) => {
    event.preventDefault();
    if (!newTemplateName || !newTemplateContent) {
      setError("Template name and content are required");
      setSuccess("");
      return;
    }

    const data = {
      template_name: newTemplateName,
      template_content: newTemplateContent,
    };

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${baseUrl}/api/add-message-template/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log("Template added successfully:", response.data);
      setSuccess("Template added successfully");
      setNewTemplateName("");
      setNewTemplateContent("");
      fetchTemplates();
    } catch (error) {
      console.error("Error adding template:", error);
      setError("Failed to add template");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(
        `${baseUrl}/api/delete-message-template/`,
        { template_id: templateId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setSuccess("Template deleted successfully");
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      setError("Failed to delete template");
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) =>
    template["Template Name"].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto">
            <div className="container mx-auto p-4">
              <h1 className="text-2xl font-bold mb-4">Message Templates</h1>
              <p style={{ paddingBottom: '10px' }}>
                These variables are available: {"{name}, {username}"}
              </p>
              <form
                className="mb-4"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  flexDirection: 'column',
                }}
                onSubmit={handleAddTemplate}
              >
                <div className="mb-2" style={{ width: '-webkit-fill-available' }}>
                  <input
                    type="text"
                    placeholder="Template Name"
                    className="form-input w-full"
                    style={{ width: '-webkit-fill-available' }}
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                  />
                </div>
                <div className="mb-2" style={{ width: '-webkit-fill-available' }}>
                  <textarea
                    placeholder="Template Content"
                    className="form-textarea w-full"
                    style={{ width: '-webkit-fill-available' }}
                    value={newTemplateContent}
                    onChange={(e) => setNewTemplateContent(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white items-right"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Template"}
                </button>
              </form>
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search templates..."
                      className="form-input w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2">Template Name</th>
                        <th className="py-2">Template Content</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTemplates.map((template) => (
                        <tr key={template["Message Template id"]}>
                          <td className="border px-4 py-2">
                            {template["Template Name"]}
                          </td>
                          <td className="border px-4 py-2">
                            {template["Template Content"]}
                          </td>
                          <td className="border px-4 py-2">
                            <button
                              onClick={() =>
                                handleDeleteTemplate(template["Message Template id"])
                              }
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MessageTemplates;
