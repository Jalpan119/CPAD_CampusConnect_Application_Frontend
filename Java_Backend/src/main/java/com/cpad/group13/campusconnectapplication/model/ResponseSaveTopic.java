package com.cpad.group13.campusconnectapplication.model;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@ToString
@NoArgsConstructor
public class ResponseSaveTopic {

    private Integer topicId;
    private String topicName;
    private String description;
    private Integer studentId;
}
