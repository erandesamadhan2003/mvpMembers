namespace mvpMembers.Domain.Entities;

public class OrganizationMemberTown
{
    public long OrganizationMemberTownID { get; set; }
    public long TownID { get; set; }
    public string TownName { get; set; } = string.Empty;
    public long? OCode { get; set; }
    public long? AddBy { get; set; }
    public DateTime? AddByTime { get; set; }
    public long? EditBy { get; set; }
    public DateTime? EditByTime { get; set; }
    public Guid URID { get; set; } = Guid.NewGuid();
}