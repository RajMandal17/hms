package com.task.hms.ipd.dto;

public class WardWithBedsDTO {
    private String name;
    private String type;
    private int bedCount;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getBedCount() { return bedCount; }
    public void setBedCount(int bedCount) { this.bedCount = bedCount; }
}
