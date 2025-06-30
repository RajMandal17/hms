package com.task.hms.ipd.dto;

public class IPDBedDTO {
    private Long id;
    private Long wardId;
    private String bedNumber;
    private BedStatus status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getWardId() { return wardId; }
    public void setWardId(Long wardId) { this.wardId = wardId; }
    public String getBedNumber() { return bedNumber; }
    public void setBedNumber(String bedNumber) { this.bedNumber = bedNumber; }
    public BedStatus getStatus() { return status; }
    public void setStatus(BedStatus status) { this.status = status; }
}
