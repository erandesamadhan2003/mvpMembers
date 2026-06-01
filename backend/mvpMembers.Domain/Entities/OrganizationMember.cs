namespace mvpMembers.Domain.Entities;

public class OrganizationMember
{
    public long OrganizationMemberID { get; set; }
    public long? NameTitleID { get; set; }
    public string? LastName { get; set; }
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? NameInNativeLanguage { get; set; }
    public string? City { get; set; }
    public string? Taluka { get; set; }
    public string? District { get; set; }
    public string? States { get; set; }
    public string? PinCode { get; set; }
    public string? PCity { get; set; }
    public string? PTaluka { get; set; }
    public string? PDistrict { get; set; }
    public string? PPinCode { get; set; }
    public string? Gender { get; set; }
    public DateTime? DOB { get; set; }
    public string? Qualification { get; set; }
    public long? OccupationID { get; set; }
    public string? Nominee { get; set; }
    public string? PhoneNo { get; set; }
    public string? EMail { get; set; }
    public string? AdharID { get; set; }
    public string? PANNo { get; set; }
    public string? MemberNo { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public bool MemberCardIssue { get; set; }
    public bool Death { get; set; }
    public DateTime? DeathDate { get; set; }
    public long? MemberSectionID { get; set; }
    public long? OrganizationMemberCenterID { get; set; }
    public long? OCode { get; set; }
    public long? AddBy { get; set; }
    public DateTime? AddByTime { get; set; }
    public long? EditBy { get; set; }
    public DateTime? EditByTime { get; set; }
    public Guid URID { get; set; } = Guid.NewGuid();
    public long? TransferOrganizationMemberID { get; set; }
    public bool? IsTransfer { get; set; }
    public string? PrvShareHolder { get; set; }
    public string? FlagStatus { get; set; }
    public OrganizationMemberSection? MemberSection { get; set; }
    public OrganizationMemberCenter? OrganizationMemberCenter { get; set; }
    public OrganizationMember? TransferOrganizationMember { get; set; }
}