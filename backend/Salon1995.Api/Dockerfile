# Multi-stage Dockerfile for Salon1995.Api
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Salon1995.Api.csproj", "./"]
RUN dotnet restore "./Salon1995.Api.csproj"

COPY . .
RUN dotnet publish "./Salon1995.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Salon1995.Api.dll"]
