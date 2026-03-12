from typing import Any
from uuid import UUID
from datetime import datetime
from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, HTTPException, Response
from pymongo import errors

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
async def delete_client(client_uuid: UUID) -> Response:
    """
    Delete a client by UUID.
    """
    client = await models.Client.find_one(models.Client.uuid == client_uuid)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")

    await client.delete()


@router.get("", response_model=list[schemas.Client])
async def list_clients(
    limit: int | None = 25,
    offset: int | None = 0,
) -> Any:
    """
    List all clients.
    """
    clients = await models.Client.find_all().skip(offset).limit(limit).to_list()
    return clients
