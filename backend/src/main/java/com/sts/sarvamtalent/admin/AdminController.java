package com.sts.sarvamtalent.admin;

import com.sts.sarvamtalent.contact.ContactMessageResponse;
import com.sts.sarvamtalent.contact.ContactMessageService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(
    origins = {
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "https://sarvamtalent.com",
        "https://www.sarvamtalent.com"
    },
    allowedHeaders = {"Content-Type", "X-Admin-Token"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AdminController {

  private final AdminAuthService adminAuthService;
  private final ContactMessageService contactMessageService;

  public AdminController(AdminAuthService adminAuthService, ContactMessageService contactMessageService) {
    this.adminAuthService = adminAuthService;
    this.contactMessageService = contactMessageService;
  }

  @PostMapping("/login")
  public AdminLoginResponse login(@Valid @RequestBody AdminLoginRequest request) {
    return adminAuthService.login(request);
  }

  @GetMapping("/contact-messages")
  public List<ContactMessageResponse> listMessages(
      @RequestHeader("X-Admin-Token") String token,
      @RequestParam(defaultValue = "") String search,
      @RequestParam(defaultValue = "desc") String sort) {
    adminAuthService.requireValidToken(token);
    return contactMessageService.findAll(search, sort).stream()
        .map(ContactMessageResponse::from)
        .toList();
  }

  @DeleteMapping("/contact-messages/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteMessage(
      @RequestHeader("X-Admin-Token") String token,
      @PathVariable Long id) {
    adminAuthService.requireValidToken(token);
    contactMessageService.deleteById(id);
  }
}
