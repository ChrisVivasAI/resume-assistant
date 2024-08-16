import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request, { params }) {
  const { fileId } = params;
  
  if (!fileId) {
    return NextResponse.json({ error: 'File ID is missing' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'extracted_text', `${fileId}.txt`);
    const textContent = await fs.readFile(filePath, 'utf-8');

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-4" if you have access
      messages: [
        {"role": "system", "content": "You are a helpful assistant that converts resume text into structured JSON. Provide only the JSON output without any additional text or formatting."},
        {"role": "user", "content": `Convert this resume text into JSON with the following structure:
        {
          "fullName": "",
          "jobPosition": "",
          
          "skills": {
            "soft": [],
            "hard": []
          },
          "education": [
            {
              "degree": "",
              "institution": ""
            }
          ],
          "coursesAndCertifications": [],
          "experience": [
            {
              "company": "",
              "term": "",
              "position": "",
              "responsibilities": []
            }
          ]
        }

        Resume text:
        ${textContent}`}
      ],
    });

    let jsonContent;
    try {
      // Attempt to parse the content directly
      jsonContent = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from markdown
      const match = completion.choices[0].message.content.match(/```json\n([\s\S]*)\n```/);
      if (match) {
        jsonContent = JSON.parse(match[1]);
      } else {
        throw new Error("Failed to parse JSON from OpenAI response");
      }
    }

    const jsonFilePath = path.join(process.cwd(), 'public', 'json_data', `${fileId}.json`);
    await fs.mkdir(path.dirname(jsonFilePath), { recursive: true });
    await fs.writeFile(jsonFilePath, JSON.stringify(jsonContent, null, 2));

    return NextResponse.json(jsonContent);
  } catch (error) {
    console.error('Error converting to JSON:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}