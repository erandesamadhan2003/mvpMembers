namespace mvpMembers.Application.DTOs.OrganizationMember;

public class CreateOrganizationMemberRequestDto
{
    public long? NameTitleID { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public string? MiddleName { get; set; }
    public string? NameInNativeLanguage { get; set; }

    // Permanent Address
    public string? Town { get; set; }
    public string? City { get; set; }
    public string? Taluka { get; set; }
    public string? District { get; set; }
    public string? States { get; set; }
    public string? PinCode { get; set; }

    // Present Address
    public string? PTown { get; set; }
    public string? PCity { get; set; }
    public string? PTaluka { get; set; }
    public string? PDistrict { get; set; }
    public string? PPinCode { get; set; }

    // Marathi Permanent Address
    public string? MTown { get; set; }
    public string? MCity { get; set; }
    public string? MTaluka { get; set; }
    public string? MDistrict { get; set; }
    public string? MStates { get; set; }
    public string? MPinCode { get; set; }

    // Marathi Present Address
    public string? MPTown { get; set; }
    public string? MPCity { get; set; }
    public string? MPTaluka { get; set; }
    public string? MPDistrict { get; set; }
    public string? MPPinCode { get; set; }

    public string? Gender { get; set; }
    public DateTime? DOB { get; set; }
    public string? Qualification { get; set; }
    public long? OccupationID { get; set; }
    public string? Nominee { get; set; }
    public string? PhoneNo { get; set; }
    public string? MobileNo { get; set; }
    public string? EMail { get; set; }
    public string? AdharID { get; set; }
    public string? PANNo { get; set; }
    public string? MemberNo { get; set; }
    public string? RegNo { get; set; }
    public long? ApplicationNo { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public string? PrvShareHolder { get; set; }
    public string? Objection { get; set; }
    public long? MemberSectionID { get; set; }
    public long? OrganizationMemberSubTownID { get; set; }
    public bool? IsTransfer { get; set; }
    public long? TransferOrganizationMemberID { get; set; }
}