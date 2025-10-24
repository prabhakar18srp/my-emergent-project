#!/usr/bin/env python3
"""
Create admin user for CampaignIQ
"""
from supabase import create_client
import os
from dotenv import load_dotenv
import bcrypt
import uuid
from datetime import datetime, timezone

# Load environment variables
load_dotenv('.env')

# Connect to Supabase
supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_KEY'])

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_admin_user(email: str, password: str, name: str):
    """Create an admin user"""
    try:
        # Check if user already exists
        existing = supabase.table('users').select('*').eq('email', email).execute()
        
        if existing.data:
            print(f"❌ User with email {email} already exists")
            user = existing.data[0]
            
            # Update to admin if not already
            if not user.get('is_admin'):
                supabase.table('users').update({'is_admin': True}).eq('email', email).execute()
                print(f"✅ Updated {email} to admin status")
            else:
                print(f"✅ User {email} is already an admin")
            return
        
        # Create new admin user
        user_data = {
            'id': str(uuid.uuid4()),
            'email': email,
            'name': name,
            'password_hash': hash_password(password),
            'is_admin': True,
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        result = supabase.table('users').insert(user_data).execute()
        
        if result.data:
            print(f"✅ Admin user created successfully!")
            print(f"   Email: {email}")
            print(f"   Name: {name}")
            print(f"   Admin: True")
        else:
            print(f"❌ Failed to create admin user")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == '__main__':
    print("🔧 Creating Admin User for CampaignIQ\n")
    
    # Admin credentials
    ADMIN_EMAIL = 'admin123@gmail.com'
    ADMIN_PASSWORD = 'admin@123'
    ADMIN_NAME = 'Admin User'
    
    create_admin_user(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME)
    
    print("\n📊 Current Admin Users:")
    admins = supabase.table('users').select('*').eq('is_admin', True).execute()
    for admin in admins.data:
        print(f"   • {admin['email']} ({admin['name']})")
