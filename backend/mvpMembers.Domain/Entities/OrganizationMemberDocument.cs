namespace mvpMembers.Domain.Entities;

public class OrganizationMemberDocument
{
    public long OrganizationMemberDocumentID { get; set; }
    public long OrganizationMemberID { get; set; }
    public byte[]? MemberPhoto { get; set; }
    public byte[]? AadhaarCopy { get; set; }
    public byte[]? PANCopy { get; set; }
    public byte[]? DeathCertificate { get; set; }
    public long? AddBy { get; set; }
    public DateTime? AddByTime { get; set; }
    public long? EditBy { get; set; }
    public DateTime? EditByTime { get; set; }
    public Guid URID { get; set; } = Guid.NewGuid();
    public OrganizationMember OrganizationMember { get; set; } = null!;
}