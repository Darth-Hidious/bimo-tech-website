"""Materials Service - Material data and search functionality."""
from typing import Optional, List, Dict, Any

# Material database (mirrors frontend data)
MATERIALS = {
    'rhenium': {
        'id': 'rhenium',
        'name': 'Rhenium',
        'symbol': 'Re',
        'description': 'Heavy refractory transition metal with melting point of 3180°C. Highest modulus of elasticity of all heat-resistant metals.',
        'properties': {
            'density': '21.04 g/cm³',
            'melting_point': '3180°C',
            'thermal_conductivity': '39.6 W/m·K',
        },
        'forms': ['Sheets', 'Rods', 'Wires', 'Tubes', 'Fasteners'],
        'alloys': ['Pure Re 99.95%', 'Mo-Re', 'W-Re'],
        'applications': ['Aerospace propulsion', 'Thermocouples', 'High-temp furnaces'],
    },
    'tungsten': {
        'id': 'tungsten',
        'name': 'Tungsten',
        'symbol': 'W',
        'description': 'Highest melting point of all elements (3422°C). Excellent mechanical properties at high temperatures.',
        'properties': {
            'density': '19.35 g/cm³',
            'melting_point': '3422°C',
            'atomic_number': '74',
        },
        'forms': ['Sheets', 'Rods', 'Wires', 'Tubes', 'Electrodes', 'Crucibles', 'Powders'],
        'alloys': ['Pure W 99.95%', 'W-Cu', 'W-Ni-Fe', 'W-Re', 'WC'],
        'applications': ['Furnace elements', 'X-ray targets', 'Electrodes', 'Cutting tools'],
    },
    'titanium': {
        'id': 'titanium',
        'name': 'Titanium',
        'symbol': 'Ti',
        'description': 'High strength, low density, excellent corrosion resistance. Biocompatible.',
        'properties': {
            'density': '4.51 g/cm³',
            'melting_point': '1725°C',
            'tensile_strength': '240-1300 MPa',
        },
        'forms': ['Sheets', 'Rods', 'Wires', 'Tubes', 'Fasteners', 'Powders'],
        'alloys': ['Grade 1-4 CP', 'Grade 5 Ti6Al4V', 'Grade 23 ELI', 'Nitinol'],
        'applications': ['Medical implants', 'Aerospace', 'Chemical processing', 'Marine'],
    },
    'molybdenum': {
        'id': 'molybdenum',
        'name': 'Molybdenum',
        'symbol': 'Mo',
        'description': 'One of the highest melting points. Lowest thermal expansion of structural materials.',
        'properties': {
            'density': '10.2 g/cm³',
            'melting_point': '2623°C',
        },
        'forms': ['Sheets', 'Rods', 'Wires', 'Tubes', 'Crucibles', 'Electrodes'],
        'alloys': ['Pure Mo 99.95%', 'TZM', 'Mo-Cu', 'Mo-Re'],
        'applications': ['X-ray anodes', 'Glass melting', 'Heating elements'],
    },
    'tantalum': {
        'id': 'tantalum',
        'name': 'Tantalum',
        'symbol': 'Ta',
        'description': 'High melting point (~3000°C). Exceptional corrosion resistance from stable oxide film.',
        'properties': {
            'density': '16.6 g/cm³',
            'melting_point': '~3000°C',
        },
        'forms': ['Sheets', 'Rods', 'Wires', 'Tubes', 'Fasteners'],
        'alloys': ['Pure Ta', 'Ta-2.5W', 'Ta-10W', 'Ta-Nb'],
        'applications': ['Chemical processing', 'Medical devices', 'Capacitors'],
    },
    'niobium': {
        'id': 'niobium',
        'name': 'Niobium',
        'symbol': 'Nb',
        'description': 'Superconducting properties. Low density, excellent corrosion resistance.',
        'properties': {
            'density': '8.6 g/cm³',
            'melting_point': '2477°C',
        },
        'forms': ['Sheets', 'Rods', 'Wires', 'Tubes'],
        'alloys': ['Pure Nb', 'Nb-Ti', 'Nb-Zr', 'NbC'],
        'applications': ['Superconductors', 'MRI magnets', 'Particle accelerators'],
    },
    'nickel': {
        'id': 'nickel',
        'name': 'Nickel',
        'symbol': 'Ni',
        'description': 'Excellent corrosion resistance. High electrical conductivity.',
        'properties': {
            'density': '8.89 g/cm³',
            'melting_point': '1455°C',
        },
        'forms': ['Sheets', 'Rods', 'Wires', 'Tubes', 'Targets'],
        'alloys': ['Nickel 200/201', 'Inconel', 'Hastelloy', 'Monel', 'Nimonic'],
        'applications': ['Chemical processing', 'Electronics', 'Aerospace'],
    },
    'sputtering-targets': {
        'id': 'sputtering-targets',
        'name': 'Sputtering Targets',
        'symbol': 'PVD',
        'description': 'High-purity targets for thin-film deposition. 4N to 7N purity available.',
        'properties': {
            'purity': '99.99% to 99.99999%',
            'formats': 'Bonded or unbonded',
        },
        'forms': ['Flat targets', 'Rotary targets', 'Custom shapes'],
        'alloys': ['Pure metals', 'Alloys', 'Oxides', 'Nitrides', 'Carbides'],
        'applications': ['Semiconductors', 'Solar cells', 'Optical coatings', 'Displays'],
    },
}


def search_materials(query: str) -> Optional[Dict[str, Any]]:
    """Search for materials by keyword."""
    query_lower = query.lower()
    
    # Direct ID match
    if query_lower in MATERIALS:
        return MATERIALS[query_lower]
    
    # Search by name, symbol, or keywords
    for material_id, material in MATERIALS.items():
        # Check name and symbol
        if (query_lower in material['name'].lower() or 
            query_lower == material['symbol'].lower()):
            return material
        
        # Check alloys
        for alloy in material.get('alloys', []):
            if query_lower in alloy.lower():
                return material
        
        # Check applications
        for app in material.get('applications', []):
            if query_lower in app.lower():
                return material
    
    return None


def get_material_info(material_id: str) -> Optional[Dict[str, Any]]:
    """Get detailed information about a specific material."""
    return MATERIALS.get(material_id)


def get_all_materials() -> List[Dict[str, Any]]:
    """Get all materials."""
    return list(MATERIALS.values())


def get_materials_by_capability(capability: str) -> List[Dict[str, Any]]:
    """Get materials that match a capability/application."""
    capability_lower = capability.lower()
    results = []
    
    for material in MATERIALS.values():
        for app in material.get('applications', []):
            if capability_lower in app.lower():
                results.append(material)
                break
    
    return results


