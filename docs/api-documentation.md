# InsightFlow API Documentation

## Authentication

All API requests (except registration and login) require authentication.

### Authentication Header

Include the JWT token in the Authorization header:
Authorization: Bearer YOUR_JWT_TOKEN

### Authentication Endpoints

#### Register User

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```
### Login User

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }

   ```
- **Response**:
  ```json
  {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

  