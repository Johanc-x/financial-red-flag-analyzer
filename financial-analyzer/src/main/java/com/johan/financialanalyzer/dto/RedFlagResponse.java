package com.johan.financialanalyzer.dto;

public class RedFlagResponse {

    private String title;
    private String description;
    private String severity;

    public RedFlagResponse(String title, String description, String severity) {
        this.title = title;
        this.description = description;
        this.severity = severity;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
