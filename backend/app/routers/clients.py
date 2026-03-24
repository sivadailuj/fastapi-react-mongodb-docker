import re
from typing import Any
from uuid import UUID
from datetime import datetime
from beanie import SortDirection
from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, HTTPException
from pymongo import errors
from app.utils.query_builder import build_query, apply_sort

from .. import models, schemas

router = APIRouter()


@router.post("", response_model=schemas.Client, status_code=201)
async def create_client(client: schemas.ClientCreate = Body(...)) -> Any:
    """
    Create a new client.
    """
    try:
        client_doc = models.Client(**client.model_dump())
        setattr(
            client_doc, "last_updated", client_doc.last_updated.replace(microsecond=0)
        )
        await client_doc.insert()
        return client_doc
    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="Client with this UUID already exists."
        )


@router.get("/{client_uuid}", response_model=schemas.Client)
async def get_client(client_uuid: UUID) -> Any:
    """
    Get a client by UUID.
    """
    client = await models.Client.find_one(models.Client.uuid == client_uuid)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")
    return client


@router.patch("/{client_uuid}", response_model=schemas.Client)
async def update_client(
    client_uuid: UUID, client_update: schemas.ClientUpdate = Body(...)
) -> Any:
    """
    Update a client by UUID.
    """
    client = await models.Client.find_one(models.Client.uuid == client_uuid)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")

    for field, value in client_update.model_dump(exclude_unset=True).items():
        setattr(client, field, value)

    setattr(client, "last_updated", datetime.now().replace(microsecond=0).isoformat())

    try:
        await client.save()
        return client
    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=409, detail="Conflict: Client was updated by another process."
        )


@router.delete("/{client_uuid}", status_code=204)
async def delete_client(client_uuid: UUID):
    """
    Delete a client by UUID.
    """
    client = await models.Client.find_one(models.Client.uuid == client_uuid)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")

    await client.delete()


@router.get("")
async def get_clients(
    sortBy: str | None = None,
    sortOrder: int = 1,
    search: str | None = None,
    limit: int = 20,
    offset: int = 0,
):
    SEARCH_FIELDS = [
        "company",
        "category",
        "mobile",
        "email",
        "fax",
        "extension",
        "web_page",
        "notes",
        "last_updated",
        "address.street",
        "address.city",
        "address.state",
        "address.zip_code",
        "address.country",
    ]

    mongo_query = build_query(search, SEARCH_FIELDS)

    base_query = models.Client.find(mongo_query)

    total = await base_query.count()

    base_query = apply_sort(base_query, sortBy, sortOrder, SEARCH_FIELDS)

    clients = await base_query.skip(offset).limit(limit).to_list()

    return {
        "items": clients,
        "total": total
    }