package com.cpad.group13.campusconnectapplication.model;

import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "student_tag")
@Data
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "idTags")
    private Integer tagId;

    @Column(name = "Tag")
    private String tag;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "Student_user_id", nullable = false)
    private Student student;
}
