package com.cpad.group13.campusconnectapplication.service;

import com.cpad.group13.campusconnectapplication.model.Student;
import com.cpad.group13.campusconnectapplication.model.Topic;
import com.cpad.group13.campusconnectapplication.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TopicService {

    @Autowired
    private TopicRepository repo;

    public Optional<Topic> getTopicById(Integer topicId) {
        return repo.findById(topicId);
    }

    public Iterable<Topic> getTopicsByTopicName(String topicName) {
        return repo.findByTopicNameContaining(topicName);
    }

    public Iterable<Topic> getAllTopicsByStudentId(Student student) {
        return repo.findAllByStudent(student);
    }

    public Topic saveTopic(Topic topic) {
        return repo.save(topic);
    }

    public void deleteTopic(Integer topicId) {
        repo.deleteById(topicId);
    }
}
