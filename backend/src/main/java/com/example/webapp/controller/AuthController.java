package com.example.webapp.controller;

import com.example.webapp.model.User;
import com.example.webapp.model.Admin;
import com.example.webapp.service.AuthService;
import com.example.webapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(
        origins = "http://localhost:3000",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    // ================= REGISTER =================
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("STUDENT");
        }
        return authService.register(user);
    }

    // ================= USER LOGIN =================
    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return authService.loginUser(user.getEmail(), user.getPassword());
    }

    // ================= ADMIN LOGIN =================
    @PostMapping("/admin/login")
    public Admin adminLogin(@RequestBody Admin admin) {
        return authService.loginAdmin(admin.getEmail(), admin.getPassword());
    }

    // ✅ GET /api/users/count?role=STUDENT
    @GetMapping("/users/count")
    public long countUsers(@RequestParam(required = false) String role) {
        if (role != null && !role.isEmpty()) {
            return userRepository.countByRole(role);
        }
        return userRepository.count();
    }

    @RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
    public void handleOptions() {}
}