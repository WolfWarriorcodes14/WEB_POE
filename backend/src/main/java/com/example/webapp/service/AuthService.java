package com.example.webapp.service;

import com.example.webapp.model.User;
import com.example.webapp.model.Admin;
import com.example.webapp.repository.UserRepository;
import com.example.webapp.repository.AdminRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AdminRepository adminRepo;

    // REGISTER USER
    public User register(User user) {
        return userRepo.save(user);
    }

    // USER LOGIN
    public User loginUser(String email, String password) {
        Optional<User> user = userRepo.findByEmail(email);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        return null;
    }

    // ADMIN LOGIN
    public Admin loginAdmin(String email, String password) {
        Optional<Admin> admin = adminRepo.findByEmail(email);

        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            return admin.get();
        }
        return null;
    }
}