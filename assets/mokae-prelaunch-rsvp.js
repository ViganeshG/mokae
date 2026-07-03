(function () {
  var RSVP_LOG_PREFIX = '[Mokae RSVP]';

  function parseWebhookJson(res) {
    return res.text().then(function (text) {
      try {
        return JSON.parse(text);
      } catch (err) {
        throw new Error('Sheet webhook returned invalid JSON. Redeploy Apps Script and check the URL.');
      }
    });
  }

  function initPrelaunchRsvp(root) {
    if (!root || root.dataset.initialized === 'true') return;
    root.dataset.initialized = 'true';

    var webhook = (root.dataset.webhook || '').trim();
    var sheetTab = (root.dataset.sheet || '').trim();
    var formId = (root.dataset.formId || root.dataset.pageHandle || '').trim();
    var eventTag = (root.dataset.eventTag || formId || sheetTab).trim().toLowerCase().replace(/\s+/g, '-');
    var customerTagRsvp = (root.dataset.customerTagRsvp || 'prelaunch-rsvp').trim();
    var customerTagWaitlist = (root.dataset.customerTagWaitlist || 'prelaunch-waitlist').trim();
    var cap = parseInt(root.dataset.cap, 10) || 10;
    var form = root.querySelector('[data-rsvp-form]');
    var shopifyForm = root.querySelector('[data-shopify-customer-form]');
    var shopifyFormEl = shopifyForm ? shopifyForm.closest('form') : null;
    var customerTagsInput = root.querySelector('[data-customer-tags-input]');
    var customerFirstName = root.querySelector('[data-customer-first-name]');
    var customerLastName = root.querySelector('[data-customer-last-name]');
    var customerEmail = root.querySelector('[data-customer-email]');
    var customerPhone = root.querySelector('[data-customer-phone]');
    var customerNote = root.querySelector('[data-customer-note]');
    var submitBtn = root.querySelector('[data-submit-btn]');
    var submitAnchor = root.querySelector('[data-submit-anchor]');
    var stickyCta = root.querySelector('[data-sticky-cta]');
    var stickyBtn = root.querySelector('[data-sticky-cta-btn]');
    var modeInput = root.querySelector('[data-mode-input]');
    var successEl = root.querySelector('[data-success-message]');
    var errorEl = root.querySelector('[data-error-message]');
    var formFields = root.querySelector('[data-form-fields]');
    var waitlistBanner = root.querySelector('[data-waitlist-banner]');
    var waitlistBannerText = root.querySelector('[data-waitlist-banner-text]');
    var stickyObserver = null;
    var mobileMq = window.matchMedia('(max-width: 749px)');

    if (!form || !submitBtn) return;

    if (!formId) {
      console.error('[Mokae RSVP] Missing page handle — this form cannot be isolated. Check the page template.');
    }
    if (!sheetTab) {
      console.error('[Mokae RSVP] Missing sheet tab — submissions will not route correctly.');
    }

    function logEntries(count) {
      console.log(RSVP_LOG_PREFIX + ' entries:', count);
    }

    function readCount(data) {
      if (!data || data.count === undefined || data.count === null) return null;
      var n = parseInt(data.count, 10);
      return isNaN(n) ? null : n;
    }

    function normalizePhone(phone) {
      var digits = String(phone || '').replace(/\D/g, '');
      if (digits.length === 12 && digits.indexOf('91') === 0) {
        digits = digits.substring(2);
      }
      if (digits.length === 11 && digits.indexOf('0') === 0) {
        digits = digits.substring(1);
      }
      return digits;
    }

    function isValidPhone(phone) {
      return normalizePhone(phone).length >= 10;
    }

    function splitName(full) {
      var parts = full.trim().split(/\s+/).filter(Boolean);
      if (!parts.length) return { first: '', last: '' };
      if (parts.length === 1) return { first: parts[0], last: '' };
      return { first: parts[0], last: parts.slice(1).join(' ') };
    }

    function buildCustomerTags(isWaitlist, phone) {
      var modeTag = isWaitlist ? customerTagWaitlist : customerTagRsvp;
      var phoneTag = phone.replace(/[^\d+]/g, '');
      var tags = [modeTag, 'event-' + eventTag];
      if (phoneTag) tags.push('phone-' + phoneTag);
      return tags.join(', ');
    }

    function syncShopifyCustomerFields(name, email, phone, isWaitlist) {
      var parts = splitName(name);
      if (customerFirstName) customerFirstName.value = parts.first;
      if (customerLastName) customerLastName.value = parts.last;
      if (customerEmail) customerEmail.value = email;
      if (customerPhone) customerPhone.value = phone;
      if (customerTagsInput) customerTagsInput.value = buildCustomerTags(isWaitlist, phone);
      if (customerNote) {
        customerNote.value =
          'Pre-Launch RSVP | ' +
          sheetTab +
          ' | ' +
          (isWaitlist ? 'waitlist' : 'rsvp') +
          ' | ' +
          new Date().toISOString();
      }
    }

    function submitShopifyCustomer() {
      if (!shopifyFormEl) {
        return Promise.resolve({ ok: true, skipped: true });
      }

      var formData = new FormData(shopifyFormEl);

      return fetch(shopifyFormEl.action, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
        headers: { Accept: 'text/html' }
      }).then(function (res) {
        if (res.ok || res.redirected) {
          return { ok: true };
        }
        return res.text().then(function (html) {
          if (html.indexOf('class="errors"') !== -1 || html.indexOf('form__message--error') !== -1) {
            throw new Error('Could not save your details to our customer list. Please try again.');
          }
          return { ok: true };
        });
      });
    }

    function buildSheetUrl(params) {
      var url = new URL(webhook);
      Object.keys(params).forEach(function (key) {
        var value = params[key];
        if (value !== undefined && value !== null && String(value).length) {
          url.searchParams.set(key, String(value));
        }
      });
      return url.toString();
    }

    function submitGoogleSheet(payload) {
      // GET avoids CORS preflight — Google Apps Script web apps block POST JSON from browsers.
      return fetch(buildSheetUrl(payload), { method: 'GET', credentials: 'omit' })
        .then(function (res) {
          return parseWebhookJson(res).then(function (data) {
            if (!data || !data.success) {
              throw new Error((data && data.error) || 'Submission failed. Please try again.');
            }
            return data;
          });
        });
    }

    function syncCtaLabels() {
      var label = submitBtn.textContent;
      if (stickyBtn) stickyBtn.textContent = label;
    }

    function setStickyVisible(show) {
      if (!stickyCta || !mobileMq.matches) return;
      if (root.classList.contains('is-form-complete')) {
        stickyCta.hidden = true;
        return;
      }
      stickyCta.hidden = !show;
    }

    function setCtaInView(inView) {
      if (inView) {
        root.classList.add('is-cta-in-view');
      } else {
        root.classList.remove('is-cta-in-view');
      }
      if (!mobileMq.matches) return;
      setStickyVisible(!inView && !root.classList.contains('is-form-complete'));
    }

    function updateStickyOffset() {
      var header =
        document.querySelector('.shopify-section-header') ||
        document.querySelector('header.header');
      var announce = document.querySelector('.announcement-bar-section');
      var top = 0;
      if (announce) top += announce.offsetHeight;
      if (header) top += header.offsetHeight;
      if (!top) top = 75;
      root.style.setProperty('--mpr-sticky-top', top + 'px');
    }

    function scrollToForm() {
      if (!submitAnchor) return;
      setCtaInView(true);
      submitAnchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function connectStickyObserver() {
      if (!submitAnchor) return;
      if (stickyObserver) stickyObserver.disconnect();

      var barPx =
        parseInt(getComputedStyle(root).getPropertyValue('--mpr-sticky-bar'), 10) || 70;

      stickyObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            setCtaInView(entry.isIntersecting);
          });
        },
        {
          root: null,
          threshold: 0.4,
          rootMargin: '-38% 0px -' + barPx + 'px 0px'
        }
      );

      stickyObserver.observe(submitAnchor);
    }

    function setupStickyCta() {
      if (!stickyCta || !submitAnchor || !stickyBtn) return;

      updateStickyOffset();
      connectStickyObserver();

      window.addEventListener('resize', function () {
        updateStickyOffset();
        connectStickyObserver();
      });

      stickyBtn.addEventListener('click', function () {
        scrollToForm();
      });

      mobileMq.addEventListener('change', function () {
        if (!mobileMq.matches) {
          stickyCta.hidden = true;
          root.classList.remove('is-cta-in-view');
        } else {
          updateStickyOffset();
          connectStickyObserver();
          setStickyVisible(!root.classList.contains('is-cta-in-view'));
        }
      });

      if (mobileMq.matches) {
        setStickyVisible(true);
      } else {
        stickyCta.hidden = true;
      }
    }

    function setMode(mode) {
      var isWaitlist = mode === 'waitlist';
      if (modeInput) modeInput.value = mode;
      root.dataset.mode = mode;

      if (isWaitlist) {
        root.classList.add('is-waitlist');
        if (waitlistBanner) waitlistBanner.hidden = false;
        if (waitlistBannerText && root.dataset.seatsFilledMessage) {
          waitlistBannerText.textContent = root.dataset.seatsFilledMessage;
        }
        submitBtn.textContent = root.dataset.ctaWaitlist || 'JOIN THE WAITLIST';
        submitBtn.classList.add('mpr-submit--waitlist');
        if (stickyBtn) stickyBtn.classList.add('mpr-submit--waitlist');
      } else {
        root.classList.remove('is-waitlist');
        if (waitlistBanner) waitlistBanner.hidden = true;
        submitBtn.textContent = root.dataset.ctaRsvp || 'RSVP';
        submitBtn.classList.remove('mpr-submit--waitlist');
        if (stickyBtn) stickyBtn.classList.remove('mpr-submit--waitlist');
      }

      submitBtn.disabled = false;
      if (stickyBtn) stickyBtn.disabled = false;
      syncCtaLabels();
    }

    function showError(message) {
      if (!errorEl) return;
      errorEl.hidden = false;
      errorEl.textContent = message;
      if (successEl) successEl.hidden = true;
    }

    function showSuccess(message) {
      if (!successEl) return;
      successEl.hidden = false;
      successEl.textContent = message;
      if (errorEl) errorEl.hidden = true;
      if (formFields) formFields.hidden = true;
      if (waitlistBanner) waitlistBanner.hidden = true;
      submitBtn.hidden = true;
      root.classList.add('is-form-complete');
      setStickyVisible(false);
    }

    function buildCountUrl() {
      return buildSheetUrl({
        action: 'count',
        cap: cap,
        sheet: sheetTab,
        form_id: formId,
        page_handle: formId
      });
    }

    function refreshCapacity() {
      if (!webhook) {
        logEntries('—');
        setMode('rsvp');
        return Promise.resolve(null);
      }

      return fetch(buildCountUrl(), { method: 'GET', credentials: 'omit' })
        .then(function (res) {
          return parseWebhookJson(res);
        })
        .then(function (data) {
          var count = readCount(data);
          if (count === null) {
            throw new Error((data && data.error) || 'Could not read entry count');
          }
          logEntries(count);
          setMode(count >= cap ? 'waitlist' : 'rsvp');
          return count;
        })
        .catch(function (err) {
          console.warn(RSVP_LOG_PREFIX + ' count failed:', err && err.message ? err.message : err);
          logEntries('—');
          setMode('rsvp');
          return null;
        });
    }

    function resetSubmitState(originalLabel) {
      form.dataset.submitting = 'false';
      submitBtn.disabled = false;
      if (stickyBtn) stickyBtn.disabled = false;
      submitBtn.classList.remove('mpr-submit--submitting');
      submitBtn.textContent = originalLabel;
      syncCtaLabels();
    }

    setupStickyCta();
    refreshCapacity();

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (form.dataset.submitting === 'true') return;

      var nameInput = form.querySelector('[name="name"]');
      var emailInput = form.querySelector('[name="email"]');
      var phoneInput = form.querySelector('[name="phone"]');

      var name = nameInput && nameInput.value.trim();
      var email = emailInput && emailInput.value.trim();
      var phone = phoneInput && phoneInput.value.trim();
      var isWaitlist = modeInput && modeInput.value === 'waitlist';

      if (!name || !email || !phone) {
        showError('Please fill in name, email, and phone.');
        scrollToForm();
        return;
      }

      if (!isValidPhone(phone)) {
        showError('Please enter a valid 10-digit phone number.');
        scrollToForm();
        return;
      }

      if (!webhook) {
        showError(
          'RSVP is not connected yet. Add your Google Sheet webhook URL in the theme editor.'
        );
        return;
      }

      if (!shopifyFormEl) {
        showError('Customer signup form is not available. Please refresh the page and try again.');
        return;
      }

      form.dataset.submitting = 'true';
      submitBtn.disabled = true;
      if (stickyBtn) stickyBtn.disabled = true;
      submitBtn.classList.add('mpr-submit--submitting');
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'SUBMITTING...';
      syncCtaLabels();
      if (errorEl) errorEl.hidden = true;

      syncShopifyCustomerFields(name, email, phone, isWaitlist);

      var payload = {
        name: name,
        email: email,
        phone: normalizePhone(phone),
        type: isWaitlist ? 'waitlist' : 'rsvp',
        cap: cap,
        sheet: sheetTab,
        form_id: formId,
        page_handle: formId,
        event_tag: eventTag,
        page_url: window.location.href,
        submitted_at: new Date().toISOString()
      };

      submitGoogleSheet(payload)
        .then(function (data) {
          return submitShopifyCustomer().then(function () {
            return data;
          });
        })
        .then(function (data) {
          var newCount = readCount(data);
          if (newCount !== null) logEntries(newCount);
          var submittedWaitlist =
            data.status === 'Waitlisted' || data.type === 'waitlist';
          var successCopy = submittedWaitlist
            ? root.dataset.successWaitlist
            : root.dataset.successRsvp;
          var statusNote = submittedWaitlist ? ' (Waitlisted)' : ' (Confirmed)';
          showSuccess((successCopy || 'Thank you! We have received your details.') + statusNote);
          setMode(submittedWaitlist ? 'waitlist' : 'rsvp');
        })
        .catch(function (err) {
          showError(err.message || 'Something went wrong. Please try again.');
          resetSubmitState(originalLabel);
        });
    });
  }

  function bootPrelaunchRsvp() {
    var roots = document.querySelectorAll('[data-mokae-prelaunch-rsvp]');
    if (!roots.length) {
      console.warn(RSVP_LOG_PREFIX + ' section not found on this page');
      return;
    }
    roots.forEach(initPrelaunchRsvp);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPrelaunchRsvp);
  } else {
    bootPrelaunchRsvp();
  }
})();
