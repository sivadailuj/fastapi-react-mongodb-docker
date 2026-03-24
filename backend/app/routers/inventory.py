from typing import Any
from uuid import UUID
from datetime import datetime
from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, HTTPException, Response
from pymongo import errors

from .. import models, schemas

router = APIRouter()


@router.post("", response_model=schemas.Inventory, status_code=201)
async def create_inventory_item(inventory: schemas.InventoryCreate = Body(...)) -> Any:
    """
    Create a new inventory item.
    """
    try:
        inventory_doc = models.Inventory(**inventory.model_dump())
        setattr(
            inventory_doc,
            "last_updated",
            inventory_doc.last_updated.replace(microsecond=0),
        )
        await inventory_doc.insert()
        return inventory_doc
    except errors.DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Inventory item already exists.")


@router.get("/{inventory_uuid}", response_model=schemas.Inventory)
async def get_inventory_item(inventory_uuid: UUID) -> Any:
    """
    Get an inventory item by its UUID.
    """
    inventory = await models.Inventory.find_one(models.Inventory.uuid == inventory_uuid)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory item not found.")
    return inventory


@router.patch("/{inventory_uuid}", response_model=schemas.Inventory)
async def update_inventory_item(
    inventory_uuid: UUID,
    inventory_update: schemas.InventoryUpdate = Body(...),
) -> Any:
    """
    Update an existing inventory item.
    """
    inventory = await models.Inventory.find_one(models.Inventory.uuid == inventory_uuid)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory item not found.")

    for field, value in inventory_update.model_dump(exclude_unset=True).items():
        setattr(inventory, field, value)

    setattr(inventory, "last_updated", datetime.now().replace(microsecond=0).isoformat())

    try:
        await inventory.save()
        return inventory
    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=409,
            detail="Conflict: Inventory item was updated by another process.",
        )


@router.delete("/{inventory_uuid}", status_code=204)
async def delete_inventory_item(inventory_uuid: UUID):
    """
    Delete an inventory item by its UUID.
    """
    inventory = await models.Inventory.find_one(models.Inventory.uuid == inventory_uuid)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory item not found.")

    await inventory.delete()


@router.get("", response_model=list[schemas.Inventory])
async def get_inventory_items(
    limit: int | None = 20,
    offset: int | None = 0,
) -> Any:
    """
    List all inventory items.
    """
    inventory_items = (
        await models.Inventory.find_all().skip(offset).limit(limit).to_list()
    )
    return inventory_items


@router.get("/supplier/{supplier_uuid}", response_model=list[schemas.Inventory])
async def get_inventory_items_by_supplier(
    supplier_uuid: UUID,
    limit: int | None = 20,
    offset: int | None = 0,
) -> Any:
    """
    List inventory items by supplier UUID.
    """
    inventory_items = (
        await models.Inventory.find(models.Inventory.supplier_uuid == supplier_uuid)
        .skip(offset)
        .limit(limit)
        .to_list()
    )
    return inventory_items
