using Microsoft.EntityFrameworkCore;
using SheMadeApi.Data;

var builder = WebApplication.CreateBuilder(args);

// EF Core -> SQL Server (uses the "SheMadeDB" connection string in appsettings.json)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SheMadeDB")));

builder.Services.AddControllers();

// Allow the static frontend (opened from any origin/port, e.g. Live Server on :5500,
// or file:// during local testing) to call this API.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
