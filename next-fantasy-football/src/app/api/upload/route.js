import { NextResponse } from "next/server";
import fileUploadController from "@/lib/fileUploadController";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file");
    
    // Use the controller to handle file upload logic
    const result = await fileUploadController.handleFileUpload(file);
    
    // Return appropriate response based on the result
    return NextResponse.json(
      { success: result.success, message: result.message },
      { status: result.status }
    );
  } catch (error) {
    console.error("Error in upload route:", error);
    return NextResponse.json(
      { success: false, message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}
