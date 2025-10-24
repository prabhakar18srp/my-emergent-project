"""
Test Supabase connection and verify setup
"""
import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']

def test_connection():
    """Test Supabase connection"""
    try:
        print("🔗 Testing Supabase connection...")
        print(f"   URL: {SUPABASE_URL}")
        print(f"   Key: {SUPABASE_KEY[:20]}...")
        
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Try to query users table (will fail if table doesn't exist)
        print("\n✅ Connection successful!")
        print("\n📊 Checking if tables exist...")
        
        try:
            result = supabase.table('users').select("count", count='exact').execute()
            print(f"   ✅ 'users' table exists (count: {result.count})")
        except Exception as e:
            print(f"   ❌ 'users' table not found or error: {str(e)[:100]}")
            print("\n⚠️  You need to execute the SQL schema in Supabase!")
            return False
        
        # Check other tables
        tables = ['campaigns', 'user_sessions', 'comments', 'pledges', 'ai_analyses', 
                  'payment_transactions', 'chat_messages']
        
        for table in tables:
            try:
                result = supabase.table(table).select("count", count='exact').limit(1).execute()
                print(f"   ✅ '{table}' table exists")
            except Exception as e:
                print(f"   ❌ '{table}' table not found")
        
        print("\n✅ Supabase setup is complete!")
        return True
        
    except Exception as e:
        print(f"\n❌ Connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
