from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from .address import Address


class ProjectBase(BaseModel):
    """
    Shared properties for project models. Visible by anyone.
    """

    name: str = Field(..., description="The name of the project.")
    client_uuid: UUID = Field(
        ..., description="The UUID of the client associated with the project."
    )
    category: str = Field(..., description="The category of the project.")
    address: Address = Field(..., description="The address of the project.")
    sow: str = Field(..., description="The SOW for the project.")
    type: str = Field(..., description="The type of the project.")
    construction_type: str = Field(
        ..., description="The construction type of the project."
    )
    models: str = Field(..., description="The models associated with the project.")
    phase_volleys: str = Field(
        ..., description="The phase volleys associated with the project."
    )
    stories: str = Field(..., description="The number of stories in the project.")
    units: str = Field(..., description="The number of units in the project.")


class ProjectCreate(ProjectBase):
    """
    Properties to create a new project. Visible by anyone.
    """

    pass


class ProjectUpdate(ProjectBase):
    """
    Properties to update a project. Visible by anyone.
    """

    name: str | None = Field(default=None, description="The name of the project.")
    client_uuid: UUID | None = Field(
        default=None, description="The UUID of the client associated with the project."
    )
    category: str | None = Field(default=None, description="The category of the project.")
    address: Address | None = Field(
        default=None, description="The address of the project."
    )
    sow: str | None = Field(default=None, description="The SOW for the project.")
    type: str | None = Field(default=None, description="The type of the project.")
    construction_type: str | None = Field(
        default=None, description="The construction type of the project."
    )
    models: str | None = Field(
        default=None, description="The models associated with the project."
    )
    phase_volleys: str | None = Field(
        default=None, description="The phase volleys associated with the project."
    )
    stories: str | None = Field(
        default=None, description="The number of stories in the project."
    )
    units: str | None = Field(
        default=None, description="The number of units in the project."
    )


class Project(ProjectBase):
    """
    Properties shared by models stored in the database. Visible by anyone.
    """

    uuid: UUID = Field(..., description="Unique identifier for the project.")
    last_updated: datetime = Field(
        ..., description="Last updated timestamp for the project."
    )
