package com.task.hms.user.service;

import com.task.hms.user.dto.UserRegistrationRequest;
import com.task.hms.user.model.User;

public interface UserService {
    User registerUser(UserRegistrationRequest request);
    User authenticate(String username, String password);
    void changePassword(String username, String oldPassword, String newPassword);
}
