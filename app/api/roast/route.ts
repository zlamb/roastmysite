import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

interface PageSpeedResult {
  lighthouseResult?: {
    categories?: {
      performance?: { score: number }
      accessibility?: { score: number }
      'best-practices'?: { score: number }
      seo?: { score: number }
    }
  }
}

const fallbackRoasts = {
  terrible: [
    "This website looks like it was designed by someone who learned HTML from a 1998 textbook.",
    "I've seen better user experiences on a 404 page.",
    "Your website has more issues than a magazine stand.",
  ],
  bad: [
    "Your website is like a participation trophy - it exists, and that's about all.",
    "This website is proof that 'technically functional' is a very low bar.",
  ],
  mediocre: [
    "Congratulations, your website is aggressively average.",
    "Your site is like plain oatmeal - it'll do the job, but nobody's excited.",
  ],
  good: [
    "Alright, your website doesn't completely make my eyes bleed. Well done.",
    "Your site is actually decent. I'm almost disappointed I can't roast it harder.",
  ],
  great: [
    "Okay fine, your website is actually good. Not much to burn here.",
    "This is... actually impressive? I feel like I'm being set up.",
  ],
}

const getBurns = (metrics: any) => {
  const burns: string[] = []
  if (metrics.performance < 50) burns.push("Your site loads slower than a sloth")
  if (metrics.accessibility < 50) burns.push("Screen readers probably file lawsuits")
  if (metrics.seo < 50) burns.push("Google probably doesn't know this site exists")
  if (metrics.bestPractices < 50) burns.push("Best practices? More like 'any practices'")
  return burns.slice(0, 4)
}

const getCompliments = (metrics: any) => {
  const compliments: string[] = []
  if (metrics.performance >= 80) compliments.push("Actually loads pretty fast")
  if (metrics.accessibility >= 80) compliments.push("Accessibility is solid")
  if (metrics.seo >= 80) compliments.push("Google probably likes you")
  if (metrics.bestPractices >= 80) compliments.push("Following best practices")
  return compliments.slice(0, 3)
}

const generateFallbackRoast = (score: number): string => {
  const roasts = fallbackRoasts
  if (score < 30) return roasts.terrible[Math.floor(Math.random() * roasts.terrible.length)]
  if (score < 50) return roasts.bad[Math.floor(Math.random() * roasts.bad.length)]
  if (score < 70) return roasts.mediocre[Math.floor(Math.random() * roasts.mediocre.length)]
  if (score < 85) return roasts.good[Math.floor(Math.random() * roasts.good.length)]
  return roasts.great[Math.floor(Math.random() * roasts.great.length)]
}

async function generateAIRoast(url: string, metrics: any, score: number): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return generateFallbackRoast(score)

  try {
    const openai = new OpenAI({ apiKey })
    const prompt = `You are a brutally honest website critic. Roast this website in 2-3 sentences.
Website: ${url}
Performance: ${metrics.performance}/100, Accessibility: ${metrics.accessibility}/100
SEO: ${metrics.seo}/100, Best Practices: ${metrics.bestPractices}/100
Overall: ${score}/100. Be funny and brutally honest. No emojis.`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.9,
    })
    return response.choices[0]?.message?.content || generateFallbackRoast(score)
  } catch {
    return generateFallbackRoast(score)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=accessibility&category=best-practices&category=seo`
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('Failed to analyze website')

    const data: PageSpeedResult = await response.json()
    const categories = data.lighthouseResult?.categories || {}

    const metrics = {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
    }

    const score = Math.round(
      (metrics.performance * 0.35) + (metrics.accessibility * 0.25) +
      (metrics.seo * 0.20) + (metrics.bestPractices * 0.20)
    )

    const roast = await generateAIRoast(url, metrics, score)
    const burns = getBurns(metrics)
    const compliments = getCompliments(metrics)

    return NextResponse.json({ url, score, roast, metrics, burns, compliments })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to roast website.' }, { status: 500 })
  }
}
