import asyncio
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Best 13 unique campaigns to keep (selected for diversity and quality)
BEST_CAMPAIGNS = [
    "SmartGarden Pro: AI-Powered Growing System",  # Technology - High performance
    "Ocean Cleanup Initiative",  # Environment
    "Community Learning Center",  # Education
    "Escape Room Board Game: Mystery Mansion",  # Games - Exceeded goal
    "Indie Film: The Bridge Between Worlds",  # Film - High backing
    "Wireless Charging Mat: Power Everything",  # Technology - Exceeded goal
    "Minimalist Wooden Watch Collection",  # Fashion
    "Children's Science Lab: At-Home Experiments",  # Education - Exceeded goal
    "Zero-Waste Cleaning Products Kit",  # Environment - Exceeded goal
    "Virtual Reality Fitness: Gamified Workouts",  # Health
    "Fermented Foods Workshop Series",  # Food - Exceeded goal
    "Sustainable Fashion Line: Ocean Plastic Apparel",  # Fashion - Unique
    "Portable Recording Studio: Music On The Move"  # Music - Unique category
]

async def cleanup_campaigns():
    try:
        # Connect to Supabase
        SUPABASE_URL = os.environ.get('SUPABASE_URL')
        SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
        
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file")
            return
            
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Connected to Supabase")
        
        # Get all campaigns
        result = supabase.table("campaigns").select("*").execute()
        all_campaigns = result.data if result.data else []
        
        print(f"\nTotal campaigns before cleanup: {len(all_campaigns)}")
        
        # Find campaigns to keep
        campaigns_to_keep_ids = []
        for campaign_title in BEST_CAMPAIGNS:
            for campaign in all_campaigns:
                if campaign['title'] == campaign_title:
                    campaigns_to_keep_ids.append(campaign['id'])
                    print(f"✓ Keeping: {campaign['title']}")
                    break
        
        print(f"\nCampaigns to keep: {len(campaigns_to_keep_ids)}")
        
        # Delete campaigns not in the keep list
        deleted_count = 0
        for campaign in all_campaigns:
            if campaign['id'] not in campaigns_to_keep_ids:
                try:
                    supabase.table("campaigns").delete().eq("id", campaign['id']).execute()
                    print(f"✗ Deleted: {campaign['title']}")
                    deleted_count += 1
                except Exception as e:
                    print(f"Error deleting {campaign['title']}: {e}")
        
        print(f"\n{'='*60}")
        print(f"Cleanup complete!")
        print(f"Deleted: {deleted_count} campaigns")
        print(f"Remaining: {len(campaigns_to_keep_ids)} campaigns")
        print(f"{'='*60}")
        
    except Exception as e:
        print(f"Error during cleanup: {e}")

if __name__ == "__main__":
    asyncio.run(cleanup_campaigns())
