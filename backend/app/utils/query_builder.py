import re
from pymongo import ASCENDING, DESCENDING

def build_query(
    search: str | None,
    search_fields: list[str],
):
    mongo_query = {}

    if search:
        safe_search = re.escape(search)

        mongo_query["$or"] = [
            {field: {"$regex": safe_search, "$options": "i"}}
            for field in search_fields
        ]

    return mongo_query


def apply_sort(query, sortBy: str | None, sortOrder: int, allowed_fields: list[str]):
    if sortBy in allowed_fields:
        direction = ASCENDING if sortOrder == 1 else DESCENDING
        return query.sort((sortBy, direction))
    return query
