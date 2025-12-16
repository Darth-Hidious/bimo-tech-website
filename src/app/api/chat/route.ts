import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are Bimo, the friendly materials specialist for Bimo Tech - a supplier of advanced refractory metals and specialty alloys based in Warsaw, Poland (founded 1992, ESA qualified, ISO 9001 & EN 9100 certified).

Your personality:
- Helpful, knowledgeable, and professional but friendly
- Use short, clear responses (2-3 sentences max unless technical detail is requested)
- Be conversational, not robotic

You help customers with:
- Finding the right materials for their applications
- Technical specifications and properties
- Starting quote requests (RFQs)
- Answering questions about materials

Key materials we offer:
- Tungsten (W) - highest melting point metal, used for furnace elements, electrodes
- Rhenium (Re) - highest modulus of elasticity, aerospace propulsion
- Titanium (Ti) - high strength-to-weight, medical/aerospace
- Molybdenum (Mo) - high temp stability, glass industry
- Tantalum (Ta) - exceptional corrosion resistance, chemical processing
- Niobium (Nb) - superconducting properties, MRI/particle accelerators
- Nickel alloys - Inconel, Hastelloy, Monel for high-temp/corrosion
- Sputtering targets - 4N to 7N purity for thin-film deposition

Available forms: sheets, rods, wires, tubes, fasteners, powders, custom parts

When users seem interested in buying, suggest adding items to their RFQ basket.
Keep responses concise and helpful. Use markdown **bold** for emphasis.`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

async function callClaude(messages: ChatMessage[]) {
  if (!ANTHROPIC_API_KEY) return null;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages.filter(m => m.role !== 'system').map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      console.error('Claude API error:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude error:', error);
    return null;
  }
}

async function callOpenAI(messages: ChatMessage[]) {
  if (!OPENAI_API_KEY) return null;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.filter(m => m.role !== 'system'),
        ],
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error);
    return null;
  }
}

function getSmartFallback(userMessage: string, context: any): string {
  const msg = userMessage.toLowerCase();
  
  // Material-specific responses
  if (msg.includes('tungsten') || msg.includes('wolfram')) {
    return "**Tungsten** is our specialty - highest melting point of any metal (3422°C). We offer sheets, rods, wires, electrodes, and crucibles in 99.95%+ purity. Popular for furnace components and X-ray targets. Want me to add some to your quote?";
  }
  if (msg.includes('rhenium')) {
    return "**Rhenium** has the highest modulus of elasticity among heat-resistant metals. Perfect for aerospace propulsion and thermocouples. We supply pure Re and Re alloys (Mo-Re, W-Re). Interested in a quote?";
  }
  if (msg.includes('titanium')) {
    return "**Titanium** offers excellent strength-to-weight ratio and biocompatibility. We have Grade 1-4 CP, Grade 5 (Ti6Al4V), and Grade 23 ELI for medical use. Available as sheets, rods, tubes, and fasteners.";
  }
  if (msg.includes('molybdenum') || msg.includes('moly')) {
    return "**Molybdenum** - great thermal stability and low expansion. We supply pure Mo, TZM alloy, and Mo-Cu composites. Common in glass melting electrodes and high-temp furnaces.";
  }
  if (msg.includes('tantalum')) {
    return "**Tantalum** has exceptional corrosion resistance from its stable oxide layer. Perfect for chemical processing equipment. We offer pure Ta and alloys like Ta-2.5W and Ta-10W.";
  }
  if (msg.includes('niobium') || msg.includes('columbium')) {
    return "**Niobium** is known for superconducting properties. Essential for MRI magnets and particle accelerators. We supply pure Nb and Nb-Ti superconductor wire.";
  }
  if (msg.includes('nickel') || msg.includes('inconel') || msg.includes('hastelloy')) {
    return "We offer a full range of **nickel superalloys**: Inconel (625, 718), Hastelloy, Monel, and Nimonic. Excellent for high-temp and corrosive environments. What application do you have in mind?";
  }
  if (msg.includes('sputter') || msg.includes('target') || msg.includes('pvd')) {
    return "Our **sputtering targets** range from 4N (99.99%) to 7N (99.99999%) purity. We supply flat targets, rotary targets, and custom shapes. Materials include pure metals, alloys, oxides, and nitrides.";
  }
  
  // Intent-based responses
  if (msg.includes('quote') || msg.includes('price') || msg.includes('cost') || msg.includes('buy') || msg.includes('order')) {
    return "I'd be happy to help with a quote! Tell me what material you need, the form (sheet, rod, wire, etc.), and approximate quantity. I'll add it to your RFQ basket.";
  }
  if (msg.includes('custom') || msg.includes('machined') || msg.includes('manufactured')) {
    return "Yes, we do **custom manufacturing**! We can machine parts to your specifications from any of our materials. Just share your drawings or describe what you need.";
  }
  if (msg.includes('certif') || msg.includes('iso') || msg.includes('quality')) {
    return "Bimo Tech is **ISO 9001** and **EN 9100** certified (aerospace quality). We're also an **ESA qualified supplier**. All materials come with full mill certifications and test reports.";
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hi there! I'm Bimo, your materials specialist. Looking for refractory metals, titanium, nickel alloys, or sputtering targets? I can help you find what you need and start a quote.";
  }
  
  // Default response
  if (context?.basketCount > 0) {
    return `I'm here to help! You already have ${context.basketCount} item(s) in your basket. Want to add more materials, or ready to submit your quote request?`;
  }
  return "I can help you find materials like tungsten, titanium, rhenium, nickel alloys, or sputtering targets. What are you working on?";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, context } = body;
    
    // Get the last user message
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // Try Claude first, then OpenAI, then smart fallback
    let response = await callClaude(messages);
    
    if (!response) {
      response = await callOpenAI(messages);
    }
    
    if (!response) {
      response = getSmartFallback(userMessage, context);
    }

    return NextResponse.json({
      response,
      type: 'text',
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json({
      response: "I can help you find materials! Try asking about tungsten, titanium, rhenium, or any of our specialty metals.",
      type: 'text',
    });
  }
}

