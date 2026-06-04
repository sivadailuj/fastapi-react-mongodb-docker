from enum import Enum
from uuid import UUID

from beanie import PydanticObjectId
from pydantic import BaseModel, EmailStr, Field


class UserRoles(Enum):
    """
    Enum for user roles.
    """

    USER = "user"
    ADMIN = "admin"
    DEBUGGER = "debugger"
    DEBUGGER_MAX = "debugger_max"
    INVENTORY_MANAGER = "inventory_manager"
    INVENTORY_MEMBER = "inventory_member"
    RAWMATERIALS_MANAGER = "rawmaterials_manager"
    RAWMATERIALS_MEMBER = "rawmaterials_member"
    PIECES_MANAGER = "pieces_manager"
    PIECES_MEMBER = "pieces_member"
    FRAMES_MANAGER = "frames_manager"
    FRAMES_MEMBER = "frames_member"
    PACKAGES_MANAGER = "packages_manager"
    PACKAGES_MEMBER = "packages_member"
    SHIPMENTS_MANAGER = "shipments_manager"
    SHIPMENTS_MEMBER = "shipments_member"
    PPO_MANAGER = "ppo_manager"
    PPO_MEMBER = "ppo_member"


class UserBase(BaseModel):
    """
    Shared User properties. Visible by anyone.
    """

    first_name: str | None = None
    last_name: str | None = None
    picture: str | None = None


class PrivateUserBase(UserBase):
    """
    Shared User properties. Visible only by admins and self.
    """

    email: EmailStr | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None
    provider: str | None = None
    roles: list[UserRoles] | None = None


class UserUpdate(UserBase):
    """
    User properties to receive via API on update.
    """

    password: str | None = None
    email: EmailStr | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None


class User(PrivateUserBase):
    """
    User properties returned by API. Contains private
    user information such as email, is_active, auth provider.

    Should only be returned to admins or self.
    """

    id: PydanticObjectId = Field()
    uuid: UUID
