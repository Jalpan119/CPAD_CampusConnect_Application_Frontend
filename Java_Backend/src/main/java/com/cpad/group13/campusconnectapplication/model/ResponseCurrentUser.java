package com.cpad.group13.campusconnectapplication.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@Setter
@ToString
public class ResponseCurrentUser {

    private String email;
    private String googleName;
    private String pictureUrl;

}
