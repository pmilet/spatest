// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.Authority = "https://identityserverribtest.azurewebsites.net/";
        //options.Authority = "https://localhost:5001/";
        options.TokenValidationParameters.ValidateAudience = false;
    });

builder.Services.AddAuthorization(options =>
    options.AddPolicy("ApiScope", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("scope", "api1");
    }));

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyAllowSpecificOrigins", builder =>
    {
        builder.WithOrigins("https://yellow-flower-0793e2a03.4.azurestaticapps.net")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials(); // Add this line to allow credentials

    });
});

var app = builder.Build();

app.UseCors("MyAllowSpecificOrigins");
// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers().RequireAuthorization("ApiScope");

app.Run();
