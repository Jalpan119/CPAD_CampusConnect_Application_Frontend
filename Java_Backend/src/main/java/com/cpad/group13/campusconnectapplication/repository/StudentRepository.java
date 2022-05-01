package com.cpad.group13.campusconnectapplication.repository;

import com.cpad.group13.campusconnectapplication.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {

    Student findByEmailId(String emailId);

    @Query("SELECT s FROM Student s WHERE s.firstName like  %:firstName%")
    Iterable<Student> findByFirstNameContaining(@Param("firstName")String firstName);

    @Query("SELECT s FROM Student s join Tag t on s.userId = t.student where t.tag like %:tag%")
    Iterable<Student> findAllStudentsByTags(@Param("tag")String tag);
}