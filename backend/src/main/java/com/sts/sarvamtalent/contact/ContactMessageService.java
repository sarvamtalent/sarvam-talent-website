package com.sts.sarvamtalent.contact;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactMessageService {

  private final ContactMessageRepository contactMessageRepository;

  public ContactMessageService(ContactMessageRepository contactMessageRepository) {
    this.contactMessageRepository = contactMessageRepository;
  }

  @Transactional
  public ContactMessage save(ContactMessageRequest request) {
    ContactMessage contactMessage = new ContactMessage();
    contactMessage.setName(request.name().trim());
    contactMessage.setEmail(request.email().trim());
    contactMessage.setPhone(normalizeOptional(request.phone()));
    contactMessage.setMessage(request.message().trim());

    return contactMessageRepository.save(contactMessage);
  }

  @Transactional(readOnly = true)
  public List<ContactMessage> findAll(String search, String sort) {
    String trimmedSearch = search == null ? "" : search.trim();
    Sort dateSort = "asc".equalsIgnoreCase(sort)
        ? Sort.by("createdAt").ascending()
        : Sort.by("createdAt").descending();

    if (trimmedSearch.isEmpty()) {
      return contactMessageRepository.findAll(dateSort);
    }

    return contactMessageRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCaseOrMessageContainingIgnoreCase(
        trimmedSearch,
        trimmedSearch,
        trimmedSearch,
        trimmedSearch,
        dateSort);
  }

  @Transactional
  public void deleteById(Long id) {
    contactMessageRepository.deleteById(id);
  }

  private String normalizeOptional(String value) {
    if (value == null || value.trim().isEmpty()) {
      return null;
    }

    return value.trim();
  }
}
