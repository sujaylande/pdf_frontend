import React, { useEffect, useState } from "react";
import DocumentUpload from "./components/DocumentUpload";
import QASection from "./components/QASection";
import axios from "axios";

const App = () => {
  const [documents, setDocuments] = useState([]);
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [activeDocumentTitle, setActiveDocumentTitle] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchDocuments(); 
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://pdf-backend-mvdj.onrender.com/api/files");
      setDocuments(response.data.documents);

      if (response.data.documents.length > 0) {
        setActiveDocumentId(response.data.documents[0]._id);
        setActiveDocumentTitle(response.data.documents[0].title);
      }
    } catch (error) {
      console.error("Error fetching documents:", error.message);
    }
  };

  const handleDocumentClick = (docId, title) => {
    setActiveDocumentId(docId);
    setActiveDocumentTitle(title);
  };

  const handleUploadComplete = async (newDocument) => {
    setDocuments((prev) => [...prev, newDocument]); 
    setActiveDocumentId(newDocument._id); 
    setActiveDocumentTitle(newDocument.title);
    setShowUpload(false); 
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Uploaded Files</h2>
        <button
          onClick={() => setShowUpload((prev) => !prev)}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {showUpload ? "Cancel" : "Upload New File"}
        </button>
        {showUpload && <DocumentUpload onUploadComplete={handleUploadComplete} />}
        <ul className="space-y-2 mt-4">
          {documents.map((doc) => (
            <li
              key={doc._id}
              onClick={() => handleDocumentClick(doc._id, doc.title)}
              className={`cursor-pointer p-2 rounded ${
                doc._id === activeDocumentId ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {doc.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-4">Q&A: {activeDocumentTitle || "No Document Selected"}</h1>
        {activeDocumentId ? (
          <QASection documentId={activeDocumentId} />
        ) : (
          <p>Please select a document from the left to start the Q&A.</p>
        )}
      </div>
    </div>
  );
};

export default App;

