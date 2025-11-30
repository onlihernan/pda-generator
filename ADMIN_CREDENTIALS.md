# Admin Access - User Credentials

This document contains the login credentials for the Admin Panel.

## Access Control

The system implements branch-based access control where each user can only access ports within their assigned city/branch.

## User Accounts

### Super Administrator
Full access to all branches and ports.

| Username | Password | Access |
|----------|----------|--------|
| `admin` | `admin123` | **All branches** |

### Branch Administrators
Each branch administrator can only access their assigned city.

| Username | Password | Branch/City |
|----------|----------|-------------|
| `sanlorenzo` | `sl2024` | San Lorenzo |
| `rosario` | `ros2024` | Rosario |
| `buenosaires` | `ba2024` | Buenos Aires |
| `sannicolas` | `sn2024` | San Nicolás |
| `campana` | `camp2024` | Campana |
| `necochea` | `nec2024` | Necochea |
| `bahiablanca` | `bb2024` | Bahía Blanca |
| `ushuaia` | `ush2024` | Ushuaia |
| `puertomadryn` | `pm2024` | Puerto Madryn |
| `nuevapalmira` | `np2024` | Nueva Palmira (URU) |
| `montevideo` | `mvd2024` | Montevideo (URU) |
| `asuncion` | `asu2024` | Asunción (PAR) |
| `corumba` | `cor2024` | Corumba (BRA) |
| `quijarro` | `qui2024` | Quijarro (BOL) |

## How to Access

1. Navigate to the Admin Panel (click "Admin" in the navigation)
2. Enter your username and password
3. You will only see the branches/ports you have access to

## Modifying Users

To add, remove, or modify users, edit the file:
```
src/config/users.ts
```

**Note:** This is a frontend-only authentication system (Opción 1). For production use with real security, consider migrating to a backend authentication system (Opción 2).

## Security Notice

⚠️ **Important**: These credentials are stored in plain text in the source code. This is acceptable for internal/testing purposes but should NOT be used for production environments with sensitive data.

For production deployment, implement:
- Backend authentication with hashed passwords
- JWT tokens
- Centralized user database
- Audit logging
