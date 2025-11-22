from fastapi import APIRouter

router = APIRouter()

@router.get("/projects")
async def get_investor_projects():
    # Mock data matching frontend structure
    return [
        {
            "id": 1,
            "name": "Orbital Debris Removal",
            "status": "Success",
            "description": "Successfully deployed prototype in LEO.",
            "funding": "$2.5M",
            "date": "2024-01-15"
        },
        {
            "id": 2,
            "name": "Lunar Habitat Module",
            "status": "Deathloop",
            "description": "Stuck in funding rounds. Technical validation pending.",
            "funding": "$500k (Burned)",
            "date": "2023-11-20"
        },
        {
            "id": 3,
            "name": "Mars Rover AI Navigation",
            "status": "Failed",
            "description": "Project cancelled due to sensor limitations.",
            "funding": "$1.2M",
            "date": "2023-08-10"
        },
        {
            "id": 4,
            "name": "Deep Space Comms Array",
            "status": "Success",
            "description": "Contract secured with ESA.",
            "funding": "$5.0M",
            "date": "2024-02-01"
        }
    ]
