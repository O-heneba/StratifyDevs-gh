import React, { useState } from "react";
import { db } from "../AUTH/firebase-auth";
import { collection, addDoc } from "firebase/firestore";
import * as pdfjsLib from "pdfjs-dist";
import { motion } from "framer-motion";

// ✅ Fix worker for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.js",
  import.meta.url
);

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Extract text from PDF
  const extractText = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;

      let extractedData = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const strings = textContent.items.map((item) => item.str).join(" ");

        // ✅ Simple regex to extract Date, Week, Amount
        const dateMatch = strings.match(/\b\d{4}-\d{2}-\d{2}\b/); // YYYY-MM-DD
        const weekMatch = strings.match(/\bWeek\s*\d+\b/i);
        const amountMatch = strings.match(/\b\d+(?:\.\d{1,2})?\b/);

        extractedData.push({
          date: dateMatch ? dateMatch[0] : "",
          week: weekMatch ? weekMatch[0] : "",
          amount: amountMatch ? amountMatch[0] : "",
        });
      }

      setData(extractedData);
    };

    reader.readAsArrayBuffer(file);
  };

  // Save to Firestore
  const saveToFirestore = async () => {
    try {
      for (let item of data) {
        await addDoc(collection(db, "weeklyReports"), item);
      }
      alert("Data uploaded successfully!");
      setData([]);
    } catch (error) {
      console.error("Error uploading to Firestore:", error);
    }
  };

  // Handle editing
  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const handleSaveEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ff7f32 0%, #ffffff 100%)",
      }}
    >
      {/* Cartoon PDF background */}
      <div className="absolute inset-0 opacity-10 flex justify-center items-center">
        <img
          src="https://img.icons8.com/clouds/500/pdf.png"
          alt="PDF cartoon"
          className="w-96 animate-pulse"
        />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl relative z-10"
      >
        <h1 className="text-3xl font-extrabold text-center text-orange-600 mb-6">
          Belee PDF Data Extractor
        </h1>

        {/* File Upload */}
        <div className="flex flex-col items-center mb-6">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-4"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={extractText}
            className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-lg hover:bg-orange-600 transition"
          >
            Extract Data
          </motion.button>
        </div>

        {/* Extracted Data Table */}
        {data.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow">
              <thead>
                <tr className="bg-orange-100 text-orange-800">
                  <th className="border p-3">Date</th>
                  <th className="border p-3">Week</th>
                  <th className="border p-3">Amount</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center hover:bg-orange-50 transition"
                  >
                    <td className="border p-2">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={item.date}
                          onChange={(e) =>
                            handleChange(index, "date", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        item.date
                      )}
                    </td>
                    <td className="border p-2">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={item.week}
                          onChange={(e) =>
                            handleChange(index, "week", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        item.week
                      )}
                    </td>
                    <td className="border p-2">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={item.amount}
                          onChange={(e) =>
                            handleChange(index, "amount", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        item.amount
                      )}
                    </td>
                    <td className="border p-2">
                      {editingIndex === index ? (
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(index)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Upload Button */}
            <div className="flex justify-center mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveToFirestore}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition"
              >
                Upload to Firestore
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PDFUploader;
