package com.cpad.group13.campusconnectapplication.service;

import com.cpad.group13.campusconnectapplication.model.Student;
import com.cpad.group13.campusconnectapplication.model.Tag;
import com.cpad.group13.campusconnectapplication.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TagService {

    @Autowired
    private TagRepository repo;

    public Optional<Tag> getTagById(Integer tagId) {
        return repo.findById(tagId);
    }

    public Iterable<Tag> getTagsByTagName(String tagName) {
        return repo.findByTagContaining(tagName);
    }

    public Iterable<Tag> getAllTagsByStudentId(Student student) {
        return repo.findAllByStudent(student);
    }

    public Tag saveTag(Tag tag) {
        return repo.save(tag);
    }

    public void deleteTag(Integer tagId) {
        repo.deleteById(tagId);
    }
}
