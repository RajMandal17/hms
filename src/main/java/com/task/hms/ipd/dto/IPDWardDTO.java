package com.task.hms.ipd.dto;

public class IPDWardDTO {
    private Long id;
    private String name;
    private String type;
    // Optionally add totalBeds, availableBeds in future

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
