"""Supplier Matching Service - Matches RFQ items to appropriate suppliers."""
from typing import List, Dict, Any
from app.models.rfq import RFQSession, SupplierMatch
from app.services.firebase import get_suppliers


# Material to capability mapping
MATERIAL_CAPABILITIES = {
    'tungsten': ['tungsten', 'refractory-metals', 'high-temp'],
    'rhenium': ['rhenium', 'refractory-metals', 'high-temp', 'aerospace'],
    'titanium': ['titanium', 'aerospace', 'medical'],
    'molybdenum': ['molybdenum', 'refractory-metals', 'electronics'],
    'tantalum': ['tantalum', 'refractory-metals', 'chemical'],
    'niobium': ['niobium', 'superconductor', 'electronics'],
    'nickel': ['nickel', 'superalloys', 'corrosion-resistant'],
    'inconel': ['nickel', 'superalloys', 'high-temp'],
    'hastelloy': ['nickel', 'superalloys', 'corrosion-resistant'],
    'stellite': ['cobalt', 'wear-resistant'],
    'copper': ['copper', 'electrical'],
    'zirconium': ['zirconium', 'nuclear', 'chemical'],
}


def extract_material_keyword(material_name: str) -> str:
    """Extract the primary material keyword from a material name."""
    material_lower = material_name.lower()
    
    for keyword in MATERIAL_CAPABILITIES.keys():
        if keyword in material_lower:
            return keyword
    
    return material_lower.split()[0] if material_lower else 'general'


async def match_suppliers_for_rfq(rfq: RFQSession) -> List[Dict[str, List[SupplierMatch]]]:
    """
    Match suppliers for each item in an RFQ.
    
    Returns a mapping of item_id to list of matched suppliers.
    """
    # Get all active suppliers
    all_suppliers = await get_suppliers()
    
    matches = {}
    
    for item in rfq.items:
        item_matches = []
        material_keyword = extract_material_keyword(item.material)
        required_capabilities = MATERIAL_CAPABILITIES.get(material_keyword, [material_keyword])
        
        for supplier in all_suppliers:
            supplier_caps = [c.lower() for c in supplier.get('capabilities', [])]
            
            # Calculate capability score
            matching_caps = sum(1 for cap in required_capabilities if cap in supplier_caps)
            if matching_caps == 0:
                continue
            
            capability_score = matching_caps / len(required_capabilities)
            
            # Adjust score based on certifications if specified
            # (e.g., aerospace items prefer EN9100 certified suppliers)
            certs = supplier.get('certifications', [])
            if 'EN9100' in certs:
                capability_score *= 1.1
            if 'ISO9001' in certs:
                capability_score *= 1.05
            
            # Cap at 1.0
            capability_score = min(capability_score, 1.0)
            
            item_matches.append(SupplierMatch(
                supplier_id=supplier['id'],
                capability_score=capability_score,
                estimated_lead_time=supplier.get('avg_lead_time'),
                price_tier=supplier.get('price_tier'),
            ))
        
        # Sort by capability score (descending) and take top 3
        item_matches.sort(key=lambda x: x.capability_score, reverse=True)
        matches[item.id] = item_matches[:3]
    
    return matches


async def get_recommended_suppliers(
    material: str,
    quantity: str = None,
    urgency: str = None
) -> List[Dict[str, Any]]:
    """
    Get recommended suppliers for a material with optional filters.
    
    Args:
        material: Material name or type
        quantity: Quantity requirement (affects supplier selection)
        urgency: 'standard', 'rush', or 'flexible'
    
    Returns:
        List of recommended suppliers with scores
    """
    all_suppliers = await get_suppliers()
    material_keyword = extract_material_keyword(material)
    required_caps = MATERIAL_CAPABILITIES.get(material_keyword, [material_keyword])
    
    recommendations = []
    
    for supplier in all_suppliers:
        supplier_caps = [c.lower() for c in supplier.get('capabilities', [])]
        
        # Check capability match
        matching_caps = sum(1 for cap in required_caps if cap in supplier_caps)
        if matching_caps == 0:
            continue
        
        # Calculate base score
        score = matching_caps / len(required_caps)
        
        # Adjust for urgency
        if urgency == 'rush':
            lead_time = supplier.get('avg_lead_time', 30)
            if lead_time <= 7:
                score *= 1.2
            elif lead_time <= 14:
                score *= 1.0
            else:
                score *= 0.8
        
        # Adjust for reliability
        reliability = supplier.get('reliability_score', 0.8)
        score *= reliability
        
        recommendations.append({
            'supplier': supplier,
            'score': min(score, 1.0),
            'reasons': [
                f"Matches {matching_caps}/{len(required_caps)} required capabilities",
                f"Average lead time: {supplier.get('avg_lead_time', 'N/A')} days",
                f"Price tier: {supplier.get('price_tier', 'standard')}",
            ]
        })
    
    # Sort by score
    recommendations.sort(key=lambda x: x['score'], reverse=True)
    
    return recommendations[:5]


