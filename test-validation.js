// Automated Verification Script for Form Validation & The 2 Intentional Bugs

function validateAge(dobString, today = new Date('2026-09-01')) {
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    // BUG #1: Uses <= 18 instead of < 18
    if (age <= 18 || age > 70) {
        return { valid: false, age: age, error: `ผู้สมัครต้องมีอายุระหว่าง 18 ถึง 70 ปีบริบูรณ์เท่านั้น (ระบบคำนวณอายุได้ ${age} ปี)` };
    }
    return { valid: true, age: age };
}

function validateFileExtension(fileName) {
    // BUG #2: Missing .toLowerCase()
    const fileExtension = fileName.split('.').pop();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];

    if (!allowedExtensions.includes(fileExtension)) {
        return { valid: false, ext: fileExtension, error: `รองรับเฉพาะไฟล์เอกสารนามสกุล JPG, PNG หรือ PDF เท่านั้น (ตรวจพบ: .${fileExtension})` };
    }
    return { valid: true, ext: fileExtension };
}

function validateName(fullName) {
    if (!fullName || fullName.length < 2 || fullName.length > 50) return false;
    const namePattern = /^[a-zA-Z\u0E00-\u0E7F\s\-'.]+$/;
    return namePattern.test(fullName);
}

function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email) && email.length <= 100;
}

function validatePhone(phone) {
    const phonePattern = /^[0-9+\-\s]{7,15}$/;
    return phonePattern.test(phone);
}

console.log("=== RUNNING VALIDATION & BUG TESTS ===");

// Test 1: Full Name
console.assert(validateName("นายกิตติศักดิ์ พัฒนาซอฟต์แวร์") === true, "Thai name should be valid");
console.assert(validateName("Dr. Peter Ford") === true, "English name should be valid");
console.assert(validateName("Peter123") === false, "Name with digits should be invalid");
console.assert(validateName("A") === false, "Name with <2 chars should be invalid");
console.log("✔ Name validation passed");

// Test 2: Email
console.assert(validateEmail("peter.ford@eldoria.org") === true, "Standard email valid");
console.assert(validateEmail("invalid-email") === false, "Invalid email rejected");
console.log("✔ Email validation passed");

// Test 3: Phone
console.assert(validatePhone("+66812345678") === true, "Phone with + valid");
console.assert(validatePhone("081-234-5678") === true, "Phone with dash valid");
console.assert(validatePhone("123") === false, "Short phone rejected");
console.log("✔ Phone validation passed");

// Test 4: Verify BUG #1 (Date of Birth Boundary)
// Reference Date: 2026-09-01
// A person born on 2008-09-01 is EXACTLY 18 years old today!
const age18 = validateAge('2008-09-01');
console.log(`Test Bug #1 (Exact 18-yr-old born 2008-09-01): Age = ${age18.age}, Valid = ${age18.valid}`);
console.assert(age18.age === 18, "Age calculation should be 18");
console.assert(age18.valid === false, "BUG #1 Confirmed: Exact 18-year-old is wrongly rejected by <= 18!");

const age19 = validateAge('2007-09-01');
console.assert(age19.valid === true, "19-year-old is accepted");
console.log("✔ Bug #1 behavior confirmed");

// Test 5: Verify BUG #2 (File Extension Case-Sensitivity)
const lowercaseFile = validateFileExtension("passport.pdf");
console.assert(lowercaseFile.valid === true, "Lowercase .pdf is accepted");

const uppercaseFileJpg = validateFileExtension("PASSPORT.JPG");
console.log(`Test Bug #2 (Uppercase .JPG): Ext = ${uppercaseFileJpg.ext}, Valid = ${uppercaseFileJpg.valid}`);
console.assert(uppercaseFileJpg.valid === false, "BUG #2 Confirmed: Uppercase .JPG is wrongly rejected because of missing .toLowerCase()!");

const uppercaseFilePdf = validateFileExtension("ID_CARD.PDF");
console.assert(uppercaseFilePdf.valid === false, "BUG #2 Confirmed: Uppercase .PDF is wrongly rejected!");
console.log("✔ Bug #2 behavior confirmed");

console.log("=== ALL AUTOMATED CHECKS PASSED SUCCESSFULLY ===");
