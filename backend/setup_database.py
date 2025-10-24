"""
Script to set up Supabase database schema
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']

def setup_database():
    """Execute SQL schema to create all tables"""
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Read SQL schema file
    with open(ROOT_DIR / 'setup_supabase_schema.sql', 'r') as f:
        sql_commands = f.read()
    
    print("Setting up Supabase database schema...")
    
    # Split commands and execute them (Note: Supabase Python client doesn't directly support raw SQL execution)
    # You'll need to execute this SQL manually in Supabase SQL Editor or use PostgREST
    print("\n" + "="*80)
    print("⚠️  IMPORTANT: Execute the following SQL in your Supabase SQL Editor:")
    print("="*80)
    print(sql_commands)
    print("="*80)
    print("\nSteps:")
    print("1. Go to https://owiswasjugljbntqeuad.supabase.co")
    print("2. Navigate to SQL Editor")
    print("3. Copy and paste the SQL from 'setup_supabase_schema.sql'")
    print("4. Click 'Run' to execute")
    print("\nAfter running the SQL, your database will be ready!")
    
    return supabase

if __name__ == "__main__":
    setup_database()
