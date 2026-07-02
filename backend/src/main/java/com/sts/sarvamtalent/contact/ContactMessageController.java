package com.sts.sarvamtalent.contact;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact-messages")
@CrossOrigin(origins = {
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "https://sarvamtalent.com",
    "https://www.sarvamtalent.com"
})
public class ContactMessageController {

  private final ContactMessageService contactMessageService;

  public ContactMessageController(ContactMessageService contactMessageService) {
    this.contactMessageService = contactMessageService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ContactMessageResponse create(@Valid @RequestBody ContactMessageRequest request) {
    return ContactMessageResponse.from(contactMessageService.save(request));
  }
}
