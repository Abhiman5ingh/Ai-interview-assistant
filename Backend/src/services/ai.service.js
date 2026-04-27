const Groq = require("groq-sdk")
const { z } = require("zod")
const puppeteer = require("puppeteer")

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        Respond ONLY with a valid JSON object with this exact structure, no extra text:
                        {
                            "title": "Job title here",
                            "matchScore": 75,
                            "technicalQuestions": [
                                { "question": "...", "intention": "...", "answer": "..." }
                            ],
                            "behavioralQuestions": [
                                { "question": "...", "intention": "...", "answer": "..." }
                            ],
                            "skillGaps": [
                                { "skill": "...", "severity": "low" | "medium" | "high" }
                            ],
                            "preparationPlan": [
                                { "day": 1, "focus": "...", "tasks": ["...", "..."] }
                            ]
                        }`

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.7,
        })

        const text = response.choices[0].message.content
        return JSON.parse(text)

    } catch (err) {
        console.error("Groq generateInterviewReport error:", err.message)
        throw err
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate a resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        Respond ONLY with a valid JSON object with this exact structure, no extra text:
                        { "html": "<full html string here>" }

                        Requirements for the HTML resume:
                        - Tailored for the given job description
                        - Highlights candidate's strengths and relevant experience
                        - Well-formatted, visually appealing, simple and professional
                        - Does not sound AI-generated
                        - ATS friendly
                        - 1-2 pages when converted to PDF
                        - Can use colors or different font styles but keep it professional`

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.7,
        })

        const text = response.choices[0].message.content
        const jsonContent = JSON.parse(text)
        return await generatePdfFromHtml(jsonContent.html)

    } catch (err) {
        console.error("Groq generateResumePdf error:", err.message)
        throw err
    }
}

module.exports = { generateInterviewReport, generateResumePdf }