"""LLM Service - Handles AI chat responses using OpenAI or Anthropic."""
import os
from typing import List, Optional, Dict, Any
from app.models.chat import ChatResponse, ChatResponseType, Message

# System prompt for the material assistant
SYSTEM_PROMPT = """You are the Bimo Tech Material Assistant, an expert in advanced materials and refractory metals.

Your role is to:
1. Help customers find the right materials for their applications
2. Provide technical specifications and properties
3. Assist with RFQ (Request for Quote) creation
4. Answer questions about tungsten, rhenium, titanium, molybdenum, tantalum, niobium, zirconium, nickel alloys, and sputtering targets

Key facts about Bimo Tech:
- Founded in 1992, based in Warsaw, Poland
- ESA qualified supplier
- ISO 9001 and EN 9100 certified
- Specializes in refractory metals and advanced alloys
- Offers custom manufacturing to specification

When discussing materials, mention:
- Available forms (sheets, rods, wires, tubes, powders)
- Purity levels (typically 99.95% to 99.9999%)
- Key properties (melting point, density, etc.)
- Common applications

Always be helpful and professional. If a customer seems ready to order, suggest adding items to their RFQ basket.

Keep responses concise but informative."""


async def get_chat_response(
    messages: List[Message],
    context: Optional[Dict[str, Any]] = None,
    material_context: Optional[Dict[str, Any]] = None
) -> ChatResponse:
    """Generate a chat response using the LLM."""
    
    # Try OpenAI first, then Anthropic, then fallback
    openai_key = os.getenv("OPENAI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    
    if openai_key:
        return await _get_openai_response(messages, context, material_context)
    elif anthropic_key:
        return await _get_anthropic_response(messages, context, material_context)
    else:
        return _get_fallback_response(messages, material_context)


async def _get_openai_response(
    messages: List[Message],
    context: Optional[Dict[str, Any]],
    material_context: Optional[Dict[str, Any]]
) -> ChatResponse:
    """Get response from OpenAI."""
    try:
        from openai import AsyncOpenAI
        
        client = AsyncOpenAI()
        
        # Build messages for OpenAI
        openai_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Add material context if available
        if material_context:
            openai_messages.append({
                "role": "system",
                "content": f"Relevant material information: {material_context}"
            })
        
        # Add conversation history
        for msg in messages:
            openai_messages.append({
                "role": msg.role.value,
                "content": msg.content
            })
        
        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=openai_messages,
            temperature=0.7,
            max_tokens=500,
        )
        
        content = response.choices[0].message.content
        
        # Determine response type based on content
        response_type = ChatResponseType.TEXT
        if material_context:
            response_type = ChatResponseType.PRODUCT_SUGGESTION
        
        return ChatResponse(
            response=content,
            type=response_type,
            data=material_context,
        )
        
    except Exception as e:
        print(f"OpenAI error: {e}")
        return _get_fallback_response(messages, material_context)


async def _get_anthropic_response(
    messages: List[Message],
    context: Optional[Dict[str, Any]],
    material_context: Optional[Dict[str, Any]]
) -> ChatResponse:
    """Get response from Anthropic Claude."""
    try:
        from anthropic import AsyncAnthropic
        
        client = AsyncAnthropic()
        
        # Build prompt
        system = SYSTEM_PROMPT
        if material_context:
            system += f"\n\nRelevant material information: {material_context}"
        
        # Convert messages
        anthropic_messages = []
        for msg in messages:
            anthropic_messages.append({
                "role": msg.role.value if msg.role.value != "system" else "user",
                "content": msg.content
            })
        
        response = await client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=500,
            system=system,
            messages=anthropic_messages,
        )
        
        content = response.content[0].text
        
        response_type = ChatResponseType.TEXT
        if material_context:
            response_type = ChatResponseType.PRODUCT_SUGGESTION
        
        return ChatResponse(
            response=content,
            type=response_type,
            data=material_context,
        )
        
    except Exception as e:
        print(f"Anthropic error: {e}")
        return _get_fallback_response(messages, material_context)


def _get_fallback_response(
    messages: List[Message],
    material_context: Optional[Dict[str, Any]]
) -> ChatResponse:
    """Fallback response when LLM is unavailable."""
    
    user_message = messages[-1].content.lower() if messages else ""
    
    # Simple keyword-based responses
    if material_context:
        material = material_context.get('name', 'this material')
        return ChatResponse(
            response=f"I found information about **{material}**. This is one of our specialty materials. Would you like to add it to your RFQ basket for a quote?",
            type=ChatResponseType.PRODUCT_SUGGESTION,
            data=material_context,
        )
    
    if any(word in user_message for word in ['quote', 'price', 'cost', 'buy', 'order']):
        return ChatResponse(
            response="I'd be happy to help you get a quote! You can add materials to your RFQ basket and submit them for pricing. What materials are you interested in?",
            type=ChatResponseType.TEXT,
        )
    
    if any(word in user_message for word in ['tungsten', 'rhenium', 'titanium', 'molybdenum']):
        return ChatResponse(
            response="We offer a comprehensive range of refractory metals. You can browse our full catalog on the Products page, or tell me more about your specific requirements and I'll help you find the right material.",
            type=ChatResponseType.TEXT,
        )
    
    return ChatResponse(
        response="I'm here to help you find the right materials for your application. You can ask me about specific materials like tungsten, titanium, or nickel alloys, or tell me about your project requirements.",
        type=ChatResponseType.TEXT,
    )

