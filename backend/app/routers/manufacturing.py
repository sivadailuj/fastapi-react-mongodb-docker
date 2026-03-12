from typing import Any
from uuid import UUID
from datetime import datetime
from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, HTTPException, Response
from pymongo import errors

from .. import models, schemas

router = APIRouter()


@router.post("", response_model=schemas.Manufacturing, status_code=201)
async def create_manufacturing(
    manufacturing: schemas.ManufacturingCreate = Body(...),
) -> Any:
    """
    Create a new manufacturing item.
    """
    try:
        manufacturing_doc = models.Manufacturing(**manufacturing.model_dump())
        setattr(
            manufacturing_doc,
            "last_updated",
            manufacturing_doc.last_updated.replace(microsecond=0),
        )
        await manufacturing_doc.insert()
        return manufacturing_doc
    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="Manufacturing item with this UUID already exists."
        )


@router.get("/{manufacturing_uuid}", response_model=schemas.Manufacturing)
async def get_manufacturing(manufacturing_uuid: UUID) -> Any:
    """
    Get a manufacturing item by UUID.
    """
    manufacturing = await models.Manufacturing.find_one(
        models.Manufacturing.uuid == manufacturing_uuid
    )
    if not manufacturing:
        raise HTTPException(status_code=404, detail="Manufacturing item not found.")
    return manufacturing


@router.patch("/{manufacturing_uuid}", response_model=schemas.Manufacturing)
async def update_manufacturing(
    manufacturing_uuid: UUID,
    manufacturing_update: schemas.ManufacturingUpdate = Body(...),
) -> Any:
    """
    Update a manufacturing item by UUID.
    """
    manufacturing = await models.Manufacturing.find_one(
        models.Manufacturing.uuid == manufacturing_uuid
    )
    if not manufacturing:
        raise HTTPException(status_code=404, detail="Manufacturing item not found.")

    for field, value in manufacturing_update.model_dump(exclude_unset=True).items():
        setattr(manufacturing, field, value)

    setattr(
        manufacturing, "last_updated", datetime.now().replace(microsecond=0).isoformat()
    )

    try:
        await manufacturing.save()
        return manufacturing
    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=409,
            detail="Conflict: Manufacturing item was updated by another process.",
        )


@router.delete("/{manufacturing_uuid}", status_code=204)
async def delete_manufacturing(manufacturing_uuid: UUID) -> Response:
    """
    Delete a manufacturing item by UUID.
    """
    manufacturing = await models.Manufacturing.find_one(
        models.Manufacturing.uuid == manufacturing_uuid
    )
    if not manufacturing:
        raise HTTPException(status_code=404, detail="Manufacturing item not found.")

    await manufacturing.delete()


@router.get("", response_model=list[schemas.Manufacturing])
async def list_manufacturing(
    limit: int | None = 25,
    offset: int | None = 0,
) -> Any:
    """
    List all manufacturing items.
    """
    manufacturing_items = (
        await models.Manufacturing.find_all().skip(offset).limit(limit).to_list()
    )
    return manufacturing_items
