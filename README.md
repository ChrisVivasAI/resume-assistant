# Resume PDF to DOCX Converter

This project is a web application that converts PDF resumes to a standardized DOCX format. It uses Next.js for the frontend and backend, OpenAI's GPT model for information extraction, and local storage for file management.

## Features

- PDF upload and processing
- Information extraction using AI
- Conversion to a standardized DOCX format
  

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A Vercel account
- An OpenAI API key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/resume-pdf-to-docx-converter.git
   cd resume-pdf-to-docx-converter
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

## Local Development

1. Run the development server:
   ```
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Navigate to the deployed application.

2. Upload a PDF resume.

3. The application will process the PDF, extract information, and generate a standardized DOCX file.

4. Download the resulting DOCX file.

## Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── upload/
│   │   ├── process-status/
│   │   ├── convert-to-json/
│   │   ├── extract-info/
│   │   └── convert-to-docx/
│   ├── upload/
│   ├── process/
│   ├── convert-to-json/
│   ├── extract/
│   └── convert-to-docx/
├── public/
│   └── templates/
│       └── resume_template.docx
├── .env.local
├── next.config.js
├── package.json
└── README.md
```

## Configuration

- `next.config.js`: Next.js configuration
- `.env.local`: Environment variables (not committed to version control)

## License

This project is licensed under the MIT License.

## Acknowledgments

- Next.js
- OpenAI
- docxtemplater
