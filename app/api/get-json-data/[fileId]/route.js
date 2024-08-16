import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  const { fileId } = params;

  try {
    const filePath = path.join(process.cwd(), 'public', 'json_data', `${fileId}.json`);
    const jsonContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(jsonContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    return NextResponse.json({ error: 'Failed to fetch JSON data' }, { status: 500 });
  }
}