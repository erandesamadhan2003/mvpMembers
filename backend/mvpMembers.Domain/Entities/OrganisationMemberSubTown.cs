namespace mvpMembers.Domain.Entities;

public class OrganisationMemberSubTown
{
    public long OrganisationMemberSubTownID { get; set; }
    public long OrganizationMemberCenterID { get; set; }
    public string SubTownID { get; set; }= string.Empty;
    public string SubTownName { get; set; } = string.Empty;
    public long? OCode { get; set; }
    public long? AddBy { get; set; }
    public DateTime? AddByTime { get; set; }
    public long? EditBy { get; set; }
    public DateTime? EditByTime { get; set; }
    public Guid URID { get; set; } = Guid.NewGuid();
    public OrganizationMemberCenter OrganizationMemberCenter { get; set; } = null!;
}