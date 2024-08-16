import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';

export async function GET() {
  return NextResponse.json({ message: 'Upload API is working' });
}

export async function POST(request) {
  console.log('API route hit: /api/upload');
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const pdfData = await pdf(Buffer.from(buffer));
    const extractedText = pdfData.text;

    const fileId = Date.now().toString();
    const extractedTextDir = path.join(process.cwd(), 'public', 'extracted_text');
    await mkdir(extractedTextDir, { recursive: true });
    const extractedTextPath = path.join(extractedTextDir, `${fileId}.txt`);
    await writeFile(extractedTextPath, extractedText);

    console.log('File processed successfully. File ID:', fileId);
    return NextResponse.json({ success: true, fileId });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}