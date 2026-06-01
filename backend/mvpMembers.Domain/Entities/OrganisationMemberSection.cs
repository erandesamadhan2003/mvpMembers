namespace mvpMembers.Domain.Entities;

public class OrganizationMemberSection
{
    public long MemberSectionID { get; set; }
    public string MemberSectionName { get; set; } = string.Empty;
    public long? AddBy { get; set; }
    public DateTime? AddByTime { get; set; }
    public long? EditBy { get; set; }
    public DateTime? EditByTime { get; set; }
    public Guid URID { get; set; } = Guid.NewGuid();
}