from typing import Any
from uuid import UUID
from datetime import datetime
from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, HTTPException, Response
from pymongo import errors

from .. import models, schemas

router = APIRouter()


@router.post("", response_model=schemas.Shipment, status_code=201)
async def create_shipment(
    shipment: schemas.ShipmentCreate = Body(...),
) -> Any:
    """
    Create a new shipment.
    """
    try:
        shipment_doc = models.Shipment(**shipment.model_dump())
        setattr(
            shipment_doc, "last_updated", shipment_doc.last_updated.replace(microsecond=0)
        )
        await shipment_doc.insert()
        return shipment_doc
    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="Shipment with this UUID already exists."
        )


@router.get("/{shipment_uuid}", response_model=schemas.Shipment)
async def get_shipment(shipment_uuid: UUID) -> Any:
    """
    Get a shipment by UUID.
    """
    shipment = await models.Shipment.find_one(models.Shipment.uuid == shipment_uuid)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found.")
    return shipment


@router.patch("/{shipment_uuid}", response_model=schemas.Shipment)
async def update_shipment(
    shipment_uuid: UUID,
    shipment_update: schemas.ShipmentUpdate = Body(...),
) -> Any:
    """
    Update a shipment by UUID.
    """
    shipment = await models.Shipment.find_one(models.Shipment.uuid == shipment_uuid)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found.")

    for field, value in shipment_update.model_dump(exclude_unset=True).items():
        setattr(shipment, field, value)

    setattr(shipment, "last_updated", datetime.now().replace(microsecond=0).isoformat())

    try:
        await shipment.save()
        return shipment

    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=409,
            detail="Conflict: Shipment was modified by another process.",
        )


@router.delete("/{shipment_uuid}", status_code=204)
async def delete_shipment(shipment_uuid: UUID):
    """
    Delete a shipment by UUID.
    """
    shipment = await models.Shipment.find_one(models.Shipment.uuid == shipment_uuid)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found.")

    await shipment.delete()


@router.get("", response_model=list[schemas.Shipment])
async def get_shipments(
    limit: int | None = 20,
    offset: int | None = 0,
) -> Any:
    """
    List all shipments.
    """
    shipments = await models.Shipment.find_all().skip(offset).limit(limit).to_list()
    return shipments
