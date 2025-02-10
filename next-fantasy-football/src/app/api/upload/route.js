import { NextResponse } from "next/server";
import fileUploadController from "@/lib/fileUploadController";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable the default parser for form data
  },
};

export async function POST(request) {
  try {
    // Parse the incoming multipart/form-data request
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded or unsupported file type",
        },
        { status: 400 }
      );
    }

    // Determine the uploads directory and ensure it exists
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // Generate a unique filename using a timestamp
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);

    // Read the file into a Buffer and write it synchronously
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Verify the file exists and is accessible
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
      console.log("File written to disk and accessible:", filePath);
    } catch (err) {
      console.error("The file is not accessible after write:", filePath, err);
      return NextResponse.json(
        { success: false, message: "File saved but not accessible" },
        { status: 500 }
      );
    }

    // Create a simulated request object with a "file" property for the controller
    const simulatedReq = { file: { path: filePath } };

    // Invoke your fileUploadController to process the file; it returns a Response.
    const response = await fileUploadController.handleFileUpload(simulatedReq);

    // Always return a Response so that Next.js knows what to send back.
    return response;
  } catch (error) {
    console.error("Error in POST /api/upload:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
