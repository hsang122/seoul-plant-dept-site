document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var yearEl = document.querySelector("[data-current-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector("[data-form-status]");
      var submitBtn = form.querySelector('button[type="submit"]');

      var showStatus = function (message, isError) {
        if (!status) return;
        status.textContent = message;
        status.style.display = "block";
        status.style.color = isError ? "#b91c1c" : "#123353";
      };

      if (typeof supabaseClient === "undefined") {
        showStatus("문의 시스템 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.", true);
        return;
      }

      var payload = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value,
        message: form.message.value.trim(),
      };

      submitBtn.disabled = true;
      showStatus("전송 중입니다...", false);

      supabaseClient
        .from("inquiries")
        .insert([payload])
        .then(function (result) {
          submitBtn.disabled = false;
          if (result.error) {
            showStatus("문의 접수에 실패했습니다: " + result.error.message, true);
            return;
          }
          showStatus("문의가 정상적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.", false);
          form.reset();
        });
    });
  }
});
