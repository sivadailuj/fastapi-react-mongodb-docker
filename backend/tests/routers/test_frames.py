import pytest

from httpx import AsyncClient
from uuid import UUID
from app.config.config import settings

from app.schemas import FrameCreate as CreateSchema
from app.schemas import FrameUpdate as UpdateSchema
from app.schemas import Frame as Schema
from app.schemas.frames import FrameStatus

from ..utils import verify_update_data

PREFIX = "/frames"

create_data = CreateSchema(
    client_uuid=UUID(int=1),
    project_uuid=UUID(int=2),
    package_uuid=UUID(int=3),
    ppo_id="12345",
    name="Test Frame",
    type="L123",
    nwt=123.45,
    assembly_file="file.doc",
    machine="MS123456",
    status=FrameStatus.QUEUED,
)

update_data = UpdateSchema(
    client_uuid=UUID(int=4),
    project_uuid=UUID(int=5),
    # package_uuid=UUID(int=6),
    ppo_id="54321",
    name="Update Frame",
    type="L456",
    nwt=654.32,
    assembly_file="update_file.doc",
    machine="MS654321",
    status=FrameStatus.IN_PROGRESS,
)


@pytest.mark.anyio
async def test_create(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    ret_json = response.json()
    assert create_data == CreateSchema.model_validate(ret_json)


@pytest.mark.anyio
async def test_get(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    create_json = response.json()
    response = await client.get(f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}")
    assert response.status_code == 200
    ret_json = response.json()
    assert Schema.model_validate(create_json) == Schema.model_validate(ret_json)


@pytest.mark.anyio
async def test_update(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    create_json = response.json()
    response = await client.patch(
        f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}",
        json=update_data.model_dump(exclude_unset=True, mode="json"),
    )
    assert response.status_code == 200
    ret_json = response.json()
    verify_update_data(create_data, update_data, Schema.model_validate(ret_json))


@pytest.mark.anyio
async def test_delete(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    create_json = response.json()
    response = await client.delete(f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}")
    assert response.status_code == 204
    response = await client.get(f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}")
    assert response.status_code == 404
