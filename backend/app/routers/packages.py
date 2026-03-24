from typing import Any
from uuid import UUID
from datetime import datetime
from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, HTTPException, Response
from pymongo import errors

from .. import models, schemas

router = APIRouter()


@router.post("", response_model=schemas.Package, status_code=201)
async def create_package(
    package: schemas.PackageCreate = Body(...),
) -> Any:
    """
    Create a new package.
    """
    try:
        package_doc = models.Package(**package.model_dump())
        setattr(
            package_doc, "last_updated", package_doc.last_updated.replace(microsecond=0)
        )
        await package_doc.insert()
        return package_doc
    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="Package with this UUID already exists."
        )


@router.get("/{package_uuid}", response_model=schemas.Package)
async def get_package(package_uuid: UUID) -> Any:
    """
    Get a package by UUID.
    """
    package = await models.Package.find_one(models.Package.uuid == package_uuid)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found.")
    return package


@router.patch("/{package_uuid}", response_model=schemas.Package)
async def update_package(
    package_uuid: UUID,
    package_update: schemas.PackageUpdate = Body(...),
) -> Any:
    """
    Update a package by UUID.
    """
    package = await models.Package.find_one(models.Package.uuid == package_uuid)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found.")

    for field, value in package_update.model_dump(exclude_unset=True).items():
        setattr(package, field, value)

    setattr(package, "last_updated", datetime.now().replace(microsecond=0).isoformat())

    try:
        await package.save()
        return package
    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=409,
            detail="Conflict: Package was updated by another process.",
        )


@router.delete("/{package_uuid}", status_code=204)
async def delete_package(package_uuid: UUID):
    """
    Delete a package by UUID.
    """
    package = await models.Package.find_one(models.Package.uuid == package_uuid)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found.")

    await package.delete()


@router.get("", response_model=list[schemas.Package])
async def get_packages(
    limit: int | None = 20,
    offset: int | None = 0,
) -> Any:
    """
    List all packages.
    """
    packages = await models.Package.find_all().skip(offset).limit(limit).to_list()
    return packages


@router.get("/shipment/{shipment_uuid}", response_model=list[schemas.Package])
async def get_packages_by_shipment(
    shipment_uuid: UUID,
    limit: int | None = 20,
    offset: int | None = 0,
) -> Any:
    """
    List all packages for a specific shipment.
    """
    packages = (
        await models.Package.find(models.Package.shipment_uuid == shipment_uuid)
        .skip(offset)
        .limit(limit)
        .to_list()
    )
    return packages
