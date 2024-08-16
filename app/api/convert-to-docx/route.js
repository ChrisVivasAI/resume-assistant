import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  
  if (!fileId) {
    return NextResponse.json({ error: 'File ID is missing' }, { status: 400 });
  }

  try {
    // Read the extracted info (assuming it's JSON)
    const extractedInfoPath = path.join(process.cwd(), 'public', 'json_data', `${fileId}.json`);
    const extractedInfoRaw = await fs.readFile(extractedInfoPath, 'utf-8');
    const extractedInfo = JSON.parse(extractedInfoRaw);

    // Read the template file
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'resume_template.docx');
    const templateContent = await fs.readFile(templatePath, 'binary');

    // Load the docx file as a binary
    const zip = new PizZip(templateContent);
    
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Prepare the data for the template
    const templateData = {
      full_name: extractedInfo.fullName || '',
      job_position: extractedInfo.jobPosition || '',
      skills: extractedInfo.skills?.soft?.map(skill => ({ skill })) || [],
      knowledge: extractedInfo.skills?.hard?.map(skill => ({ skill })) || [],
      education: extractedInfo.education?.map(edu => ({
        degree: edu.degree,
        school: edu.institution
      })) || [],
      languages: extractedInfo.languages || '',
      courses: extractedInfo.coursesAndCertifications?.map(course => ({ course })) || [],
      experience: extractedInfo.experience?.map(exp => ({
        company: exp.company,
        term: exp.term,
        position: exp.position,
        activities: exp.responsibilities?.map(activity => ({ activity })) || []
      })) || []
    };

    // Render the document (replace all occurrences of placeholders)
    doc.render(templateData);

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    // Save the DOCX file
    const docxPath = path.join(process.cwd(), 'public', 'docxfinal', `${fileId}.docx`);
    await fs.mkdir(path.dirname(docxPath), { recursive: true });
    await fs.writeFile(docxPath, buf);

    return NextResponse.json({ success: true, message: 'DOCX file generated successfully' });
  } catch (error) {
    console.error('Error generating DOCX:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}