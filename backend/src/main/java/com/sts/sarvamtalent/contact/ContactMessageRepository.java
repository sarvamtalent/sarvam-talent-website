package com.sts.sarvamtalent.contact;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

  List<ContactMessage> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCaseOrMessageContainingIgnoreCase(
      String name,
      String email,
      String phone,
      String message,
      Sort sort);
}
