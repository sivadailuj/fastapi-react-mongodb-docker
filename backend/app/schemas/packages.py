from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class PackageStatus(Enum):
    """
    Enum for the status of a package.
    """

    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    PRINTING_LABEL = "printing_label"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class PackageBase(BaseModel):
    """
    Shared properties for package models. Visible by anyone.
    """

    client_uuid: UUID = Field(
        ..., description="The UUID of the client associated with the package."
    )
    project_uuid: UUID = Field(
        ..., description="The UUID of the project associated with the package."
    )
    shipment_uuid: UUID = Field(
        ..., description="The UUID of the shipment associated with the package."
    )
    ppo_id: str = Field(..., description="The PPO ID for the package.")
    name: str = Field(..., description="The name of the package.")
    type: str = Field(..., description="The type of the package.")
    status: PackageStatus = Field(..., description="The status of the package.")


class PackageCreate(PackageBase):
    """
    Properties to create a new package. Visible by anyone.
    """

    pass


class PackageUpdate(PackageBase):
    """
    Properties to update a package. Visible by anyone.
    """

    client_uuid: UUID | None = Field(
        default=None, description="The UUID of the client associated with the package."
    )
    project_uuid: UUID | None = Field(
        default=None, description="The UUID of the project associated with the package."
    )
    shipment_uuid: UUID | None = Field(
        default=None, description="The UUID of the shipment associated with the package."
    )
    ppo_id: str | None = Field(default=None, description="The PPO ID for the package.")
    name: str | None = Field(default=None, description="The name of the package.")
    type: str | None = Field(default=None, description="The type of the package.")
    status: PackageStatus | None = Field(
        default=None, description="The status of the package."
    )


class Package(PackageBase):
    """
    Properties shared by models stored in the database. Visible by anyone.
    """

    uuid: UUID = Field(..., description="Unique identifier for the package.")
    last_updated: datetime = Field(
        ..., description="Last updated timestamp for the package."
    )
