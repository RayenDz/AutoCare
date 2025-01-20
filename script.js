document.getElementById('maintenanceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // الحصول على القيم من النموذج
    const carName = document.getElementById('carName').value;
    const maintenanceType = document.getElementById('maintenanceType').value;
    const maintenanceDate = document.getElementById('maintenanceDate').value;
    const nextMaintenanceDate = document.getElementById('nextMaintenanceDate').value;
    const distanceDriven = parseInt(document.getElementById('distanceDriven').value);
    const oilChangeDistance = parseInt(document.getElementById('oilChangeDistance').value);
    const notes = document.getElementById('notes').value;

    // التحقق من صحة البيانات المدخلة
    if (isNaN(distanceDriven) || isNaN(oilChangeDistance)) {
        alert("يرجى إدخال قيم صحيحة للمسافة المقطوعة ومسافة تغيير الفيدونج.");
        return;
    }

    // حساب المسافة المتبقية
    const remainingDistance = oilChangeDistance + distanceDriven;

    // إنشاء صف جديد في الجدول
    const tableBody = document.querySelector('#maintenanceTable tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td data-label="اسم السيارة">${carName}</td>
        <td data-label="نوع الصيانة">${maintenanceType}</td>
        <td data-label="تاريخ الصيانة">${maintenanceDate}</td>
        <td data-label="تاريخ الصيانة القادمة">${nextMaintenanceDate}</td>
        <td data-label="المسافة المقطوعة (كم)">${distanceDriven}</td>
        <td data-label=" (كم) مسافة الفيدونج">${oilChangeDistance}</td>
        <td data-label="مسافة تغيير الزيت (كم)">${remainingDistance}</td>
        <td data-label="ملاحظات">${notes}</td>
    `;

    tableBody.appendChild(newRow);

    // مسح النموذج بعد الإضافة
    document.getElementById('maintenanceForm').reset();
});
document.getElementById('maintenanceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // الحصول على القيم من النموذج
    const carName = document.getElementById('carName').value;
    const maintenanceType = document.getElementById('maintenanceType').value;
    const maintenanceDate = document.getElementById('maintenanceDate').value;
    const nextMaintenanceDate = document.getElementById('nextMaintenanceDate').value;
    const distanceDriven = parseInt(document.getElementById('distanceDriven').value);
    const oilChangeDistance = parseInt(document.getElementById('oilChangeDistance').value);
    const oilFilter = document.querySelector('input[name="oilFilter"]:checked').value;
    const airFilter = document.querySelector('input[name="airFilter"]:checked').value;
    const notes = document.getElementById('notes').value;

    // حساب المسافة المتبقية
    const remainingDistance = oilChangeDistance - distanceDriven;

    // إنشاء صف جديد في الجدول
    const tableBody = document.querySelector('#maintenanceTable tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td data-label="اسم السيارة">${carName}</td>
        <td data-label="نوع الصيانة">${maintenanceType}</td>
        <td data-label="تاريخ الصيانة">${maintenanceDate}</td>
        <td data-label="تاريخ الصيانة القادمة">${nextMaintenanceDate}</td>
        <td data-label="المسافة المقطوعة (كم)">${distanceDriven}</td>
        <td data-label="مسافة تغيير الفيدونج (كم)">${oilChangeDistance}</td>
        <td data-label="المسافة المتبقية (كم)">${remainingDistance}</td>
        <td data-label="فلتر الزيت">${oilFilter}</td>
        <td data-label="فلتر الهواء">${airFilter}</td>
        <td data-label="ملاحظات">${notes}</td>
    `;

    tableBody.appendChild(newRow);

    // مسح النموذج بعد الإضافة
    document.getElementById('maintenanceForm').reset();
});
// دالة لحفظ البيانات في localStorage
function saveDataToLocalStorage(data) {
    let records = JSON.parse(localStorage.getItem('maintenanceRecords')) || [];
    records.push(data);
    localStorage.setItem('maintenanceRecords', JSON.stringify(records));
}

