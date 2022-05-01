package com.cpad.group13.campusconnectapplication.repository;

import com.cpad.group13.campusconnectapplication.model.Student;
import com.cpad.group13.campusconnectapplication.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {

    @Query("SELECT t FROM Tag t WHERE t.student = ?1")
    Iterable<Tag> findAllByStudent(Student student);

    Iterable<Tag> findByTagContaining(String tagName);

}
