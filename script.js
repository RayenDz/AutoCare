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
    tableBody.innerHTML = '';

    records.forEach((record, index) => {
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
            <td data-label="حذف"><i class="fas fa-trash delete-icon" data-index="${index}"></i></td> <!-- أيقونة الحذف -->
        `;
        tableBody.appendChild(newRow);
    });

    // إضافة حدث النقر لأيقونات الحذف
    document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', deleteRecord);
    });
}

// دالة لحذف سجل
function deleteRecord(event) {
    const index = event.target.getAttribute('data-index'); // الحصول على الفهرس من السجل
    let records = JSON.parse(localStorage.getItem('maintenanceRecords')) || [];
    
    // حذف السجل من المصفوفة
    records.splice(index, 1);
    
    // حفظ المصفوفة المحدثة في localStorage
    localStorage.setItem('maintenanceRecords', JSON.stringify(records));
    
    // إعادة تحميل الجدول
    loadDataFromLocalStorage();
}

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadDataFromLocalStorage);

// إضافة بيانات جديدة عند تقديم النموذج
document.getElementById('maintenanceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const carName = document.getElementById('carName').value;
    const maintenanceType = document.getElementById('maintenanceType').value;
    const maintenanceDate = document.getElementById('maintenanceDate').value;
    const nextMaintenanceDate = document.getElementById('nextMaintenanceDate').value;
    const distanceDriven = parseInt(document.getElementById('distanceDriven').value);
    const oilChangeDistance = parseInt(document.getElementById('oilChangeDistance').value);
    const oilFilter = document.querySelector('input[name="oilFilter"]:checked').value;
    const airFilter = document.querySelector('input[name="airFilter"]:checked').value;
    const notes = document.getElementById('notes').value;

    const remainingDistance = oilChangeDistance + distanceDriven;

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

    saveDataToLocalStorage(record);
    loadDataFromLocalStorage(); // إعادة تحميل الجدول بعد الإضافة
    document.getElementById('maintenanceForm').reset();
});
