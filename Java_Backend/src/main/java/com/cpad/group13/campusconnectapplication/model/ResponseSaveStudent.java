package com.cpad.group13.campusconnectapplication.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@Setter
@ToString
public class ResponseSaveStudent {

    private Integer userId;
    private String firstName;
    private String verified;


}
