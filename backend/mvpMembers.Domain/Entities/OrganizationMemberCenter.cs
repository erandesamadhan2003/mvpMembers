namespace mvpMembers.Domain.Entities;

public class OrganizationMemberCenter
{
    public long OrganizationMemberCenterID { get; set; }
    public long OrganizationMemberTownID { get; set; }
    public string CenterID { get; set; } = string.Empty;
    public string CenterName { get; set; } = string.Empty;
    public long? OCode { get; set; }
    public long? AddBy { get; set; }
    public DateTime? AddByTime { get; set; }
    public long? EditBy { get; set; }
    public DateTime? EditByTime { get; set; }
    public Guid URID { get; set; } = Guid.NewGuid();
    public OrganizationMemberTown OrganizationMemberTown { get; set; } = null!;
}