// دالة لتحميل البيانات من localStorage
function loadDataFromLocalStorage() {
    const records = JSON.parse(localStorage.getItem('maintenanceRecords')) || [];
    const tableBody = document.querySelector('#maintenanceTable tbody');
    tableBody.innerHTML = ''; // مسح الجدول قبل التحميل

    records.forEach(record => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td data-label="اسم السيارة">${record.carName}</td>
            <td data-label="نوع الصيانة">${record.maintenanceType}</td>
            <td data-label="تاريخ الصيانة">${record.maintenanceDate}</td>
            <td data-label="تاريخ الصيانة القادمة">${record.nextMaintenanceDate}</td>
            <td data-label="المسافة المقطوعة (كم)">${record.distanceDriven}</td>
            <td data-label="مسافة تغيير الفيدونج (كم)">${record.oilChangeDistance}</td>
            <td data-label="المسافة المتبقية (كم)">${record.remainingDistance}</td>
            <td data-label="فلتر الزيت">${record.oilFilter}</td>
            <td data-label="فلتر الهواء">${record.airFilter}</td>
            <td data-label="ملاحظات">${record.notes}</td>
        `;
        tableBody.appendChild(newRow);
    });
}

// دالة لحذف البيانات من localStorage
function clearLocalStorage() {
    localStorage.removeItem('maintenanceRecords');
    alert('تم حذف جميع البيانات!');
    loadDataFromLocalStorage(); // إعادة تحميل الجدول بعد الحذف
}

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadDataFromLocalStorage);

// إضافة بيانات جديدة عند تقديم النموذج
document.getElementById('maintenanceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // الحصول على القيم من النموذج
    const carName = document.getElementById('carName').value;
    const maintenanceType = document.getElementById('maintenanceType').value;
    const maintenanceDate = document.getElementById('maintenanceDate').value;
    const nextMaintenanceDate = document.getElementById('nextMaintenanceDate').value;
    const distanceDriven = parseInt(document.getElementById('distanceDriven').value);
    const oilChangeDistance = parseInt(document.getElementById('oilChangeDistance').value);
    const oilFilter = document.querySelector('input[name="oilFilter"]:checked').value;
    const airFilter = document.querySelector('input[name="airFilter"]:checked').value;
    const notes = document.getElementById('notes').value;

    // حساب المسافة المتبقية
    const remainingDistance = oilChangeDistance - distanceDriven;

    // إنشاء كائن للبيانات
    const record = {
        carName,
        maintenanceType,
        maintenanceDate,
        nextMaintenanceDate,
        distanceDriven,
        oilChangeDistance,
        remainingDistance,
        oilFilter,
        airFilter,
        notes
    };

    // حفظ البيانات في localStorage
    saveDataToLocalStorage(record);

    // إضافة الصف إلى الجدول
    const tableBody = document.querySelector('#maintenanceTable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td data-label="اسم السيارة">${carName}</td>
        <td data-label="نوع الصيانة">${maintenanceType}</td>
        <td data-label="تاريخ الصيانة">${maintenanceDate}</td>
        <td data-label="تاريخ الصيانة القادمة">${nextMaintenanceDate}</td>
        <td data-label="المسافة المقطوعة (كم)">${distanceDriven}</td>
        <td data-label="مسافة تغيير الفيدونج (كم)">${oilChangeDistance}</td>
        <td data-label="المسافة المتبقية (كم)">${remainingDistance}</td>
        <td data-label="فلتر الزيت">${oilFilter}</td>
        <td data-label="فلتر الهواء">${airFilter}</td>
        <td data-label="ملاحظات">${notes}</td>
    `;
    tableBody.appendChild(newRow);

    // مسح النموذج بعد الإضافة
    document.getElementById('maintenanceForm').reset();
});

// إضافة زر لحذف البيانات
const clearButton = document.createElement('button');
clearButton.textContent = 'حذف جميع البيانات';
clearButton.classList.add('clear-button');
clearButton.addEventListener('click', clearLocalStorage);
document.querySelector('.container').appendChild(clearButton);