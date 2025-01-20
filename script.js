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

    document.getElementById('maintenanceForm').reset();
});
