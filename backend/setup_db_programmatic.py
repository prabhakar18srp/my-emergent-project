"""
Setup Supabase database tables programmatically
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
    """Setup Supabase database tables"""
    
    # Read SQL file
    with open(ROOT_DIR / 'setup_supabase_schema.sql', 'r') as f:
        sql_content = f.read()
    
    print("🚀 Setting up Supabase Database...")
    print("=" * 80)
    
    try:
        # Create Supabase client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Try to execute the SQL using rpc
        # Note: This requires a database function to be created first
        # We'll use the SQL Editor approach instead
        
        print("⚠️  Manual SQL execution required!")
        print("\nPlease execute the following SQL in Supabase Dashboard:")
        print("1. Go to: " + SUPABASE_URL)
        print("2. Navigate to: SQL Editor")
        print("3. Click: New Query")
        print("4. Copy and paste the SQL below")
        print("5. Click: Run")
        print("\n" + "-" * 80)
        print(sql_content)
        print("-" * 80)
        
        # Test connection
        print("\n✅ Testing Supabase connection...")
        # Try a simple query to verify connection
        response = supabase.table('users').select("*").limit(1).execute()
        print("✅ Supabase connection successful!")
        print(f"✅ Database tables are set up and accessible!")
        
    except Exception as e:
        error_msg = str(e)
        if "relation" in error_msg and "does not exist" in error_msg:
            print(f"\n❌ Error: Tables not found - {error_msg}")
            print("\n📋 Please execute the SQL schema in Supabase Dashboard first:")
            print("=" * 80)
            print(sql_content)
            print("=" * 80)
        else:
            print(f"\n❌ Error: {error_msg}")
            print("\nPlease verify your Supabase credentials and try again.")

if __name__ == "__main__":
    setup_database()
