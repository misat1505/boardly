package com.example.backend.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.entities.User;

public interface UserRepository extends JpaRepository<User, String> {}
