package com.cpad.group13.campusconnectapplication.controller;

import com.cpad.group13.campusconnectapplication.model.*;
import com.cpad.group13.campusconnectapplication.oauth2.CustomOAuth2User;
import com.cpad.group13.campusconnectapplication.service.StudentService;
import com.cpad.group13.campusconnectapplication.service.TagService;
import com.cpad.group13.campusconnectapplication.service.TopicService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:8100")
public class UserDetailsController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private TopicService topicService;

    @Autowired
    private TagService tagService;

    //To get current logged-in user

    @GetMapping(path="/getCurrentUser")
    public @ResponseBody ResponseEntity<ResponseCurrentUser> getCurrentUser(Authentication authentication,
                                                                            HttpServletRequest request) {
        try {
            log.info("request userPrincipal: " + request.getUserPrincipal());
            log.info("auth principal: " + authentication.getPrincipal());
            CustomOAuth2User oauthUser = (CustomOAuth2User) authentication.getPrincipal();
            ResponseCurrentUser currentUser = new ResponseCurrentUser(oauthUser.getEmail(),
                    oauthUser.getName(), oauthUser.getPicture());
            return new ResponseEntity<>(currentUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Student related endpoints

    @GetMapping(path="/all")
    public @ResponseBody Iterable<Student> getAllUsers() {
        return studentService.getAllStudents();
    }

    @GetMapping(path="/getStudent")
    public @ResponseBody ResponseEntity<Student> getUser(@RequestParam String emailId) {
        try {
            Student student = studentService.getStudentByEmail(emailId);
            if (Objects.nonNull(student)) {
                log.info("Student: " + student);
                return new ResponseEntity<Student>(student, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(path="/saveStudent")
    public @ResponseBody ResponseEntity<ResponseSaveStudent> saveStudent(@RequestBody Student student) {
        try {
            Student existUser = studentService.getStudentByEmail(student.getEmailId());
            if (Objects.nonNull(existUser)) {
                student.setUserId(existUser.getUserId());
                Student studentObj = studentService.saveStudent(student);
                ResponseSaveStudent resp = new ResponseSaveStudent(studentObj.getUserId(),
                        studentObj.getFirstName(), studentObj.getVerified());
                return new ResponseEntity<ResponseSaveStudent>(resp, HttpStatus.OK);
            } else {
                Student studentObj = studentService.saveStudent(student);
                ResponseSaveStudent resp = new ResponseSaveStudent(studentObj.getUserId(),
                        studentObj.getFirstName(), studentObj.getVerified());
                return new ResponseEntity<ResponseSaveStudent>(resp, HttpStatus.CREATED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Topic related endpoints

    @GetMapping(path="/getTopicById/{id}")
    public @ResponseBody ResponseEntity<Topic> getTopicById(@PathVariable Integer id) {
        try {
            Optional<Topic> topic = topicService.getTopicById(id);
            if (topic.isPresent()) {
                log.info("Topic: " + topic);
                return new ResponseEntity<Topic>(topic.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path="/getTopicsByTopicName")
    public @ResponseBody ResponseEntity<Iterable<Topic>> getTopicsByTopicName(@RequestParam String name) {
        try {
            Iterable<Topic> topics = topicService.getTopicsByTopicName(name);
            return new ResponseEntity<Iterable<Topic>>(topics, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(path="/getTopicsOfStudent/{id}")
    public @ResponseBody Iterable<Topic> getTopicsByStudentId(@PathVariable Integer id) {
        Student student = new Student();
        student.setUserId(id);
        return topicService.getAllTopicsByStudentId(student);
    }

    @PostMapping(path="/saveTopic")
    public @ResponseBody ResponseEntity<ResponseSaveTopic> saveTopicForStudent(@RequestBody Topic topic) {
        try {
            Topic topicObj = topicService.saveTopic(topic);
            ResponseSaveTopic topicResponse = new ResponseSaveTopic();
            topicResponse.setTopicId(topicObj.getTopicId());
            topicResponse.setTopicName(topicObj.getTopicName());
            topicResponse.setDescription(topicObj.getDescription());
            topicResponse.setStudentId(topicObj.getStudent().getUserId());
            return new ResponseEntity<ResponseSaveTopic>(topicResponse, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(path="/deleteTopic/{id}")
    public @ResponseBody ResponseEntity<Topic> deleteTopic(@PathVariable Integer id) {
        try {
            topicService.deleteTopic(id);
            return new ResponseEntity<Topic>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Tag related endpoints

    @GetMapping(path="/getTagById/{id}")
    public @ResponseBody ResponseEntity<Tag> getTagById(@PathVariable Integer id) {
        try {
            Optional<Tag> tag = tagService.getTagById(id);
            if (tag.isPresent()) {
                log.info("Tag: " + tag);
                return new ResponseEntity<Tag>(tag.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path="/getTagsByTagName")
    public @ResponseBody ResponseEntity<Iterable<Tag>> getTagsByTagName(@RequestParam String name) {
        try {
            Iterable<Tag> tags = tagService.getTagsByTagName(name);
            return new ResponseEntity<Iterable<Tag>>(tags, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path="/getTagsOfStudent/{id}")
    public @ResponseBody Iterable<Tag> getTagsByStudentId(@PathVariable Integer id) {
        Student student = new Student();
        student.setUserId(id);
        return tagService.getAllTagsByStudentId(student);
    }

    @PostMapping(path="/saveTag")
    public @ResponseBody ResponseEntity<ResponseSaveTag> saveTagForStudent(@RequestBody Tag tag) {
        try {
            Tag tagObj = tagService.saveTag(tag);
            ResponseSaveTag tagResponse = new ResponseSaveTag();
            tagResponse.setTagId(tagObj.getTagId());
            tagResponse.setTagName(tagObj.getTag());
            tagResponse.setStudentId(tagObj.getStudent().getUserId());
            return new ResponseEntity<ResponseSaveTag>(tagResponse, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(path="/deleteTag/{id}")
    public @ResponseBody ResponseEntity<Tag> deleteTag(@PathVariable Integer id) {
        try {
            tagService.deleteTag(id);
            return new ResponseEntity<Tag>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Student search related endpoints

    @GetMapping(path="/findStudentsByTag")
    public @ResponseBody ResponseEntity<Iterable<Student>> findStudentsByTag(@RequestParam String tag) {
        try {
            Iterable<Student> students = studentService.getAllStudentsByTag(tag);
            return new ResponseEntity<Iterable<Student>>(students, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path="/findStudentsByFirstName")
    public @ResponseBody ResponseEntity<Iterable<Student>> getStudentsByFirstName(@RequestParam String name) {
        try {
            Iterable<Student> students = studentService.getStudentsByFirstName(name);
            return new ResponseEntity<Iterable<Student>>(students, HttpStatus.OK);
        } catch (Exception e) {
            log.error("error in findStudentsByFirstName" + e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
