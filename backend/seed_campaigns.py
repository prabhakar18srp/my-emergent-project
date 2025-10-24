import asyncio
import os
from datetime import datetime, timezone
import uuid
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Sample campaign data
CAMPAIGNS = [
    {
        "title": "Smart Garden: Automated Plant Care System",
        "description": "Transform your gardening experience with our AI-powered smart garden system. Monitor soil moisture, light levels, and automatically water your plants. Perfect for busy individuals who love plants but lack time for daily care.",
        "category": "Technology",
        "goal_amount": 25000,
        "raised_amount": 18750,
        "backers_count": 234,
        "image_url": "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=600&fit=crop"
    },
    {
        "title": "EcoBottle: Self-Cleaning Water Bottle",
        "description": "Revolutionary water bottle with UV-C LED technology that eliminates 99.9% of bacteria and viruses. Keep your water fresh and safe wherever you go. Made from sustainable materials with a lifetime warranty.",
        "category": "Health",
        "goal_amount": 15000,
        "raised_amount": 22500,
        "backers_count": 456,
        "image_url": "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&h=600&fit=crop"
    },
    {
        "title": "Grandma's Recipe Book: Heritage Cooking",
        "description": "A beautiful cookbook celebrating traditional family recipes passed down through generations. Features over 200 authentic dishes with modern adaptations, stunning photography, and heartwarming stories from families around the world.",
        "category": "Food",
        "goal_amount": 12000,
        "raised_amount": 15600,
        "backers_count": 312,
        "image_url": "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=600&fit=crop"
    },
    {
        "title": "Urban Beekeeping Kit: Save the Bees",
        "description": "Join the movement to save our pollinators! Our compact urban beekeeping kit makes it easy to maintain a hive in small spaces. Includes everything needed to start, plus online training from expert beekeepers.",
        "category": "Environment",
        "goal_amount": 30000,
        "raised_amount": 8500,
        "backers_count": 127,
        "image_url": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=600&fit=crop"
    },
    {
        "title": "Learn to Code: Interactive Kids Platform",
        "description": "Make coding fun for children aged 6-12 with our gamified learning platform. Features interactive puzzles, animated characters, and projects that teach real programming concepts. Built by educators and developers.",
        "category": "Education",
        "goal_amount": 45000,
        "raised_amount": 52000,
        "backers_count": 678,
        "image_url": "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop"
    },
    {
        "title": "Artisan Coffee Roastery: Small Batch Excellence",
        "description": "Support our dream of opening a community coffee roastery focused on ethical sourcing and perfect roasts. We work directly with farmers, ensuring fair prices and exceptional quality. Join us for the freshest coffee experience.",
        "category": "Food",
        "goal_amount": 35000,
        "raised_amount": 28000,
        "backers_count": 198,
        "image_url": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop"
    },
    {
        "title": "Wireless Charging Mat: Power Everything",
        "description": "One mat to charge them all! Our innovative 5-coil wireless charging mat can power up to 4 devices simultaneously. Fast charging, sleek design, and compatible with all Qi-enabled devices. Say goodbye to cable clutter.",
        "category": "Technology",
        "goal_amount": 20000,
        "raised_amount": 31000,
        "backers_count": 521,
        "image_url": "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=600&fit=crop"
    },
    {
        "title": "Mindful Meditation App: Mental Wellness",
        "description": "Achieve inner peace with our AI-guided meditation app. Personalized sessions based on your mood, stress levels, and goals. Features sleep stories, breathing exercises, and a supportive community. Free version for everyone.",
        "category": "Health",
        "goal_amount": 18000,
        "raised_amount": 9800,
        "backers_count": 156,
        "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop"
    },
    {
        "title": "Documentary: Ocean Plastic Crisis",
        "description": "An eye-opening documentary exploring the global plastic pollution crisis and innovative solutions. Follow scientists, activists, and communities working to save our oceans. Educational content for schools included.",
        "category": "Film",
        "goal_amount": 50000,
        "raised_amount": 42500,
        "backers_count": 389,
        "image_url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"
    },
    {
        "title": "Local Art Gallery: Community Creative Space",
        "description": "Help us create a welcoming gallery and workspace for local artists. A place to exhibit, teach, and collaborate. Monthly exhibitions, workshops, and events that bring our community together through art.",
        "category": "Art",
        "goal_amount": 28000,
        "raised_amount": 19500,
        "backers_count": 243,
        "image_url": "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=800&h=600&fit=crop"
    }
]

async def seed_campaigns():
    try:
        # Connect to Supabase
        SUPABASE_URL = os.environ.get('SUPABASE_URL')
        SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
        
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file")
            return
            
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Connected to Supabase")
        
        # Check if campaigns already exist
        result = supabase.table("campaigns").select("*").execute()
        existing_count = len(result.data) if result.data else 0
        
        if existing_count >= 10:
            print(f"Database already has {existing_count} campaigns. Skipping seed.")
            return
        
        # Create a seed user first if doesn't exist
        seed_user_id = str(uuid.uuid4())
        try:
            # Check if seed user exists
            user_result = supabase.table("users").select("*").eq("email", "admin@campaigniq.com").execute()
            if user_result.data and len(user_result.data) > 0:
                seed_user_id = user_result.data[0]["id"]
                print(f"Using existing seed user: {seed_user_id}")
            else:
                # Create seed user
                user_data = {
                    "id": seed_user_id,
                    "email": "admin@campaigniq.com",
                    "name": "Platform Admin",
                    "is_admin": True,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                user_insert = supabase.table("users").insert(user_data).execute()
                print(f"Created seed user: {seed_user_id}")
        except Exception as e:
            print(f"Note: {e}")
        
        # Insert campaigns
        for campaign_data in CAMPAIGNS:
            campaign = {
                "id": str(uuid.uuid4()),
                "title": campaign_data["title"],
                "description": campaign_data["description"],
                "category": campaign_data["category"],
                "goal_amount": campaign_data["goal_amount"],
                "raised_amount": campaign_data["raised_amount"],
                "creator_id": seed_user_id,
                "creator_name": "Platform Admin",
                "image_url": campaign_data["image_url"],
                "status": "active",
                "backers_count": campaign_data["backers_count"],
                "duration_days": 30,
                "tags": [],
                "reward_tiers": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            result = supabase.table("campaigns").insert(campaign).execute()
            print(f"Created campaign: {campaign['title']}")
        
        print(f"\nSuccessfully seeded {len(CAMPAIGNS)} campaigns!")
        
    except Exception as e:
        print(f"Error seeding campaigns: {e}")

if __name__ == "__main__":
    asyncio.run(seed_campaigns())
