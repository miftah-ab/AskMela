import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import Groq from 'groq-sdk'
import path from 'path'

// Parse arguments
const args = process.argv.slice(2)
const envArg = args.find(a => a.startsWith('--env='))
const env = envArg ? envArg.split('=')[1] : 'development'

console.log(`🌱 Seeding AskMela Demo KB for environment: ${env}`)

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) })

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const groqApiKey = process.env.GROQ_API_KEY

if (!supabaseUrl || !supabaseKey || !groqApiKey) {
  console.error('❌ Missing environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const groq = new Groq({ apiKey: groqApiKey })

// Fallback MVP Embedding (since Groq lacks embeddings, matching our implementation)
async function generateEmbedding(text: string): Promise<number[]> {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(text)
  const dims = 1536
  const vec: number[] = new Array(dims).fill(0)
  for (let i = 0; i < bytes.length; i++) {
    vec[i % dims] += bytes[i] / 255
  }
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
  return vec.map((v) => v / mag)
}

const demoBusinessId = '00000000-0000-0000-0000-000000000000'

const documents = [
  // Category 1 — What is AskMela
  "AskMela is an AI-powered customer service assistant designed specifically for Ethiopian businesses. It allows you to automate your customer interactions 24/7 on Telegram and your website. It's built for shop owners, cafes, clinics, and any business that gets repeated questions every day.",
  "What AskMela does is simple: it acts as a digital employee that never sleeps. You teach it about your products and services, and it answers customers instantly. It's great for handling price inquiries, location requests, and service details without you having to touch your phone.",
  "AskMela was built by Addus, a software development company based right here in Addis Ababa, Ethiopia. We are 100% Ethiopian and our product is tailored to the local market, including deep support for Amharic and local payment methods.",
  "While AskMela uses advanced AI models like ChatGPT, it's different because it's 'grounded'. This means it only answers from the specific knowledge you provide. Unlike ChatGPT, it won't guess your prices or make up fake services. It stays strictly on topic for your business.",
  "Who is AskMela for? It's for the boutique owner in Bole who is tired of typing 'How much?' to 50 people a day. It's for the cafe owner in Piassa who wants to share their menu easily. It's for any Ethiopian entrepreneur who wants to save time and grow.",

  // Category 2 — Pricing
  "AskMela is very affordable. We have a Free Plan that costs 0 ETB! It's perfect for testing. You get 50 AI responses per month and the Telegram bot integration. You don't even need a credit card to sign up for the free version.",
  "The Pro plan is our most popular choice. It costs just 200 ETB per month. For that price (which is less than $2.00 USD), you get 1,000 AI responses, voice message support, photo analysis (like reading menus), and the website widget. You can cancel anytime.",
  "Our Business plan is 500 ETB per month. It's for high-volume businesses and includes 5,000 AI responses and access to our REST API for custom apps. We accept Telebirr, CBE Birr, and other local payments. There are no hidden fees or long-term contracts.",
  "What happens if you hit your 50 question limit on the free plan? The bot will simply tell customers it's currently resting and send you a notification to upgrade. You can upgrade or downgrade between plans at any time through your dashboard.",
  "Is there a contract? No. AskMela is a pay-as-you-go service. You pay for the month, and you can stop whenever you want. We believe in our product, so we don't need to lock you into long contracts.",

  // Category 3 — Setup and getting started
  "Starting with AskMela is incredibly fast. You can be up and running in under 2 minutes. You just sign up with your Telegram account, enter your business name, and the bot is created instantly. No technical skills or coding required at all.",
  "To teach the bot, you just chat with it! Send it your price list, your menu, or common questions as if you're talking to a friend. You can add as much information as you want. There's no limit to how much knowledge you can store in your knowledge base.",
  "Sharing your bot is easy. Once you register, you get a unique link like t.me/AskMelaBot?start=yourbiz. You can paste this link on your Instagram bio, Facebook page, or even print it on your business cards and flyers for customers to scan.",
  "If you want to update or delete information, just visit the 'Knowledge Base' tab in your dashboard. You'll see a list of everything the bot knows. You can delete outdated items with one click and then send the new info to the bot to update it.",
  "What do I need to register? All you need is a Telegram account. We use Telegram for authentication so you don't have to remember another password. Just one click and you are in your dashboard.",

  // Category 4 — Telegram integration
  "The Telegram bot is the heart of AskMela. Since millions of Ethiopians use Telegram, it's the easiest way for them to reach you. Customers click your link, hit 'Start', and can immediately start asking questions about your business.",
  "What if a customer doesn't have Telegram? No problem! You can use our website widget. But for the Telegram link, yes, they need the app. You can put this link on Facebook, TikTok, or your physical menus to turn offline customers into digital ones.",
  "Customers love sending voice messages, and AskMela handles them perfectly. They can hold the mic, ask 'How much is the macchiato?', and the bot will listen, understand, and reply with the price in seconds. It works in both Amharic and English.",
  "AskMela is lightning fast on Telegram. Responses usually take less than 3 seconds. It can handle hundreds of customers at the same time, so no one ever has to wait for a reply even when you are busy or sleeping.",
  "Can I put the bot link on my business card? Absolutely! We recommend creating a QR code that points to your Telegram bot link. Customers can scan it at your shop or restaurant and start chatting immediately. It's much faster than them typing your phone number.",

  // Category 5 — Website widget
  "The website widget is a small chat bubble you can add to your site. Visitors can chat with your AI assistant directly on your homepage. To install it, you just copy one line of code from your dashboard and paste it into your website settings.",
  "You don't need to be a developer to install the widget. It works on WordPress, Wix, Shopify, and any custom site. It's fully mobile-friendly and looks great on iPhones and Androids. It won't slow down your site because it loads in the background.",
  "Can I customize the widget? Yes! You can change the color to match your brand and choose if it sits on the left or right side of the screen. While it doesn't support voice recording yet (like Telegram does), it's the best way to capture website visitors.",
  "Does the widget slow down my website? Not at all. We use a 'lazy-loading' technique. The widget only loads after your main website content is finished, so your visitors get a fast experience while still having the AI assistant ready to help.",

  // Category 6 — REST API
  "Our REST API is built for developers who want to integrate AskMela's brain into their own custom mobile apps or systems. It's available on the Business plan (500 ETB). You can get your API key from the Integrations tab in the dashboard.",
  "With the API, you can programmatically ask questions, add knowledge, or read conversation logs. We provide full documentation. You can use any language like Python, Node.js, or PHP to connect your existing systems to AskMela.",
  "Who is the API for? It's for tech-savvy businesses or startups that already have their own app and want to add an Ethiopian AI chat feature without building it from scratch. It saves months of development time.",

  // Category 7 — Language and voice
  "AskMela is a polyglot! It fully supports Amharic (Ge'ez script) and English. Customers can type in Amharic or English, and the bot will reply in the same language they used. It's perfect for the Ethiopian market.",
  "Does it understand Amharic voice messages? Yes! We use advanced Whisper AI technology that understands various Amharic accents. Customers can just speak naturally, and the bot will understand the intent behind their words.",
  "You can teach the bot in Amharic too. Send a text list of your services in Amharic, or even record a voice note in Amharic explaining your business, and the bot will learn everything perfectly. It handles mixed Amharic/English (Amharclish) very well too.",
  "What if a customer switches between languages? AskMela is smart enough to handle that. If they ask a question in English and then follow up in Amharic, the bot will detect the change and respond appropriately in the correct language each time.",

  // Category 8 — How the AI learns
  "You teach AskMela just by talking to it. As the owner, any message, voice note, or photo you send to the bot is treated as a lesson. The AI extracts the facts and stores them in its memory instantly.",
  "You can even send photos of your menu or price list. AskMela uses 'Computer Vision' to read the text in the photo and learn your prices. It takes about 5 seconds for new info to be live and ready for customers.",
  "AskMela is safe because it only learns from the owner. Customers cannot 'trick' it or teach it bad words. If it gives a wrong answer, you can just find that document in your dashboard, delete it, and give the bot the correct information.",
  "How long until new information is available? Almost instantly! After you send the info to the bot, it's processed and ready to answer the very next customer question. It's much faster than training a human employee.",

  // Category 9 — Business types
  "AskMela is versatile. It works for restaurants (menus, delivery), cafes (hours, location), boutiques (stock, prices), and clinics (services, booking info). It's even used by real estate agents and law firms to handle basic inquiries.",
  "Whether you have a small 'Gult' or a large hotel, AskMela helps you. For small businesses, it saves you time from answering the same 'How much?' questions. For large businesses, it handles thousands of leads automatically.",
  "Does it work for service businesses? Yes! If you are a plumber, an electrician, or a tutor, you can teach the bot your rates, your service area, and your availability. It acts as your 24/7 receptionist.",

  // Category 10 — Support and contact
  "We are here to help! You can reach us at support@askmela.xyz. We usually respond within a few hours. You can also find detailed guides and video tutorials in the 'Docs' section of our website.",
  "If you find a bug or something isn't working, just send us an email with your business ID and a screenshot. We are constantly updating the platform based on your feedback to make it better for Ethiopian owners.",
  "Do you have phone support? Currently, we prioritize email support to keep our prices low for small businesses. However, for our Business plan customers, we provide a dedicated support contact for urgent issues.",

  // Category 11 — Trust and security
  "Your data is safe and private. We use secure servers and encryption to protect your knowledge base. We store customer conversations so you can review them, but we never share this data with anyone else or use it for advertising.",
  "AskMela is reliable with a 99.9% uptime. Your data is yours—you can delete your entire knowledge base or your account at any time from the dashboard, and we will wipe all records from our servers immediately.",
  "Is AskMela GDPR compliant? Yes, we follow international best practices for data protection and privacy. We believe that your business data and your customers' privacy are the most important things we handle.",

  // Category 12 — Addus and AskMela relationship
  "Addus is the technology company behind AskMela. We are located in Addis Ababa and focus on building AI tools that solve real problems for Ethiopians. AskMela is our flagship product to help small businesses go digital.",
  "If your business needs something more custom—like a specialized AI for a bank or a government office—the Addus team can help with that too. We provide custom software consulting alongside the AskMela platform.",
  "What else does Addus build? We are working on several other exciting projects, including local language processing tools and fintech integrations, all aimed at making technology more accessible to Ethiopians."
]

async function seed() {
  try {
    // 1. Ensure the demo business exists
    const { data: existingBiz } = await supabase
      .from('AskMelaBusinesses')
      .select('id')
      .eq('id', demoBusinessId)
      .single()

    if (!existingBiz) {
      console.log('Creating demo business record...')
      const { error: bizError } = await supabase.from('AskMelaBusinesses').insert({
        id: demoBusinessId,
        owner_telegram_id: 0, // System
        owner_phone: '+251900000000',
        name: 'AskMela Official',
        description: 'The official AskMela AI assistant. Answers questions about AskMela features, pricing, setup, and integrations.',
        unique_link: 'askmela_demo',
        is_active: true
      })
      if (bizError) {
        console.error('Failed to create demo business:', bizError)
        throw bizError
      }
    }

    // 2. Clear existing demo documents
    console.log('Clearing existing demo knowledge...')
    await supabase.from('AskMelaDocuments').delete().eq('business_id', demoBusinessId)

    // 3. Process and insert documents
    console.log(`Processing ${documents.length} documents...`)
    let successCount = 0
    let failureCount = 0

    for (let i = 0; i < documents.length; i++) {
      const content = documents[i]
      try {
        const embedding = await generateEmbedding(content)
        
        const { error } = await supabase.from('AskMelaDocuments').insert({
          business_id: demoBusinessId,
          content,
          embedding,
          source_type: 'text'
        })

        if (error) throw error
        successCount++
        if (i % 5 === 0) process.stdout.write(`${i}...`)
      } catch (err) {
        console.error(`\nFailed on document ${i}:`, err)
        failureCount++
      }
    }

    console.log('\n\n✅ Seeding Complete!')
    console.log(`Environment: ${env}`)
    console.log(`Database: ${supabaseUrl}`)
    console.log(`Total documents processed: ${documents.length}`)
    console.log(`Successfully embedded and saved: ${successCount}`)
    console.log(`Failures: ${failureCount}`)

  } catch (err) {
    console.error('Fatal error during seeding:', err)
  }
}

seed()
