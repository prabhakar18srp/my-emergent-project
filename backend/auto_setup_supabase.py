"""
Automatically set up Supabase database schema using PostgREST
"""
import os
import requests
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']

def execute_sql_via_rest():
    """Execute SQL via Supabase REST API"""
    
    # Read SQL file
    with open(ROOT_DIR / 'setup_supabase_schema.sql', 'r') as f:
        sql_content = f.read()
    
    print("=" * 80)
    print("🚀 Setting up Supabase Database Schema")
    print("=" * 80)
    
    print("\n📋 SQL Script to execute:")
    print("-" * 80)
    print(sql_content)
    print("-" * 80)
    
    print("\n⚠️  MANUAL SETUP REQUIRED:")
    print("Since Supabase Python client doesn't support raw SQL execution,")
    print("please follow these steps:\n")
    print("1. Go to: https://owiswasjugljbntqeuad.supabase.co")
    print("2. Navigate to: SQL Editor (in the left sidebar)")
    print("3. Click: 'New Query'")
    print("4. Copy the SQL script shown above")
    print("5. Paste it into the SQL Editor")
    print("6. Click: 'Run' (or press Ctrl+Enter)")
    print("\n✅ After running the SQL, your database will be ready!")
    print("=" * 80)
    
    # Save SQL to a file for easy access
    sql_file_path = ROOT_DIR / 'EXECUTE_THIS_SQL_IN_SUPABASE.sql'
    with open(sql_file_path, 'w') as f:
        f.write(sql_content)
    
    print(f"\n📄 SQL script saved to: {sql_file_path}")
    print("You can also find it in /app/backend/EXECUTE_THIS_SQL_IN_SUPABASE.sql")
    
if __name__ == "__main__":
    execute_sql_via_rest()
