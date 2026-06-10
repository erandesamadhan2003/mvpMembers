# User-Secret Manager

## How to Set Up Local Secrets

Follow these steps to configure your local environment.

### 1. Initialize User Secrets

Open your terminal, navigate to the project root directory (where your `.csproj` file lives), and run:

```bash
cd /backend/mvpMembers.API/
dotnet user-secrets init

```

*This will add a `<UserSecretsId>` GUID to your `.csproj` file.*

### 2. Add the Configuration Secrets

Run the following commands one by one to populate your local secret store:

```bash
# Redis Configuration
dotnet user-secrets set "Redis:ConnectionString" "localhost:6379"

# JWT Authentication Configuration
dotnet user-secrets set "Jwt:Key" "YOUR_JWT_SECRET_KEY"
dotnet user-secrets set "Jwt:Issuer" "mvpMembers"
dotnet user-secrets set "Jwt:Audience" "mvpMembersClient"

# Database Connection String
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "DATABASE_CONNECTION_STRING"

```

---

## 🔍 Useful Secrets Commands

| Action | Command |
| --- | --- |
| **List all secrets** | `dotnet user-secrets list` |
| **Remove a specific secret** | `dotnet user-secrets remove "Secret:KeyName"` |
| **Clear all secrets** | `dotnet user-secrets clear` |

---


### How the Application Reads These Secrets

In your .NET application, these secrets are seamlessly mapped to your configuration objects just like standard JSON settings. For example, in your `Program.cs` or startup configuration:

```csharp
// Reading the Connection String
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Reading JWT Settings
var jwtKey = builder.Configuration["Jwt:Key"];

```

### Where are these stored?

The .NET Secret Manager saves these values in a system-protected JSON file completely separate from your project folder:

* **Windows:** `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\secrets.json`
* **macOS/Linux:** `~/.microsoft/usersecrets/<UserSecretsId>/secrets.json`


# Migrations: 
```
cd backend/

dotnet ef migrations add MIGRATION_NAME_HERE \
--project mvpMembers.Infrastructure \
--startup-project mvpMembers.API
```