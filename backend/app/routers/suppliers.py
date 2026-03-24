from typing import Any
from uuid import UUID
from datetime import datetime
from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, HTTPException, Response
from pymongo import errors

from .. import models, schemas

router = APIRouter()


@router.post("", response_model=schemas.Supplier, status_code=201)
async def create_supplier(supplier: schemas.SupplierCreate = Body(...)) -> Any:
    """
    Create a new supplier.
    """
    try:
        supplier_doc = models.Supplier(**supplier.model_dump())
        setattr(
            supplier_doc, "last_updated", supplier_doc.last_updated.replace(microsecond=0)
        )
        await supplier_doc.insert()
        return supplier_doc
    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="Supplier with this UUID already exists."
        )


@router.get("/{supplier_uuid}", response_model=schemas.Supplier)
async def get_supplier(supplier_uuid: UUID) -> Any:
    """
    Get a supplier by UUID.
    """
    supplier = await models.Supplier.find_one(models.Supplier.uuid == supplier_uuid)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    return supplier


@router.patch("/{supplier_uuid}", response_model=schemas.Supplier)
async def update_supplier(
    supplier_uuid: UUID, supplier_update: schemas.SupplierUpdate = Body(...)
) -> Any:
    """
    Update a supplier by UUID.
    """
    supplier = await models.Supplier.find_one(models.Supplier.uuid == supplier_uuid)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")

    for field, value in supplier_update.model_dump(exclude_unset=True).items():
        setattr(supplier, field, value)

    setattr(supplier, "last_updated", datetime.now().replace(microsecond=0).isoformat())

    try:
        await supplier.save()
        return supplier
    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=409, detail="Conflict: Supplier was updated by another process."
        )


@router.delete("/{supplier_uuid}", status_code=204, response_model=None)
async def delete_supplier(supplier_uuid: UUID):
    """Delete a supplier by UUID."""
    supplier = await models.Supplier.find_one(models.Supplier.uuid == supplier_uuid)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")

    await supplier.delete()


@router.get("", response_model=list[schemas.Supplier])
async def get_suppliers(
    limit: int | None = 20,
    offset: int | None = 0,
) -> Any:
    """
    List all suppliers.
    """
    suppliers = await models.Supplier.find_all().skip(offset).limit(limit).to_list()
    return suppliers
