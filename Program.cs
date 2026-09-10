using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NewMaxReact.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Session Support
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(60);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Register Maxpay Application Services (Dependency Injection)
builder.Services.AddScoped<IAttendanceProcess, AttendanceProcessActions>();
builder.Services.AddScoped<IEmployees, EmployeeActions>();
builder.Services.AddScoped<IUserManage, UserManageActions>();
builder.Services.AddScoped<IAttendanceReport, AttendanceReportActions>();
builder.Services.AddScoped<IContractor, ContractorActions>();
builder.Services.AddScoped<IOrgStructure, OrgStructureActions>();
builder.Services.AddScoped<IMastersImport, MastersImportActions>();
builder.Services.AddScoped<ITempEmp, TempEmpActions>();

// Add SPA static files
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/dist";
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
if (!app.Environment.IsDevelopment())
{
    app.UseSpaStaticFiles();
}

app.UseRouting();
app.UseSession();
app.UseAuthorization();

// SPA Fallback Middleware (identical to LMSApp pattern)
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value ?? "";

    bool isApiRoute = path.StartsWith("/api", StringComparison.OrdinalIgnoreCase);
    bool isStaticFile = path.Contains('.') || context.Request.Headers.Accept.ToString().Contains("application/json", StringComparison.OrdinalIgnoreCase);

    if (isApiRoute || isStaticFile)
    {
        await next();
        return;
    }

    var indexPath = System.IO.Path.Combine(app.Environment.WebRootPath, "index.html");
    if (System.IO.File.Exists(indexPath))
    {
        context.Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
        context.Response.Headers["Pragma"] = "no-cache";
        context.Response.Headers["Expires"] = "0";
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync(indexPath);
        return;
    }

    await next();
});

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
