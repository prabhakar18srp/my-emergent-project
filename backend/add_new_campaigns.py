import asyncio
import os
from datetime import datetime, timezone
import uuid
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# 10 NEW unique sample campaigns
NEW_CAMPAIGNS = [
    {
        "title": "Solar-Powered Backpack: Never Run Out of Battery",
        "description": "Revolutionary backpack with integrated solar panels that charge all your devices on the go. Perfect for travelers, hikers, and digital nomads. Features USB-C, wireless charging, and waterproof design.",
        "category": "Technology",
        "goal_amount": 35000,
        "raised_amount": 12500,
        "backers_count": 167,
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop"
    },
    {
        "title": "Therapeutic Coloring Books for Adults",
        "description": "Beautifully illustrated coloring books designed by psychologists to reduce stress and anxiety. Each book features mindfulness prompts and intricate patterns. Includes premium quality paper and a starter set of colored pencils.",
        "category": "Art",
        "goal_amount": 10000,
        "raised_amount": 8900,
        "backers_count": 234,
        "image_url": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop"
    },
    {
        "title": "Fermented Foods Workshop Series",
        "description": "Learn the ancient art of fermentation! Monthly workshops covering kombucha, kimchi, sauerkraut, and more. Includes starter kits, recipes, and lifetime access to our online community of fermentation enthusiasts.",
        "category": "Food",
        "goal_amount": 18000,
        "raised_amount": 22300,
        "backers_count": 412,
        "image_url": "https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=800&h=600&fit=crop"
    },
    {
        "title": "Portable Recording Studio: Music On The Move",
        "description": "Professional-quality portable recording booth that fits in a backpack. Perfect for podcasters, musicians, and content creators. Features soundproofing panels, built-in lighting, and easy setup in under 5 minutes.",
        "category": "Music",
        "goal_amount": 42000,
        "raised_amount": 18600,
        "backers_count": 198,
        "image_url": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop"
    },
    {
        "title": "Children's Science Lab: At-Home Experiments",
        "description": "Monthly subscription box delivering safe, educational science experiments for kids aged 8-14. Each box contains materials for 4-5 experiments with video tutorials and STEM learning objectives. Make science fun!",
        "category": "Education",
        "goal_amount": 28000,
        "raised_amount": 35400,
        "backers_count": 589,
        "image_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop"
    },
    {
        "title": "Zero-Waste Cleaning Products Kit",
        "description": "Complete home cleaning kit with eco-friendly, plastic-free products. Includes reusable containers, natural ingredients, and recipes to make your own cleaners. Save money while saving the planet!",
        "category": "Environment",
        "goal_amount": 15000,
        "raised_amount": 19800,
        "backers_count": 445,
        "image_url": "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=600&fit=crop"
    },
    {
        "title": "Virtual Reality Fitness: Gamified Workouts",
        "description": "Transform your fitness routine with our VR workout platform. Battle enemies, explore worlds, and compete with friends while getting in shape. Compatible with all major VR headsets. Includes personal trainer AI.",
        "category": "Health",
        "goal_amount": 65000,
        "raised_amount": 42100,
        "backers_count": 678,
        "image_url": "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=600&fit=crop"
    },
    {
        "title": "Indie Film: The Bridge Between Worlds",
        "description": "A touching drama about a young immigrant finding her identity between two cultures. Features an all-Asian cast and crew. Shot on location across three countries. Your support helps tell stories that matter.",
        "category": "Film",
        "goal_amount": 85000,
        "raised_amount": 56700,
        "backers_count": 342,
        "image_url": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop"
    },
    {
        "title": "Escape Room Board Game: Mystery Mansion",
        "description": "Award-winning escape room designers bring their puzzles home! Solve mysteries, decode clues, and escape the mansion. Replayable with multiple storylines. Includes app integration for hints and atmospheric sound effects.",
        "category": "Games",
        "goal_amount": 38000,
        "raised_amount": 51200,
        "backers_count": 723,
        "image_url": "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&h=600&fit=crop"
    },
    {
        "title": "Sustainable Fashion Line: Ocean Plastic Apparel",
        "description": "High-fashion clothing made entirely from recycled ocean plastic. Every piece removes 5kg of plastic from our seas. Stylish, comfortable, and environmentally responsible. Join the fashion revolution!",
        "category": "Fashion",
        "goal_amount": 55000,
        "raised_amount": 38900,
        "backers_count": 487,
        "image_url": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop"
    }
]

async def add_campaigns():
    try:
        # Connect to Supabase
        SUPABASE_URL = os.environ.get('SUPABASE_URL')
        SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
        
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file")
            return
            
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Connected to Supabase")
        
        # Get or create a creator user
        creator_user_id = str(uuid.uuid4())
        try:
            # Check if demo user exists
            user_result = supabase.table("users").select("*").eq("email", "campaigns@demo.com").execute()
            if user_result.data and len(user_result.data) > 0:
                creator_user_id = user_result.data[0]["id"]
                print(f"Using existing user: {creator_user_id}")
            else:
                # Create new user for these campaigns
                user_data = {
                    "id": creator_user_id,
                    "email": "campaigns@demo.com",
                    "name": "Campaign Creator",
                    "is_admin": False,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                user_insert = supabase.table("users").insert(user_data).execute()
                print(f"Created new user: {creator_user_id}")
        except Exception as e:
            print(f"User creation note: {e}")
        
        # Insert new campaigns
        created_count = 0
        for campaign_data in NEW_CAMPAIGNS:
            campaign = {
                "id": str(uuid.uuid4()),
                "title": campaign_data["title"],
                "description": campaign_data["description"],
                "category": campaign_data["category"],
                "goal_amount": campaign_data["goal_amount"],
                "raised_amount": campaign_data["raised_amount"],
                "creator_id": creator_user_id,
                "creator_name": "Campaign Creator",
                "image_url": campaign_data["image_url"],
                "status": "active",
                "backers_count": campaign_data["backers_count"],
                "duration_days": 30,
                "tags": ["new", "featured"],
                "reward_tiers": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            try:
                result = supabase.table("campaigns").insert(campaign).execute()
                print(f"✓ Created campaign: {campaign['title']}")
                created_count += 1
            except Exception as e:
                print(f"✗ Error creating campaign '{campaign['title']}': {e}")
        
        print(f"\n{'='*60}")
        print(f"Successfully created {created_count} out of {len(NEW_CAMPAIGNS)} new campaigns!")
        print(f"{'='*60}")
        
    except Exception as e:
        print(f"Error adding campaigns: {e}")

if __name__ == "__main__":
    asyncio.run(add_campaigns())
