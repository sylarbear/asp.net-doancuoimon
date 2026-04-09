FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY TechnoStore.sln .
COPY src/TechnoStore.Domain/TechnoStore.Domain.csproj src/TechnoStore.Domain/
COPY src/TechnoStore.Application/TechnoStore.Application.csproj src/TechnoStore.Application/
COPY src/TechnoStore.Infrastructure/TechnoStore.Infrastructure.csproj src/TechnoStore.Infrastructure/
COPY src/TechnoStore.API/TechnoStore.API.csproj src/TechnoStore.API/
RUN dotnet restore

COPY . .
RUN dotnet publish src/TechnoStore.API/TechnoStore.API.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# Create data directory for SQLite
RUN mkdir -p /app/data

ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "TechnoStore.API.dll"]
