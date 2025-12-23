from .utils import *
from ..app.routers.auth import get_db, authenticate_user, create_access_token, SECRET_KEY, ALGORITHM, get_current_user
from jose import jwt
from datetime import timedelta
import pytest
from fastapi import HTTPException

app.dependency_overrides[get_db] = override_get_db

def test_authenticate_user(test_user):
    db = TestingSessionLocal()

    authenticated_user = authenticate_user(test_user.email, 'testpassword', db)
    assert authenticated_user is not None
    assert authenticated_user.email == test_user.email

    non_existent = authenticate_user('Wrongemail', 'testpassword', db)
    assert non_existent is False

    wrong_password = authenticate_user(test_user.email, 'wrongpassword', db)
    assert wrong_password is False


def test_create_access_token():
    email = 'testuser'
    user_id = 1
    expires_delta = timedelta(days=1)

    token = create_access_token(email, user_id, expires_delta)

    decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM],
                               options={'verify_signature': False})

    assert decoded_token['sub'] == email
    assert decoded_token['id'] == user_id


@pytest.mark.asyncio
async def test_get_current_user_valid_token():
    encode = {'sub': 'testuser', 'id': 1}
    token = jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

    user = await get_current_user(token=token)
    assert user == {'email': 'testuser', 'id': 1}


@pytest.mark.asyncio
async def test_get_current_user_missing_payload():
    encode = {'role': 'user'}
    token = jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

    with pytest.raises(HTTPException) as excinfo:
        await get_current_user(token=token)

    assert excinfo.value.status_code == 401
    assert excinfo.value.detail == 'Could not validate user.'