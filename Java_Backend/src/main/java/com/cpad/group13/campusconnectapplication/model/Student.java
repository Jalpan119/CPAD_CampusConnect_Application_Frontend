package com.cpad.group13.campusconnectapplication.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "student")
@Data
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "email_id")
    private String emailId;

    @Column(name = "subject")
    private String subject;

    @Column(name = "university")
    private String university;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "degree")
    private String degree;

    @Column(name = "verified")
    private String verified;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    private List<Topic> topics;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    private List<Topic> tags;
}
