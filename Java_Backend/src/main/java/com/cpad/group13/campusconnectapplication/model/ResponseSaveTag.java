package com.cpad.group13.campusconnectapplication.model;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@ToString
@NoArgsConstructor
public class ResponseSaveTag {

    private Integer tagId;
    private String tagName;
    private Integer studentId;
}
