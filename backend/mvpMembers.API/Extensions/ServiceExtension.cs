using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Infrastructure.Services;

using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Infrastructure.Repositories;

namespace mvpMembers.API.Extensions;

public static class ServiceExtension
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IJwtService, JwtService>();
        
        // Repositories
        services.AddScoped<IOrganizationMemberSectionRepository, OrganizationMemberSectionRepository>();
        services.AddScoped<IOrganizationMemberTownRepository, OrganizationMemberTownRepository>();
        services.AddScoped<IOrganizationMemberCenterRepository, OrganizationMemberCenterRepository>();
        services.AddScoped<IOrganizationMemberRepository, OrganizationMemberRepository>();
        services.AddScoped<IOrganizationMemberDocumentRepository, OrganizationMemberDocumentRepository>();
        services.AddScoped<IOrganisationMemberSubTownRepository, OrganisationMemberSubTownRepository>();
        
        // Services
        services.AddScoped<IOrganizationMemberSectionService, OrganizationMemberSectionService>();
        services.AddScoped<IOrganizationMemberTownService, OrganizationMemberTownService>();
        services.AddScoped<IOrganizationMemberCenterService, OrganizationMemberCenterService>();
        services.AddScoped<IOrganizationMemberService, OrganizationMemberService>();
        services.AddScoped<IOrganizationMemberDocumentService, OrganizationMemberDocumentService>();
        services.AddScoped<IOrganisationMemberSubTownService, OrganisationMemberSubTownService>();
        return services;
    }
}