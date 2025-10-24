"""
Setup Supabase schema programmatically
"""
import os
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client, Client

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']

def setup_schema():
    """Setup database schema using Supabase client"""
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Read SQL file
    with open(ROOT_DIR / 'EXECUTE_THIS_SQL_IN_SUPABASE.sql', 'r') as f:
        sql_content = f.read()
    
    print("🚀 Setting up Supabase schema...")
    print("\n" + "=" * 80)
    print("📋 Please execute this SQL in Supabase Dashboard:")
    print("=" * 80)
    print("\n1. Visit: https://app.supabase.com/project/owiswasjugljbntqeuad/sql/new")
    print("2. Copy and paste the SQL below")
    print("3. Click 'Run' to execute\n")
    print("-" * 80)
    print(sql_content)
    print("-" * 80)
    print("\nNote: The Supabase Python client doesn't support raw SQL execution.")
    print("You need to run this SQL directly in the Supabase SQL Editor.")
    print("=" * 80)

if __name__ == "__main__":
    setup_schema()
