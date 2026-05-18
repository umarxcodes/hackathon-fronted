import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
export function usePDFDownload() {
  const [downloading, setDownloading] = useState(false);
  const downloadPDF = async (prescriptionId) => {
    setDownloading(true);
    try {
      const res = await axiosInstance.get(
        `/prescriptions/${prescriptionId}/pdf`,
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `prescription-${prescriptionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };
  return { downloadPDF, downloading };
}
