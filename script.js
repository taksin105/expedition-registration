// ========================================================
// JavaScript สำหรับแบบฟอร์มลงทะเบียน (เข้าใจง่าย โค้ดสั้นกระชับ)
// กิจกรรม: พัฒนาหน้าเว็บไซต์ ในฐานะ Programmer เพื่อลงทะเบียน
// ผู้พัฒนา: นายทักษิณ นิสภวาณิชย์ (รหัส 66040233105) สาขาเทคโนโลยีสารสนเทศ
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ดึง Element จากหน้าเว็บ
    const form = document.getElementById('regForm');
    const salaryInput = document.getElementById('salary');
    const salaryVal = document.getElementById('salaryVal');
    const btnClear = document.getElementById('btnClear');
    const successModal = document.getElementById('successModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const resultSummary = document.getElementById('resultSummary');

    // 1. ปรับตัวเลขเงินเดือนตามสไลเดอร์แบบไดนามิก
    salaryInput.addEventListener('input', () => {
        salaryVal.textContent = `$${Number(salaryInput.value).toLocaleString()}`;
    });

    // 2. ฟังก์ชันแสดงข้อความแจ้งเตือนข้อผิดพลาด (Error)
    function setError(id, message) {
        const errorEl = document.getElementById(id + 'Error');
        const inputEl = document.getElementById(id);
        if (errorEl) errorEl.textContent = message;
        if (inputEl) inputEl.classList.add('input-invalid');
    }

    // 3. ฟังก์ชันล้างข้อความแจ้งเตือน
    function clearErrors() {
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        document.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));
    }

    // ล้าง Error ทันทีเมื่อผู้ใช้เริ่มพิมพ์แก้ไข
    ['fullName', 'email', 'phone', 'dob'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                const errorEl = document.getElementById(id + 'Error');
                if (errorEl) errorEl.textContent = '';
                el.classList.remove('input-invalid');
            });
        }
    });

    // 4. เมื่อผู้ใช้กดปุ่ม "ยืนยันการลงทะเบียน (Submit)"
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;
        let firstError = null;

        // --- ตรวจสอบ 1: ชื่อ-นามสกุล ---
        const fullName = document.getElementById('fullName').value.trim();
        if (!fullName) {
            setError('fullName', 'กรุณากรอกชื่อ-นามสกุลของคุณ');
            isValid = false;
            firstError = firstError || document.getElementById('fullName');
        } else if (fullName.length < 2) {
            setError('fullName', 'ชื่อ-นามสกุลต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
            isValid = false;
            firstError = firstError || document.getElementById('fullName');
        }

        // --- ตรวจสอบ 2: อีเมล ---
        const email = document.getElementById('email').value.trim();
        if (!email) {
            setError('email', 'กรุณากรอกอีเมลสำหรับติดต่อ');
            isValid = false;
            firstError = firstError || document.getElementById('email');
        } else if (!email.includes('@') || !email.includes('.')) {
            setError('email', 'รูปแบบอีเมลไม่ถูกต้อง (ต้องมีเครื่องหมาย @ และชื่อโดเมน)');
            isValid = false;
            firstError = firstError || document.getElementById('email');
        }

        // --- ตรวจสอบ 3: เบอร์โทรศัพท์ [🐛 BUG #1 อยู่ตรงนี้] ---
        // ข้อกำหนด: ต้องเป็นเบอร์โทรศัพท์ที่เป็นตัวเลข 7 - 15 หลัก
        // จุดบกพร่องที่โปรแกรมเมอร์แอบทำไว้: เช็คแค่ความยาว แต่ "ลืมเช็คว่าเป็นตัวเลขหรือไม่"
        // ทำให้ Tester สามารถพิมพ์ตัวหนังสือ เช่น "abcdefg" หรือ "เบอร์โทร" แล้วผ่านได้!
        const phone = document.getElementById('phone').value.trim();
        if (!phone) {
            setError('phone', 'กรุณากรอกเบอร์โทรศัพท์ติดต่อ');
            isValid = false;
            firstError = firstError || document.getElementById('phone');
        } else if (phone.length < 7 || phone.length > 15) {
            setError('phone', 'เบอร์โทรศัพท์ต้องมีความยาวระหว่าง 7-15 ตัวอักษร');
            isValid = false;
            firstError = firstError || document.getElementById('phone');
        }
        // *หมายเหตุ: ไม่มีคำสั่งตรวจสอบตัวเลข เช่น isNaN หรือ regex ทำให้เกิด Bug #1

        // --- ตรวจสอบ 4: วันเกิด ---
        const dob = document.getElementById('dob').value;
        if (!dob) {
            setError('dob', 'กรุณาระบุวัน/เดือน/ปีเกิดของคุณ');
            isValid = false;
            firstError = firstError || document.getElementById('dob');
        }

        // --- ตรวจสอบ 5: บทบาทในทีม (Checkbox อย่างน้อย 1 ข้อ) ---
        const roles = document.querySelectorAll('input[name="role"]:checked');
        if (roles.length === 0) {
            setError('role', 'กรุณาเลือกตำแหน่งที่ต้องการในทีมอย่างน้อย 1 ตำแหน่ง');
            isValid = false;
            firstError = firstError || document.querySelector('.selection-grid');
        }

        // --- ตรวจสอบ 6: ภูมิภาค (Radio ต้องเลือก 1 ข้อ) ---
        const region = document.querySelector('input[name="region"]:checked');
        if (!region) {
            setError('region', 'กรุณาเลือกภูมิภาคที่ต้องการสำรวจ 1 แห่ง');
            isValid = false;
            firstError = firstError || document.querySelector('input[name="region"]');
        }

        // --- ตรวจสอบ 7: ไฟล์เอกสาร ---
        const idFile = document.getElementById('idFile');
        if (!idFile.files || idFile.files.length === 0) {
            setError('idFile', 'กรุณาแนบไฟล์สำเนาบัตรประชาชนหรือพาสปอร์ต');
            isValid = false;
            firstError = firstError || document.getElementById('idFile');
        } else {
            const file = idFile.files[0];
            if (file.size > 5 * 1024 * 1024) { // เกิน 5MB
                setError('idFile', 'ขนาดไฟล์เกินกำหนด (สูงสุดไม่เกิน 5 MB)');
                isValid = false;
                firstError = firstError || document.getElementById('idFile');
            }
        }

        // --- ตรวจสอบ 8: ยอมรับเงื่อนไข [🐛 BUG #2 อยู่ตรงนี้] ---
        // ข้อกำหนด: ผู้สมัครต้องติ๊กถูกยอมรับข้อตกลงและเงื่อนไขก่อนส่งใบสมัครเสมอ
        // จุดบกพร่องที่โปรแกรมเมอร์แอบทำไว้: โปรแกรมเมอร์ "ลืมเขียนโค้ดตรวจสอบเงื่อนไข terms.checked"
        // ทำให้แม้ไม่ได้ติ๊กถูก ระบบก็อนุญาตให้ส่งข้อมูลได้เลย!
        /*
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            setError('terms', 'คุณต้องยอมรับข้อตกลงและเงื่อนไขก่อนลงทะเบียน');
            isValid = false;
        }
        */

        // สรุปผลการตรวจสอบ
        if (!isValid) {
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // หากข้อมูลผ่านทั้งหมด แสดงข้อมูลสรุปใน Modal
        const selectedRoles = Array.from(roles).map(r => r.value).join(', ');
        resultSummary.innerHTML = `
            <p><strong>ชื่อผู้สมัคร:</strong> ${escapeHtml(fullName)}</p>
            <p><strong>อีเมล:</strong> ${escapeHtml(email)}</p>
            <p><strong>เบอร์โทร:</strong> ${escapeHtml(phone)}</p>
            <p><strong>วันเกิด:</strong> ${escapeHtml(dob)}</p>
            <p><strong>ตำแหน่ง:</strong> ${escapeHtml(selectedRoles)}</p>
            <p><strong>ภูมิภาค:</strong> ${escapeHtml(region.value)}</p>
            <p><strong>ค่าตอบแทน:</strong> $${Number(salaryInput.value).toLocaleString()} / สัปดาห์</p>
        `;
        successModal.classList.remove('hidden');
        form.reset();
        salaryVal.textContent = '$700';
    });

    // 5. ปุ่มล้างข้อมูล (Clear Form)
    btnClear.addEventListener('click', () => {
        form.reset();
        clearErrors();
        salaryVal.textContent = '$700';
    });

    // 6. ปิดหน้าต่าง Modal สำเร็จ
    btnCloseModal.addEventListener('click', () => {
        successModal.classList.add('hidden');
    });

    // ฟังก์ชันป้องกัน XSS
    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

});
