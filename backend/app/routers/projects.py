from typing import Any
from uuid import UUID
from datetime import datetime
from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, HTTPException, Response
from pymongo import errors

from .. import models, schemas

router = APIRouter()


@router.post("", response_model=schemas.Project, status_code=201)
async def create_project(
    project: schemas.ProjectCreate = Body(...),
) -> Any:
    """
    Create a new project.
    """
    try:
        project_doc = models.Project(**project.model_dump())
        setattr(
            project_doc, "last_updated", project_doc.last_updated.replace(microsecond=0)
        )
        await project_doc.insert()
        return project_doc
    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="Project with this UUID already exists."
        )


@router.get("/{project_uuid}", response_model=schemas.Project)
async def get_project(project_uuid: UUID) -> Any:
    """
    Get a project by UUID.
    """
    project = await models.Project.find_one(models.Project.uuid == project_uuid)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    return project


@router.patch("/{project_uuid}", response_model=schemas.Project)
async def update_project(
    project_uuid: UUID,
    project_update: schemas.ProjectUpdate = Body(...),
) -> Any:
    """
    Update a project by UUID.
    """
    project = await models.Project.find_one(models.Project.uuid == project_uuid)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    for field, value in project_update.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    setattr(project, "last_updated", datetime.now().replace(microsecond=0).isoformat())

    try:
        await project.save()
        return project

    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=409,
            detail="Conflict: Project was modified by another process.",
        )


@router.delete("/{project_uuid}", status_code=204)
async def delete_project(project_uuid: UUID):
    """
    Delete a project by UUID.
    """
    project = await models.Project.find_one(models.Project.uuid == project_uuid)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    await project.delete()


@router.get("", response_model=list[schemas.Project])
async def get_projects(
    limit: int | None = 20,
    offset: int | None = 0,
) -> Any:
    """
    List all projects.
    """
    projects = await models.Project.find_all().skip(offset).limit(limit).to_list()

    return projects


@router.get("/client/{client_uuid}", response_model=list[schemas.Project])
async def get_projects_by_client(
    client_uuid: UUID,
    limit: int | None = 20,
    offset: int | None = 0,
) -> Any:
    """
    List all projects for a specific client.
    """
    projects = (
        await models.Project.find(models.Project.client_uuid == client_uuid)
        .skip(offset)
        .limit(limit)
        .to_list()
    )
    return projects
