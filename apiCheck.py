import os
from dotenv import load_dotenv
from google import genai
from google.genai.errors import APIError

# 1. Load the variables from your .env file
load_dotenv()

# 2. Safety check to ensure the variable was actually loaded
if not os.getenv("GEMINI_API_KEY"):
    print("❌ Error: GEMINI_API_KEY not found in your environment or .env file.")
    exit(1)

# 3. Initialize the official client
client = genai.Client()

try:
    print("Sending test request to Gemini...")
    # 4. Use the recommended lightweight model for testing
    response = client.models.generate_content(
        model='gemini-3.6-flash',
        contents='Respond with the single word: "Success!"',
    )
    print("\n✅ API Key works perfectly!")
    print(f"Gemini Response: {response.text.strip()}")

except APIError as e:
    print(f"\n❌ API Error occurred (Check Google AI Studio configuration):")
    print(f"Code: {e.code} | Message: {e.message}")
except Exception as e:
    print(f"\n❌ An unexpected error occurred: {e}")
