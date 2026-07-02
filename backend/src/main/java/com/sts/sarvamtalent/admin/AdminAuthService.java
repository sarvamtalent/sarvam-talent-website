package com.sts.sarvamtalent.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminAuthService {

  @Value("${app.admin.username:admin}")
  private String adminUsername;

  @Value("${app.admin.password:admin123}")
  private String adminPassword;

  @Value("${app.admin.token:change-this-admin-token}")
  private String adminToken;

  public AdminLoginResponse login(AdminLoginRequest request) {
    String username = request.username() == null ? "" : request.username().trim();
    String password = request.password() == null ? "" : request.password().trim();

    if (!adminUsername.trim().equals(username) || !adminPassword.trim().equals(password)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin credentials");
    }

    return new AdminLoginResponse(adminToken);
  }

  public void requireValidToken(String token) {
    if (token == null || token.isBlank() || !adminToken.equals(token)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin token");
    }
  }
}
