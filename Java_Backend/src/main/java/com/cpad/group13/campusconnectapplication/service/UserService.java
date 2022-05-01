package com.cpad.group13.campusconnectapplication.service;

import com.cpad.group13.campusconnectapplication.model.Student;
import com.cpad.group13.campusconnectapplication.oauth2.CustomOAuth2User;
import com.cpad.group13.campusconnectapplication.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@Slf4j
public class UserService {

    @Autowired
    private StudentRepository repo;

    public void processOAuthPostLogin(CustomOAuth2User oauthUser) {

        log.info("inside processOAuthPostLogin");
        Student existUser = repo.findByEmailId(oauthUser.getEmail());

        /*System.out.println("Attributes: ");
        for (String key : oauthUser.getAttributes().keySet().toArray(new String[0])) {
            System.out.println("key: " + key + ", value: " + oauthUser.getAttributes().get(key).toString());
        }*/

        if (!Objects.nonNull(existUser)) {
            //log.info("exist user: " + existUser.toString());
            Student newStudent = new Student();
            newStudent.setEmailId(oauthUser.getEmail());
            newStudent.setVerified(Boolean.TRUE.toString());
            repo.save(newStudent);
        }

    }

}
