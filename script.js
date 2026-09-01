/**
 * =========================================================================
 * EXPEDITION TO ELDORIA - REGISTRATION LOGIC & QA BUG SUITE
 * กิจกรรม: "พัฒนาหน้าเว็บไซต์_ในฐานะ Programmer เพื่อลงทะเบียน"
 * ผู้พัฒนา: นายทักษิณ นิสภวาณิชย์ (รหัส 66040233105) สาขา IT
 * 
 * ธีม: Modern Glassmorphism & Adventure Theme
 * 🐛 ซ่อน Bug 2 จุด:
 *    - Bug #1: Contact Number - ตรวจเฉพาะความยาว แต่ลืมตรวจว่าเป็นตัวเลข
 *    - Bug #2: Terms & Conditions - ส่งฟอร์มได้แม้ไม่ได้ติ๊กยอมรับเงื่อนไข
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Elements Cache
    const form = document.getElementById('expeditionForm');
    const salaryRange = document.getElementById('salaryRange');
    const salaryDisplay = document.getElementById('salaryDisplay');
    const commentsInput = document.getElementById('comments');
    const charCounter = document.getElementById('charCounter');
    
    // File Upload Elements
    const fileDropZone = document.getElementById('fileDropZone');
    const passportFileInput = document.getElementById('passportFile');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const filePreviewCard = document.getElementById('filePreviewCard');
    const previewFileName = document.getElementById('previewFileName');
    const previewFileSize = document.getElementById('previewFileSize');
    const btnRemoveFile = document.getElementById('btnRemoveFile');
    let currentSelectedFile = null;

    // Student Profile Elements
    const displayStudentName = document.getElementById('displayStudentName');
    const displayStudentId = document.getElementById('displayStudentId');
    const footerStudentName = document.getElementById('footerStudentName');
    const footerStudentId = document.getElementById('footerStudentId');
    const btnEditProfile = document.getElementById('btnEditProfile');
    const profileEditModal = document.getElementById('profileEditModal');
    const btnCloseProfileModal = document.getElementById('btnCloseProfileModal');
    const btnSaveProfile = document.getElementById('btnSaveProfile');
    const inputStudentName = document.getElementById('inputStudentName');
    const inputStudentId = document.getElementById('inputStudentId');

    // Terms Modal Elements
    const openTermsModal = document.getElementById('openTermsModal');
    const termsModal = document.getElementById('termsModal');
    const btnCloseTermsModal = document.getElementById('btnCloseTermsModal');
    const btnAcceptTermsFromModal = document.getElementById('btnAcceptTermsFromModal');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');

    // Success Modal Elements
    const successModal = document.getElementById('successModal');
    const btnCloseSuccessModal = document.getElementById('btnCloseSuccessModal');
    const submissionSummary = document.getElementById('submissionSummary');

    // QA Debugger Elements
    const toggleQaPanel = document.getElementById('toggleQaPanel');
    const qaContent = document.getElementById('qaContent');
    const qaChevron = document.getElementById('qaChevron');

    // Action Buttons
    const btnClearForm = document.getElementById('btnClearForm');

    // ========================================================
    // 3. Load & Save Student Profile (ภาษาไทย)
    // ========================================================
    function loadSavedProfile() {
        const savedName = localStorage.getItem('eldoria_student_name') || 'นายทักษิณ นิสภวาณิชย์';
        const savedId = localStorage.getItem('eldoria_student_id') || '66040233105';

        displayStudentName.textContent = savedName;
        displayStudentId.textContent = savedId;
        footerStudentName.textContent = savedName;
        footerStudentId.textContent = savedId;

        inputStudentName.value = savedName;
        inputStudentId.value = savedId;
    }
    loadSavedProfile();

    btnEditProfile.addEventListener('click', () => {
        inputStudentName.value = displayStudentName.textContent.trim();
        inputStudentId.value = displayStudentId.textContent.trim();
        profileEditModal.classList.remove('hidden');
    });

    btnCloseProfileModal.addEventListener('click', () => {
        profileEditModal.classList.add('hidden');
    });

    btnSaveProfile.addEventListener('click', () => {
        const newName = inputStudentName.value.trim();
        const newId = inputStudentId.value.trim();

        if (!newName || !newId) {
            showToast('กรุณากรอกชื่อ-สกุล และรหัสนักศึกษาให้ครบถ้วน', 'error');
            return;
        }

        localStorage.setItem('eldoria_student_name', newName);
        localStorage.setItem('eldoria_student_id', newId);

        displayStudentName.textContent = newName;
        displayStudentId.textContent = newId;
        footerStudentName.textContent = newName;
        footerStudentId.textContent = newId;

        profileEditModal.classList.add('hidden');
        showToast('อัปเดตข้อมูลนักศึกษาเรียบร้อยแล้ว', 'success');
    });

    // ========================================================
    // 4. Interactive Salary Slider
    // ========================================================
    salaryRange.addEventListener('input', (e) => {
        salaryDisplay.textContent = `$${Number(e.target.value).toLocaleString()}`;
    });

    // ========================================================
    // 5. Comments Character Counter
    // ========================================================
    commentsInput.addEventListener('input', () => {
        const currentLength = commentsInput.value.length;
        charCounter.textContent = `${currentLength} / 1000 ตัวอักษร`;
        if (currentLength >= 1000) {
            charCounter.style.color = 'var(--danger)';
        } else {
            charCounter.style.color = 'var(--text-hint)';
        }
    });

    // ========================================================
    // 6. Drag & Drop File Upload Handler
    // ========================================================
    passportFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    });

    fileDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileDropZone.classList.add('dragover');
    });

    fileDropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileDropZone.classList.remove('dragover');
    });

    fileDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileDropZone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    function handleFileSelect(file) {
        currentSelectedFile = file;
        previewFileName.textContent = file.name;
        previewFileSize.textContent = formatBytes(file.size);

        uploadPlaceholder.classList.add('hidden');
        filePreviewCard.classList.remove('hidden');
        clearError('passportFile');
    }

    btnRemoveFile.addEventListener('click', (e) => {
        e.stopPropagation();
        currentSelectedFile = null;
        passportFileInput.value = '';
        uploadPlaceholder.classList.remove('hidden');
        filePreviewCard.classList.add('hidden');
    });

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // ========================================================
    // 7. Terms & Conditions Modal
    // ========================================================
    openTermsModal.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.classList.remove('hidden');
    });

    btnCloseTermsModal.addEventListener('click', () => {
        termsModal.classList.add('hidden');
    });

    btnAcceptTermsFromModal.addEventListener('click', () => {
        agreeTermsCheckbox.checked = true;
        clearError('agreeTerms');
        termsModal.classList.add('hidden');
        showToast('ยอมรับข้อตกลงและเงื่อนไขเรียบร้อยแล้ว', 'info');
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === termsModal) termsModal.classList.add('hidden');
        if (e.target === profileEditModal) profileEditModal.classList.add('hidden');
        if (e.target === successModal) successModal.classList.add('hidden');
    });

    // ========================================================
    // 8. QA Debugger Collapsible Panel
    // ========================================================
    toggleQaPanel.addEventListener('click', () => {
        const isCollapsed = qaContent.classList.toggle('collapsed');
        qaChevron.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)';
        const toggleText = toggleQaPanel.querySelector('.toggle-text');
        if (toggleText) {
            toggleText.textContent = isCollapsed ? 'คลิกเพื่อดูเฉลย' : 'คลิกเพื่อซ่อน';
        }
    });

    // ========================================================
    // 9. Error Management Helpers
    // ========================================================
    function setError(fieldId, message) {
        const errorEl = document.getElementById(`${fieldId}Error`);
        const inputEl = document.getElementById(fieldId);
        
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('active');
        }

        if (inputEl) {
            inputEl.classList.add('input-error');
        }
    }

    function clearError(fieldId) {
        const errorEl = document.getElementById(`${fieldId}Error`);
        const inputEl = document.getElementById(fieldId);

        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('active');
        }

        if (inputEl) {
            inputEl.classList.remove('input-error');
        }
    }

    function clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.classList.remove('active');
        });
        document.querySelectorAll('.input-error').forEach(el => {
            el.classList.remove('input-error');
        });
    }

    // Attach real-time input error clearance
    ['fullName', 'email', 'contactNumber', 'dob'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => clearError(id));
        }
    });

    // ========================================================
    // 10. Form Validation & THE 2 HIDDEN BUGS
    // ========================================================
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAllErrors();

        let isValid = true;
        let firstErrorElement = null;

        // ----------------------------------------------------
        // Field 1: Full Name
        // ----------------------------------------------------
        const fullName = document.getElementById('fullName').value.trim();
        if (!fullName) {
            setError('fullName', 'กรุณากรอกชื่อ-นามสกุลของคุณ');
            isValid = false;
            firstErrorElement = firstErrorElement || document.getElementById('fullName');
        } else if (fullName.length < 2 || fullName.length > 50) {
            setError('fullName', 'ความยาวชื่อ-นามสกุลต้องอยู่ระหว่าง 2 ถึง 50 ตัวอักษร');
            isValid = false;
            firstErrorElement = firstErrorElement || document.getElementById('fullName');
        }

        // ----------------------------------------------------
        // Field 2: Email
        // ----------------------------------------------------
        const email = document.getElementById('email').value.trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            setError('email', 'กรุณากรอกอีเมลสำหรับติดต่อ');
            isValid = false;
            firstErrorElement = firstErrorElement || document.getElementById('email');
        } else if (email.length > 100) {
            setError('email', 'อีเมลต้องมีความยาวไม่เกิน 100 ตัวอักษร');
            isValid = false;
            firstErrorElement = firstErrorElement || document.getElementById('email');
        } else if (!emailPattern.test(email)) {
            setError('email', 'รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: user@example.com)');
            isValid = false;
            firstErrorElement = firstErrorElement || document.getElementById('email');
        }

        // ----------------------------------------------------
        // Field 3: Contact Number & 🐛 BUG #1 (ยอมรับตัวอักษร)
        // ข้อกำหนด: ต้องเป็นเบอร์โทรศัพท์ 7 - 15 หลัก
        // จุดบกพร่อง: เช็คเฉพาะความยาว แต่ลืมตรวจว่าเป็นตัวเลข ทำให้ใส่ตัวหนังสือแล้วผ่าน!
        // ----------------------------------------------------
        const contactNumber = document.getElementById('contactNumber').value.trim();
        if (!contactNumber) {
            setError('contactNumber', 'กรุณากรอกเบอร์โทรศัพท์ติดต่อ');
            isValid = false;
            firstErrorElement = firstErrorElement || document.getElementById('contactNumber');
        } else if (contactNumber.length < 7 || contactNumber.length > 15) {
            setError('contactNumber', 'เบอร์โทรศัพท์ต้องมีความยาวระหว่าง 7 - 15 ตัวอักษร');
            isValid = false;
            firstErrorElement = firstErrorElement || document.getElementById('contactNumber');
        }
        // *จงใจลืมใส่ regex /^[0-9+\-\s]+$/ เพื่อให้เป็น Bug #1

        // ----------------------------------------------------
        // Field 4: Date of Birth
        // ----------------------------------------------------
        const dobValue = document.getElementById('dob').value;
        if (!dobValue) {
            setError('dob', 'กรุณาระบุวัน/เดือน/ปีเกิด');
            isValid = false;
            firstErrorElement = firstErrorElement || document.getElementById('dob');
        }

        // ----------------------------------------------------
        // Field 5: Experience (Dropdown)
        // ----------------------------------------------------
        const experience = document.getElementById('experience').value;
        if (!experience) {
            setError('experience', 'กรุณาเลือกประสบการณ์ด้านโบราณคดี');
            isValid = false;
            firstErrorElement = firstErrorElement || document.getElementById('experience');
        }

        // ----------------------------------------------------
        // Field 6: Preferred Role (Checkboxes - At least 1 required)
        // ----------------------------------------------------
        const selectedRoles = Array.from(document.querySelectorAll('input[name="role"]:checked'));
        if (selectedRoles.length === 0) {
            setError('role', 'กรุณาเลือกบทบาทหน้าที่ในทีมสำรวจอย่างน้อย 1 ตำแหน่ง');
            isValid = false;
            firstErrorElement = firstErrorElement || document.querySelector('.checkbox-grid');
        } else {
            clearError('role');
        }

        // ----------------------------------------------------
        // Field 7: Preferred Region (Radio buttons - Required)
        // ----------------------------------------------------
        const selectedRegion = document.querySelector('input[name="region"]:checked');
        if (!selectedRegion) {
            setError('region', 'กรุณาเลือกภูมิภาคที่ประสงค์จะเข้าร่วมสำรวจ 1 แห่ง');
            isValid = false;
            firstErrorElement = firstErrorElement || document.querySelector('.radio-grid');
        } else {
            clearError('region');
        }

        // ----------------------------------------------------
        // Field 8: Passport/ID File Upload
        // ----------------------------------------------------
        if (!currentSelectedFile) {
            setError('passportFile', 'กรุณาอัปโหลดสำเนาหนังสือเดินทางหรือบัตรประชาชน');
            isValid = false;
            firstErrorElement = firstErrorElement || fileDropZone;
        } else {
            const maxSize = 5 * 1024 * 1024;
            if (currentSelectedFile.size > maxSize) {
                setError('passportFile', `ขนาดไฟล์เกินกำหนด (ไฟล์ของคุณ: ${formatBytes(currentSelectedFile.size)}, สูงสุด 5 MB)`);
                isValid = false;
                firstErrorElement = firstErrorElement || fileDropZone;
            }
        }

        // ----------------------------------------------------
        // Field 9: Terms & Conditions Checkbox & 🐛 BUG #2
        // ข้อกำหนด: ผู้สมัครต้องติ๊กยอมรับเงื่อนไขก่อนส่งใบสมัครเสมอ
        // จุดบกพร่อง: โปรแกรมเมอร์ลืมใส่การตรวจสอบ if (!agreeTermsCheckbox.checked)
        // ทำให้แม้ไม่ได้ติ๊ก ก็ส่งฟอร์มสำเร็จได้เลย!
        // ----------------------------------------------------
        /*
        if (!agreeTermsCheckbox.checked) {
            setError('agreeTerms', 'คุณต้องยอมรับข้อตกลงและเงื่อนไขก่อนดำเนินการต่อ');
            isValid = false;
            firstErrorElement = firstErrorElement || agreeTermsCheckbox;
        }
        */

        // ----------------------------------------------------
        // Result Handling
        // ----------------------------------------------------
        if (!isValid) {
            showToast('ข้อมูลในแบบฟอร์มยังไม่ถูกต้อง โปรดตรวจสอบจุดที่แจ้งเตือน', 'error');
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Success! Build Summary and Show Modal
        const roleLabels = selectedRoles.map(r => r.value).join(', ');
        const regionLabel = selectedRegion ? selectedRegion.value : '-';
        const contactMethod = document.getElementById('contactMethod').value;
        const emergencyContact = document.getElementById('emergencyContact').value.trim() || 'ไม่ได้ระบุ';

        submissionSummary.innerHTML = `
            <div class="summary-row">
                <span class="summary-label">ชื่อผู้สมัคร:</span>
                <span class="summary-value">${escapeHtml(fullName)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">อีเมล:</span>
                <span class="summary-value">${escapeHtml(email)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">เบอร์โทรศัพท์:</span>
                <span class="summary-value">${escapeHtml(contactNumber)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">วันเกิด:</span>
                <span class="summary-value">${escapeHtml(dobValue)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">ตำแหน่งที่เลือก:</span>
                <span class="summary-value">${escapeHtml(roleLabels)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">ภูมิภาคสำรวจ:</span>
                <span class="summary-value">${escapeHtml(regionLabel)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">ค่าตอบแทนต่อสัปดาห์:</span>
                <span class="summary-value">$${Number(salaryRange.value).toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">ช่องทางติดต่อสะดวก:</span>
                <span class="summary-value">${escapeHtml(contactMethod)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">เอกสารประจำตัว:</span>
                <span class="summary-value">${escapeHtml(currentSelectedFile.name)} (${formatBytes(currentSelectedFile.size)})</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">ผู้ติดต่อฉุกเฉิน:</span>
                <span class="summary-value">${escapeHtml(emergencyContact)}</span>
            </div>
        `;

        successModal.classList.remove('hidden');
        showToast('การลงทะเบียนสำเร็จ ข้อมูลของคุณได้รับการบันทึกแล้ว', 'success');

        resetFormInputs();
    });

    btnCloseSuccessModal.addEventListener('click', () => {
        successModal.classList.add('hidden');
    });

    // ========================================================
    // 11. Clear Form Handler
    // ========================================================
    btnClearForm.addEventListener('click', () => {
        resetFormInputs();
        showToast('ล้างข้อมูลในแบบฟอร์มเรียบร้อยแล้ว (Form Cleared)', 'info');
    });

    function resetFormInputs() {
        form.reset();
        currentSelectedFile = null;
        passportFileInput.value = '';
        uploadPlaceholder.classList.remove('hidden');
        filePreviewCard.classList.add('hidden');
        
        salaryRange.value = 700;
        salaryDisplay.textContent = '$700';
        charCounter.textContent = '0 / 1000 ตัวอักษร';
        charCounter.style.color = 'var(--text-hint)';
        
        clearAllErrors();
    }

    // ========================================================
    // 12. Toast Notification Helper
    // ========================================================
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle-2';
        if (type === 'error') iconName = 'alert-circle';

        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span>${escapeHtml(message)}</span>
        `;

        toastContainer.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3800);
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
});
