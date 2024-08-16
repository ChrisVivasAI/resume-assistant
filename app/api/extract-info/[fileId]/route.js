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
    const jsonFilePath = path.join(process.cwd(), 'public', 'json_data', `${fileId}.json`);
    const jsonContent = await fs.readFile(jsonFilePath, 'utf-8');
    const resumeData = JSON.parse(jsonContent);

    const prompt = `
    Extract and organize the following information from the resume data:

    1. Full Name
    2. Job Position 
    3. Soft and Hard Skills
    4. Education
    5. Courses and Certifications
    6. Experience (for each position include: Company, Term, Job Position, and a bulleted list of responsibilities/achievements)

    Format the output to match this template:

    Full Name
    - [Full Name]

    Job Position
    - [Job Position]

    Soft and Hard Skills

    Soft Skills:
    - [List of soft skills]

    Hard Skills:
    - [List of hard skills categorized if applicable]

    Education
    - [Degree] | [Institution]

    Courses and Certifications
    - [List of courses and certifications]

    Experience

    [Company Name]
    [Term]
    [Job Position]
    - [Responsibility/Achievement 1]
    - [Responsibility/Achievement 2]
    ...

    [Repeat for each position]

    Resume data:
    ${JSON.stringify(resumeData)}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {"role": "system", "content": "You are a helpful assistant that extracts and formats resume information."},
        {"role": "user", "content": prompt}
      ],
    });

    const extractedInfo = completion.choices[0].message.content;

    const extractedInfoPath = path.join(process.cwd(), 'public', 'extracted_info', `${fileId}.txt`);
    await fs.mkdir(path.dirname(extractedInfoPath), { recursive: true });
    await fs.writeFile(extractedInfoPath, extractedInfo);

    return NextResponse.json({ success: true, extractedInfo });
  } catch (error) {
    console.error('Error extracting information:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}