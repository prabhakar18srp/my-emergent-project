"""
Setup Supabase database tables programmatically
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']

print("=" * 80)
print("🚀 CampaignIQ - Supabase Database Setup")
print("=" * 80)
print(f"\n📍 Supabase URL: {SUPABASE_URL}")
print(f"🔑 Using API Key: {SUPABASE_KEY[:20]}...")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Read SQL file
sql_file_path = ROOT_DIR / 'setup_supabase_schema.sql'
with open(sql_file_path, 'r') as f:
    sql_content = f.read()

print("\n" + "=" * 80)
print("📋 MANUAL DATABASE SETUP REQUIRED")
print("=" * 80)
print("\nThe Supabase Python client doesn't support direct SQL execution.")
print("Please follow these steps to set up your database:\n")
print(f"1. Open your browser and go to:")
print(f"   👉 {SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/')}")
print("\n2. In the left sidebar, click on: 'SQL Editor'")
print("\n3. Click: 'New Query' button")
print("\n4. Copy the SQL script from this file:")
print(f"   📄 {sql_file_path}")
print("\n5. Paste it into the SQL Editor")
print("\n6. Click: 'Run' button (or press Ctrl+Enter / Cmd+Enter)")
print("\n" + "=" * 80)
print("📝 SQL SCRIPT PREVIEW")
print("=" * 80)
print(sql_content[:500] + "...\n")
print("✅ Once you've run the SQL, your database will be ready!")
print("=" * 80)

# Test connection
try:
    print("\n🔍 Testing Supabase connection...")
    # Try to query any table to test connection
    result = supabase.table("users").select("*").limit(1).execute()
    print("✅ Successfully connected to Supabase!")
    print("✅ Database tables are already set up!")
except Exception as e:
    error_msg = str(e)
    if "relation" in error_msg.lower() and "does not exist" in error_msg.lower():
        print("⚠️  Database tables not found. Please run the SQL script as instructed above.")
    else:
        print(f"⚠️  Connection test: {error_msg}")
    print("\n💡 If you haven't set up the tables yet, please follow the manual setup instructions above.")

print("\n" + "=" * 80)
