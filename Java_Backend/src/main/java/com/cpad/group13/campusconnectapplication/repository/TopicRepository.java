package com.cpad.group13.campusconnectapplication.repository;

import com.cpad.group13.campusconnectapplication.model.Student;
import com.cpad.group13.campusconnectapplication.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {

    @Query("SELECT t FROM Topic t WHERE t.student = ?1")
    Iterable<Topic> findAllByStudent(Student student);

    Iterable<Topic> findByTopicNameContaining(String topicName);
}
