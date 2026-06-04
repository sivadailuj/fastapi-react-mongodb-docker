import re
from pymongo import ASCENDING, DESCENDING
from typing import Any


def build_query(
    search: str | None,
    search_fields: list[str],
):
    """
    Build MongoDB query for text search across fields.
    
    Args:
        search: Search string to match (regex)
        search_fields: List of field names to search across
        
    Returns:
        MongoDB query dict
    """
    mongo_query = {}

    if search:
        safe_search = re.escape(search)

        mongo_query["$or"] = [
            {field: {"$regex": safe_search, "$options": "i"}} for field in search_fields
        ]

    return mongo_query


def add_filters(
    mongo_query: dict,
    filters: dict[str, Any],
) -> dict:
    """
    Add filter conditions to a MongoDB query, ignore None.
    
    Args:
        mongo_query: Existing MongoDB query dict
        filters: Dict of field names to values to filter by
        
    Returns:
        Updated MongoDB query dict
        
    Example:
        mongo_query = {}
        add_filters(mongo_query, {"package_uuid": uuid_val, "status": "ACTIVE"})
        add_filters(mongo_query, {"client_uuid": client_uuid})  # Single filter as dict
    """
    for field, value in filters.items():
        if value is not None:
            mongo_query[field] = value
    return mongo_query


def apply_sort(query, sortBy: str | None, sortOrder: int, allowed_fields: list[str]):
    """
    Apply sorting to a MongoDB query.
    
    Args:
        query: MongoDB query object
        sortBy: Field name to sort by
        sortOrder: 1 for ascending, -1 for descending
        allowed_fields: List of fields that can be sorted
        
    Returns:
        Updated query with sorting applied
    """
    if sortBy in allowed_fields:
        direction = ASCENDING if sortOrder == 1 else DESCENDING
        return query.sort((sortBy, direction))
    return query
