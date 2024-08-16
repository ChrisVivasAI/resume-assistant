# Resume PDF to DOCX Converter

This project is a web application that converts PDF resumes to a standardized DOCX format. It uses Next.js for the frontend and backend, OpenAI's GPT model for information extraction, and Vercel Blob storage for file management.

## Features

- PDF upload and processing
- Information extraction using AI
- Conversion to a standardized DOCX format
- Vercel Blob storage integration for file management

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

## Deployment on Vercel

1. Push your code to a GitHub repository.

2. Log in to your Vercel account and click "New Project".

3. Import your GitHub repository.

4. In the project settings:
   - Set the Framework Preset to Next.js
   - Add your environment variables (OPENAI_API_KEY)

5. Click "Deploy".

6. After deployment, go to the "Storage" tab in your Vercel dashboard and create a new Blob store.

7. Update your environment variables in the Vercel dashboard to include the Blob store details.

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Next.js
- OpenAI
- Vercel
- docxtemplater