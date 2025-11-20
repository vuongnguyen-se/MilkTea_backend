using backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ===========================
// ⭐ KHAI BÁO DB CONTEXT
// ===========================
builder.Services.AddDbContext<MilkTeaDBContext>(options =>
{
    var conn = builder.Configuration.GetConnectionString("MilkTeaDB");
    options.UseMySql(conn, ServerVersion.AutoDetect(conn));
});

// ===========================
// ⭐ CORS CHO VITE 5173
// ===========================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVite",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// ===========================
// ⭐ ÁP DỤNG CORS
// ===========================
app.UseCors("AllowVite");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// This line of code prevent build backend localhost.
// app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
