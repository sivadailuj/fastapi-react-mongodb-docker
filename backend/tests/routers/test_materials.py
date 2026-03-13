import pytest

from httpx import AsyncClient
from uuid import UUID
from app.config.config import settings

from app.schemas import MaterialCreate as Create
from app.schemas import MaterialUpdate as Update
from app.schemas import Material as Schema
from app.schemas.materials import MaterialStatus

from ..utils import verify_update_data

PREFIX = "/materials"


create_data = Create(
    client_uuid=UUID(int=1),
    project_uuid=UUID(int=2),
    order_uuid=UUID(int=3),
    manufacturing_uuid=UUID(int=4),
    ppo_id="00000",
    machine="TF000H/A10000",
    required_nwt=123.5,
    available_nwt=1234.5,
    status=MaterialStatus.QUEUED,
)

update_data = Update(
    client_uuid=UUID(int=5),
    project_uuid=UUID(int=6),
    order_uuid=UUID(int=7),
    # manufacturing_uuid=UUID(int=8),
    ppo_id="00001",
    machine="TF000H/A10001",
    required_nwt=654.2,
    available_nwt=987.1,
    status=MaterialStatus.IN_PROGRESS,
)


@pytest.mark.anyio
async def test_create(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    ret_json = response.json()
    assert create_data == Create.model_validate(ret_json)


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
