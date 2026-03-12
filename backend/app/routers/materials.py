from typing import Any
from uuid import UUID
from datetime import datetime
from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, HTTPException, Response
from pymongo import errors

from .. import models, schemas

router = APIRouter()


@router.post("", response_model=schemas.Material, status_code=201)
async def create_material(
    material: schemas.MaterialCreate = Body(...),
) -> Any:
    """
    Create a new material.
    """
    try:
        material_doc = models.Material(**material.model_dump())
        setattr(
            material_doc, "last_updated", material_doc.last_updated.replace(microsecond=0)
        )
        await material_doc.insert()
        return material_doc
    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="Material with this UUID already exists."
        )


@router.get("/{material_uuid}", response_model=schemas.Material)
async def get_material(material_uuid: UUID) -> Any:
    """
    Get a material by UUID.
    """
    material = await models.Material.find_one(models.Material.uuid == material_uuid)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found.")
    return material


@router.patch("/{material_uuid}", response_model=schemas.Material)
async def update_material(
    material_uuid: UUID,
    material_update: schemas.MaterialUpdate = Body(...),
) -> Any:
    """
    Update a material by UUID.
    """
    material = await models.Material.find_one(models.Material.uuid == material_uuid)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found.")

    for field, value in material_update.model_dump(exclude_unset=True).items():
        setattr(material, field, value)

    setattr(material, "last_updated", datetime.now().replace(microsecond=0).isoformat())

    try:
        await material.save()
        return material
    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=409,
            detail="Material has been modified by another process. Please refresh and try again.",
        )


@router.delete("/{material_uuid}", status_code=204)
async def delete_material(material_uuid: UUID) -> Response:
    """
    Delete a material by UUID.
    """
    material = await models.Material.find_one(models.Material.uuid == material_uuid)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found.")

    await material.delete()


@router.get("", response_model=list[schemas.Material])
async def list_materials(
    limit: int | None = 25,
    offset: int | None = 0,
) -> Any:
    """
    List all materials.
    """
    materials = await models.Material.find_all().skip(offset).limit(limit).to_list()
    return materials


@router.get("/order/{order_uuid}", response_model=list[schemas.Material])
async def list_materials_by_order(
    order_uuid: UUID,
    limit: int | None = 10,
    offset: int | None = 0,
) -> Any:
    """
    List materials by order UUID.
    """
    materials = (
        await models.Material.find(models.Material.order_uuid == order_uuid)
        .skip(offset)
        .limit(limit)
        .to_list()
    )
    return materials


@router.get("/manufacturing/{manufacturing_uuid}", response_model=list[schemas.Material])
async def list_materials_by_manufacturing(
    manufacturing_uuid: UUID,
    limit: int | None = 10,
    offset: int | None = 0,
) -> Any:
    """
    List materials by manufacturing UUID.
    """
    materials = (
        await models.Material.find(
            models.Material.manufacturing_uuid == manufacturing_uuid
        )
        .skip(offset)
        .limit(limit)
        .to_list()
    )
    return materials
