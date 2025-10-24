#!/usr/bin/env python3
"""
Test Gemini API integration
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv('.env')

print("=" * 80)
print("🧪 Testing Gemini API Integration")
print("=" * 80)

# Configure Gemini
gemini_key = os.environ.get('GEMINI_API_KEY')
print(f"\n✓ Gemini API Key found: {gemini_key[:20]}...")

genai.configure(api_key=gemini_key)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

print("\n📝 Test 1: Campaign Title Optimization")
print("-" * 80)
try:
    prompt = """Generate 3 alternative campaign titles for:
    Title: Smart Garden System
    Category: Technology
    
    Return ONLY a JSON array of 3 titles."""
    
    response = model.generate_content(prompt)
    print("✅ Response received:")
    print(response.text[:200] + "...")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n📝 Test 2: AI Chat")
print("-" * 80)
try:
    chat_prompt = "What are the key factors for a successful crowdfunding campaign?"
    response = model.generate_content(chat_prompt)
    print("✅ Response received:")
    print(response.text[:200] + "...")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n📝 Test 3: Success Prediction")
print("-" * 80)
try:
    prediction_prompt = """Analyze this campaign and predict success percentage (0-100):
    Title: Smart Garden System
    Category: Technology
    Goal: $50,000
    Description: AI-powered automated garden system
    
    Respond with ONLY a number between 0-100."""
    
    response = model.generate_content(prediction_prompt)
    print("✅ Response received:")
    print(f"Success Probability: {response.text.strip()}")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 80)
print("✅ All Gemini API tests completed!")
print("=" * 80)
