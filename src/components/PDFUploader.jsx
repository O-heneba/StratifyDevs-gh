import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { storage, db, auth } from "../AUTH/firebase-auth";
import * as pdfjsLib from "pdfjs-dist";
import { FaFilePdf, FaUpload, FaUtensils, FaChartLine, FaMoneyBillWave, FaReceipt } from "react-icons/fa";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [extracting, setExtracting] = useState(false);

  // Extracted data state
  const [extractedData, setExtractedData] = useState({
    totalSales: 0,
    taxes: 0,
    earnings: 0,
    period: "",
    restaurantName: "",
    fileName: "",
  });

  // Handle file selection
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Validate file type - only PDF
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setSuccess(false);
    setExtracting(true);

    // Extract data from PDF
    try {
      const data = await extractDataFromPDF(selectedFile);
      setExtractedData({
        ...data,
        fileName: selectedFile.name,
      });
    } catch (err) {
      setError("Failed to extract data from PDF: " + err.message);
    } finally {
      setExtracting(false);
    }
  };

  // Extract data from PDF using pdf.js
  const extractDataFromPDF = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
      }

      // Extract data using regex patterns
      return extractDataFromText(fullText);
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      throw new Error("Could not read the PDF file");
    }
  };

  // Extract specific data from text using regex
  const extractDataFromText = (text) => {
    // Extract restaurant name
    const restaurantMatch = text.match(/Recipient\s*([^\n]+)/);
    const restaurantName = restaurantMatch
      ? restaurantMatch[1].trim()
      : "Unknown Restaurant";

    // Extract period
    const periodMatch = text.match(/Period of report:\s*([\d-]+\s*-\s*[\d-]+)/);
    const period = periodMatch ? periodMatch[1].trim() : "";

    // Extract total sales (looking for the total sales row)
    const totalSalesMatch = text.match(
      /Total sales\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)/
    );
    let totalSales = 0;
    if (totalSalesMatch && totalSalesMatch.length >= 4) {
      totalSales = parseFloat(totalSalesMatch[3].replace(/,/g, ""));
    }

    // Extract taxes (Weekly aggregate agency fees...)
    const taxesMatch = text.match(
      /Weekly aggregate agency fees[^]+?-\s*([\d.,]+)\s+-\s*([\d.,]+)\s+-\s*([\d.,]+)/
    );
    let taxes = 0;
    if (taxesMatch && taxesMatch.length >= 4) {
      taxes = parseFloat(taxesMatch[3].replace(/,/g, ""));
    }

    // Extract earnings (Weekly earnings)
    const earningsMatch = text.match(/Weekly earnings\s+([\d.,]+)/);
    let earnings = 0;
    if (earningsMatch) {
      earnings = parseFloat(earningsMatch[1].replace(/,/g, ""));
    }

    // If regex didn't work, try alternative patterns
    if (totalSales === 0) {
      const altSalesMatch = text.match(/(\d+\.\d{2})\s+0\.00\s+(\d+\.\d{2})/);
      if (altSalesMatch) {
        totalSales = parseFloat(altSalesMatch[2]);
      }
    }

    if (taxes === 0) {
      const altTaxesMatch = text.match(
        /-\d+\.\d{2}\s+-\d+\.\d{2}\s+(-\d+\.\d{2})/
      );
      if (altTaxesMatch) {
        taxes = Math.abs(parseFloat(altTaxesMatch[1]));
      }
    }

    return {
      totalSales,
      taxes,
      earnings,
      period,
      restaurantName,
    };
  };

  // Handle file upload and data storage
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    if (extractedData.totalSales === 0) {
      setError("No valid data could be extracted from this PDF");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create a storage reference
      const timestamp = Date.now();
      const storageRef = ref(storage, `reports/${timestamp}_${file.name}`);

      // Create upload task
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          setUploading(false);
          setError(`Upload failed: ${error.message}`);
        },
        async () => {
          try {
            // Upload completed successfully, get download URL
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

            // Prepare data for Firestore
            const reportData = {
              fileName: file.name,
              fileUrl: downloadUrl,
              totalSales: extractedData.totalSales,
              taxes: extractedData.taxes,
              earnings: extractedData.earnings,
              period: extractedData.period,
              restaurantName: extractedData.restaurantName,
              uploadDate: new Date().toISOString(),
              reportDate: timestamp,
              status: "processed",
            };

            // Create a document in Firestore
            const docRef = doc(db, "users", auth.currentUser.uid);

            // ✅ Get the document snapshot
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const data = docSnap.data(); // get plain object
              console.log("Files:", data.files);

              // ✅ Add new file to array
              const newFiles = [...(data.files || []), reportData];

              // ✅ Update document with merged files
              await updateDoc(docRef, { files: newFiles });
            } else {
              console.log("No such document!");
            }

            setSuccess(true);
            setUploading(false);
            setUploadProgress(0);
          } catch (error) {
            setUploading(false);
            setError(`Error saving data: ${error.message}`);
          }
        }
      );
    } catch (error) {
      setUploading(false);
      setError(`Upload error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 bg-opacity-80 bg-blend-overlay bg-cover bg-center " style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80")' }}>
      <div className="container mx-auto px-4 py-8 ">
        {/* Header */}
        <div className="text-center mb-8 mt-14">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-4">
            <FaUtensils className="text-3xl text-orange-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-orange-700">Sales Report Processor</h1>
          </div>
          <p className="text-orange-800 max-w-2xl mx-auto">Upload your Bolt Food weekly sales report to extract financial data and store it in your account</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-orange-500 p-6 text-white">
              <div className="flex items-center">
                <FaFilePdf className="text-2xl mr-3" />
                <h2 className="text-2xl font-bold">Upload Sales Report</h2>
              </div>
              <p className="mt-2 opacity-90">PDF files only • Max size 10MB</p>
            </div>

            {/* Card Body */}
            <div className="p-6">
              {/* File Upload Area */}
              <div className="mb-6">
                <label className="block text-orange-700 font-medium mb-3">Select PDF Report:</label>
                <div className="border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center bg-orange-50 transition-colors hover:bg-orange-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                    <FaUpload className="text-xl text-orange-500" />
                  </div>
                  <p className="text-orange-700 mb-2">Drag & drop your file here</p>
                  <p className="text-orange-600 text-sm mb-4">Supported format: PDF only</p>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-full inline-flex items-center transition-colors">
                      <FaUpload className="mr-2" /> Select file
                    </span>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,application/pdf"
                      disabled={uploading || extracting}
                    />
                  </label>
                </div>

                {file && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg flex items-center">
                    <FaFilePdf className="text-orange-500 text-xl mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-orange-800">{file.name}</p>
                      <p className="text-sm text-orange-600">{Math.round(file.size / 1024)} KB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleUpload}
                disabled={
                  !file || uploading || extracting || extractedData.totalSales === 0
                }
                className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-colors
                  ${uploading || extracting
                    ? "bg-gray-400 cursor-not-allowed"
                    : extractedData.totalSales === 0
                    ? "bg-orange-400 hover:bg-orange-500"
                    : "bg-orange-600 hover:bg-orange-700"
                  }`}
              >
                {extracting
                  ? "Extracting Data..."
                  : uploading
                  ? "Processing Report..."
                  : extractedData.totalSales === 0
                  ? "No Data to Process"
                  : "Process Report"
                }
              </button>

              {/* Progress bar */}
              {(uploading || extracting) && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-orange-700 mb-1">
                    <span>{extracting ? "Extracting Data" : "Uploading File"}</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2.5">
                    <div 
                      className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Messages */}
              {error && (
                <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
                  <p>Report processed and data saved successfully!</p>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Data Preview */}
          {extractedData.totalSales > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-orange-500 p-4 text-white">
                <h3 className="text-xl font-bold flex items-center">
                  <FaChartLine className="mr-2" /> Extracted Report Data
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center text-orange-700 mb-2">
                      <FaMoneyBillWave className="mr-2" />
                      <span className="font-medium">Total Sales</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-800">GHS {extractedData.totalSales.toFixed(2)}</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center text-orange-700 mb-2">
                      <FaReceipt className="mr-2" />
                      <span className="font-medium">Taxes & Fees</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-800">GHS {extractedData.taxes.toFixed(2)}</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center text-orange-700 mb-2">
                      <FaChartLine className="mr-2" />
                      <span className="font-medium">Weekly Earnings</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-800">GHS {extractedData.earnings.toFixed(2)}</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center text-orange-700 mb-2">
                      <FaUtensils className="mr-2" />
                      <span className="font-medium">Report Period</span>
                    </div>
                    <p className="text-lg font-medium text-orange-800">{extractedData.period}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 text-center text-orange-700">
            <p className="text-sm">This tool extracts financial data from Bolt Food sales reports and stores it in your restaurant management account.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUploader;