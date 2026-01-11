package com.collegeos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subjects")
public class Subject {
    @Id
    private String id;
    private String name;
    private int totalClasses;
    private int attendedClasses;
    private double targetAttendance = 75.0;
    private String studentId;

    public Subject() {
    }

    public Subject(String name, String studentId) {
        this.name = name;
        this.studentId = studentId;
        this.totalClasses = 0;
        this.attendedClasses = 0;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(int totalClasses) {
        this.totalClasses = totalClasses;
    }

    public int getAttendedClasses() {
        return attendedClasses;
    }

    public void setAttendedClasses(int attendedClasses) {
        this.attendedClasses = attendedClasses;
    }

    public double getTargetAttendance() {
        return targetAttendance;
    }

    public void setTargetAttendance(double targetAttendance) {
        this.targetAttendance = targetAttendance;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    // Smart Calculations
    public double getCurrentPercentage() {
        if (totalClasses == 0)
            return 0.0;
        return (double) attendedClasses / totalClasses * 100.0;
    }

    public void markPresent() {
        this.totalClasses++;
        this.attendedClasses++;
    }

    public void markAbsent() {
        this.totalClasses++;
    }

    public void markCancelled() {
        // Do nothing, just ignored
    }
}
