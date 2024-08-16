import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  const { fileId } = params;
  
  try {
    const filePath = path.join(process.cwd(), 'public', 'extracted_text', `${fileId}.txt`);
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

    if (fileExists) {
      const ocrText = await fs.readFile(filePath, 'utf-8');
      return NextResponse.json({ status: 'completed', ocrText });
    } else {
      return NextResponse.json({ status: 'processing' });
    }
  } catch (error) {
    console.error('Error checking file status:', error);
    return NextResponse.json({ status: 'failed', error: error.message }, { status: 500 });
  }
}