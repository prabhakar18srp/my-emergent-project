"""
Initialize Supabase Database Schema via Supabase Management API
"""
import os
import requests
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']

# Read SQL file
with open(ROOT_DIR / 'EXECUTE_THIS_SQL_IN_SUPABASE.sql', 'r') as f:
    sql_statements = f.read()

print("🗄️  Initializing Supabase Database Schema...")
print("\n" + "="*80)
print("⚠️  MANUAL STEP REQUIRED")
print("="*80)
print("\nTo set up your database schema, please follow these steps:\n")
print("1. Open Supabase Dashboard: https://app.supabase.com/project/owiswasjugljbntqeuad")
print("2. Navigate to 'SQL Editor' in the left sidebar")
print("3. Click 'New Query'")
print("4. Copy and paste the following SQL:\n")
print("-"*80)
print(sql_statements)
print("-"*80)
print("\n5. Click 'RUN' button to execute the schema")
print("\n" + "="*80)
print("✅ After running the SQL, your database will be ready!")
print("="*80)
