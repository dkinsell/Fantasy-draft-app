import * as xlsx from "xlsx";
import fs from "fs";

const fileUploadController = {};

fileUploadController.handleFileUpload = async (req) => {
  try {
    // Check that a file was uploaded.
    if (!req.file) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No file uploaded or unsupported file type",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const filePath = req.file.path;

    // Read the file into a Buffer then hand it off to xlsx.read().
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const playerData = xlsx.utils.sheet_to_json(sheet);

    // After processing, remove the file.
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    // Return a successful response.
    return new Response(
      JSON.stringify({
        success: true,
        message: "File processed successfully",
        players: playerData,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing file upload:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "File processing failed",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export default fileUploadController;
