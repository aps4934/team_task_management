# API Documentation

Complete reference for all Team Task Manager API endpoints.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-backend-domain.com/api
```

## Authentication

All endpoints (except login and register) require JWT authentication.

### Header Format
```
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

1. **Register**: `POST /auth/register` returns a token
2. **Login**: `POST /auth/login` returns a token
3. **Token Expiration**: 7 days
4. **Token Refresh**: Re-login to get a new token

## Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "message": "Error message"
}
```

### Validation Error Response
```json
{
  "errors": [
    {
      "value": "invalid_value",
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Auth Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Authentication:** No

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, max 50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

**Error (400):**
```json
{
  "message": "User already exists"
}
```

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Authentication:** No

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

**Error (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Authentication:** Required

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "profileImage": null
  }
}
```

**Error (401):**
```json
{
  "message": "No token provided"
}
```

---

## User Endpoints

### 4. Get All Users

**Endpoint:** `GET /users`

**Authentication:** Required

**Query Parameters:** None

**Response (200):**
```json
{
  "count": 5,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "profileImage": null,
      "isActive": true
    }
  ]
}
```

---

### 5. Get User by ID

**Endpoint:** `GET /users/:id`

**Authentication:** Required

**Parameters:**
- `id` (string): User MongoDB ID

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "profileImage": null
  }
}
```

**Error (404):**
```json
{
  "message": "User not found"
}
```

---

### 6. Update User

**Endpoint:** `PUT /users/:id`

**Authentication:** Required

**Body:**
```json
{
  "name": "Jane Doe",
  "profileImage": "https://example.com/image.jpg"
}
```

**Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "john@example.com",
    "role": "member",
    "profileImage": "https://example.com/image.jpg"
  }
}
```

---

## Project Endpoints

### 7. Create Project

**Endpoint:** `POST /projects`

**Authentication:** Required

**Body:**
```json
{
  "name": "My Project",
  "description": "Project description"
}
```

**Validation Rules:**
- `name`: Required, max 100 characters
- `description`: Optional, max 500 characters

**Response (201):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": "507f1f77bcf86cd799439011",
    "name": "My Project",
    "description": "Project description",
    "createdBy": {
      "id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member"
    },
    "members": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "member"
      }
    ],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 8. Get All Projects

**Endpoint:** `GET /projects`

**Authentication:** Required

**Notes:**
- Admins see all projects
- Members see only projects they're members of

**Response (200):**
```json
{
  "count": 2,
  "projects": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "My Project",
      "description": "Project description",
      "createdBy": { /* user object */ },
      "members": [ /* user array */ ],
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 9. Get Project by ID

**Endpoint:** `GET /projects/:id`

**Authentication:** Required

**Parameters:**
- `id` (string): Project MongoDB ID

**Authorization:**
- User must be project member or admin

**Response (200):**
```json
{
  "project": {
    "id": "507f1f77bcf86cd799439011",
    "name": "My Project",
    "description": "Project description",
    "createdBy": { /* user object */ },
    "members": [ /* user array */ ],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error (403):**
```json
{
  "message": "Access denied"
}
```

---

### 10. Update Project

**Endpoint:** `PUT /projects/:id`

**Authentication:** Required

**Authorization:**
- Project creator or admin only

**Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "message": "Project updated successfully",
  "project": { /* updated project object */ }
}
```

---

### 11. Delete Project

**Endpoint:** `DELETE /projects/:id`

**Authentication:** Required

**Authorization:**
- Project creator or admin only

**Response (200):**
```json
{
  "message": "Project deleted successfully"
}
```

---

### 12. Add Member to Project

**Endpoint:** `POST /projects/members/add`

**Authentication:** Required (Admin only)

**Body:**
```json
{
  "projectId": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012"
}
```

**Response (200):**
```json
{
  "message": "Member added successfully",
  "project": { /* updated project object */ }
}
```

**Error (400):**
```json
{
  "message": "User is already a member"
}
```

---

### 13. Remove Member from Project

**Endpoint:** `POST /projects/members/remove`

**Authentication:** Required (Admin only)

**Body:**
```json
{
  "projectId": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012"
}
```

**Response (200):**
```json
{
  "message": "Member removed successfully",
  "project": { /* updated project object */ }
}
```

---

## Task Endpoints

### 14. Create Task

**Endpoint:** `POST /tasks`

**Authentication:** Required

**Body:**
```json
{
  "title": "Task Title",
  "description": "Task description",
  "project": "507f1f77bcf86cd799439011",
  "assignedTo": "507f1f77bcf86cd799439012",
  "priority": "high",
  "status": "todo",
  "dueDate": "2024-12-31"
}
```

**Validation Rules:**
- `title`: Required, max 100 characters
- `description`: Optional, max 1000 characters
- `project`: Required, valid project ID
- `assignedTo`: Required, valid user ID
- `priority`: Optional, enum [low, medium, high]
- `status`: Optional, enum [todo, in-progress, completed]
- `dueDate`: Optional, valid date format

**Authorization:**
- User must be project member or admin

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Task Title",
    "description": "Task description",
    "project": {
      "id": "507f1f77bcf86cd799439011",
      "name": "My Project"
    },
    "assignedTo": { /* user object */ },
    "status": "todo",
    "priority": "high",
    "dueDate": "2024-12-31",
    "createdBy": { /* user object */ },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 15. Get My Tasks

**Endpoint:** `GET /tasks/my-tasks`

**Authentication:** Required

**Query Parameters:** None

**Response (200):**
```json
{
  "myTasks": {
    "overdue": [ /* overdue task array */ ],
    "today": [ /* today's task array */ ],
    "upcoming": [ /* upcoming task array */ ],
    "completed": [ /* completed task array */ ]
  },
  "totalTasks": 10,
  "stats": {
    "overdue": 2,
    "today": 1,
    "upcoming": 5,
    "completed": 2
  }
}
```

---

### 16. Get Tasks by Project

**Endpoint:** `GET /tasks/project/:projectId`

**Authentication:** Required

**Parameters:**
- `projectId` (string): Project MongoDB ID

**Authorization:**
- User must be project member or admin

**Response (200):**
```json
{
  "count": 5,
  "tasks": {
    "todo": [ /* todo tasks */ ],
    "in-progress": [ /* in-progress tasks */ ],
    "completed": [ /* completed tasks */ ]
  },
  "allTasks": [ /* all tasks in array */ ]
}
```

---

### 17. Get Task by ID

**Endpoint:** `GET /tasks/:id`

**Authentication:** Required

**Parameters:**
- `id` (string): Task MongoDB ID

**Response (200):**
```json
{
  "task": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Task Title",
    "description": "Task description",
    "project": { /* project object */ },
    "assignedTo": { /* user object */ },
    "status": "todo",
    "priority": "high",
    "dueDate": "2024-12-31",
    "createdBy": { /* user object */ },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 18. Update Task

**Endpoint:** `PUT /tasks/:id`

**Authentication:** Required

**Authorization:**
- Task creator, assigned user, or admin

**Body:** (any of these fields)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2024-12-25",
  "assignedTo": "507f1f77bcf86cd799439012"
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": { /* updated task object */ }
}
```

---

### 19. Delete Task

**Endpoint:** `DELETE /tasks/:id`

**Authentication:** Required

**Authorization:**
- Task creator or admin

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Health Check

### 20. Health Check

**Endpoint:** `GET /health`

**Authentication:** No

**Response (200):**
```json
{
  "status": "Server is running"
}
```

---

## Error Codes Reference

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Validation error | Check request body format |
| 401 | No token provided | Add Authorization header |
| 401 | Invalid or expired token | Re-login to get new token |
| 403 | Access denied | Check user role/permissions |
| 404 | Resource not found | Check resource ID |
| 500 | Internal server error | Check server logs |

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per user

---

## API Versioning

Current version: **v1** (implicit)

Future versions should follow:
- `/api/v2/...`

---

## cURL Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

### Get My Tasks
```bash
curl -X GET http://localhost:5000/api/tasks/my-tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Postman Collection

You can import this API into Postman:
1. Open Postman
2. Click "Import"
3. Paste the API URL or import from file
4. Set variables for authentication
5. Test endpoints

### Environment Variables (Postman)
```
base_url = http://localhost:5000/api
token = <your_jwt_token>
```

---

## Webhooks (Future Enhancement)

Plan to add webhooks for:
- Task completion
- Project creation
- User assignment
- Deadline reminders

---

## Support

For API issues:
1. Check error message carefully
2. Review this documentation
3. Check server logs
4. Create an issue on GitHub

---

Last Updated: January 2024
