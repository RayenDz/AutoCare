document.addEventListener('DOMContentLoaded', function() {
  // تعبئة تاريخ اليوم كتاريخ افتراضي
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('maintenanceDate').value = today;
  
  // حساب تاريخ الصيانة القادمة (بعد 3 أشهر)
  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 3);
  const nextDateFormatted = nextDate.toISOString().split('T')[0];
  document.getElementById('nextMaintenanceDate').value = nextDateFormatted;

  // تحميل السجلات من localStorage
  let maintenanceRecords = JSON.parse(localStorage.getItem('maintenanceRecords')) || [];
  
  // عناصر واجهة المستخدم
  const form = document.getElementById('maintenanceForm');
  const tableBody = document.querySelector('#maintenanceTable tbody');
  const noRecordsRow = document.getElementById('noRecords');
  const searchInput = document.getElementById('searchInput');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const detailsModal = document.getElementById('detailsModal');
  const modalContent = document.getElementById('modalContent');
  const closeModalBtn = document.getElementById('closeModal');
  const deleteRecordBtn = document.getElementById('deleteRecord');
  
  // إحصائيات
  const totalMaintenanceEl = document.getElementById('totalMaintenance');
  const upcomingMaintenanceEl = document.getElementById('upcomingMaintenance');
  const oilChangesEl = document.getElementById('oilChanges');
  const tireChangesEl = document.getElementById('tireChanges');
  
  // إعدادات التقسيم
  let currentPage = 1;
  const recordsPerPage = 5;
  let filteredRecords = [];
  let currentRecordId = null;

  // عرض السجلات
  function displayRecords(records = maintenanceRecords) {
    filteredRecords = records;
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    if (paginatedRecords.length === 0) {
      noRecordsRow.classList.remove('hidden');
    } else {
      noRecordsRow.classList.add('hidden');
      
      paginatedRecords.forEach(record => {
        const remainingDistance = record.oilChangeDistance - record.distanceDriven;
        const status = getStatus(record.nextMaintenanceDate, remainingDistance);
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
          <td class="p-3 border-b">${record.carName}</td>
          <td class="p-3 border-b">${record.maintenanceType}</td>
          <td class="p-3 border-b">${formatDate(record.maintenanceDate)}</td>
          <td class="p-3 border-b">${record.distanceDriven.toLocaleString()}</td>
          <td class="p-3 border-b">
            <span class="status-badge ${getStatusClass(status)}">${status}</span>
          </td>
          <td class="p-3 border-b">
            <button class="view-details p-2 text-indigo-600 hover:text-indigo-800" data-id="${record.id}">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
    
    // تحديث معلومات التقسيم
    document.getElementById('currentItems').textContent = Math.min(endIndex, filteredRecords.length);
    document.getElementById('totalItems').textContent = filteredRecords.length;
    
    // تعطيل/تفعيل أزرار التقسيم
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = endIndex >= filteredRecords.length;
    
    // تحديث الإحصائيات
    updateStatistics();
  }
  
  // تحديث الإحصائيات
  function updateStatistics() {
    totalMaintenanceEl.textContent = maintenanceRecords.length;
    
    // الصيانة القريبة (في خلال 30 يوم)
    const upcoming = maintenanceRecords.filter(record => {
      const daysLeft = getDaysLeft(record.nextMaintenanceDate);
      return daysLeft <= 30 && daysLeft > 0;
    }).length;
    upcomingMaintenanceEl.textContent = upcoming;
    
    // عدد مرات تغيير الفيدونج
    const oilChanges = maintenanceRecords.filter(record => 
      record.maintenanceType === 'فيدونج'
    ).length;
    oilChangesEl.textContent = oilChanges;
    
    // عدد مرات تغيير العجلات
    const tireChanges = maintenanceRecords.filter(record => 
      record.maintenanceType === 'عجلات'
    ).length;
    tireChangesEl.textContent = tireChanges;
  }
  
  // الحصول على حالة الصيانة
  function getStatus(nextDate, remainingDistance) {
    const today = new Date();
    const nextMaintenanceDate = new Date(nextDate);
    const daysLeft = Math.floor((nextMaintenanceDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0 || remainingDistance <= 0) {
      return 'مستحقة الآن';
    } else if (daysLeft <= 7 || remainingDistance <= 500) {
      return 'قريباً';
    } else if (daysLeft <= 30 || remainingDistance <= 1000) {
      return 'تحت المراقبة';
    } else {
      return 'جيدة';
    }
  }
  
  // الحصول على كلاس الحالة
  function getStatusClass(status) {
    switch(status) {
      case 'مستحقة الآن': return 'status-active';
      case 'قريباً': return 'status-pending';
      case 'تحت المراقبة': return 'status-pending';
      default: return 'status-completed';
    }
  }
  
  // حساب الأيام المتبقية
  function getDaysLeft(nextDate) {
    const today = new Date();
    const nextMaintenanceDate = new Date(nextDate);
    return Math.floor((nextMaintenanceDate - today) / (1000 * 60 * 60 * 24));
  }
  
  // تنسيق التاريخ
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  }
  
  // إضافة سجل جديد
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newRecord = {
      id: Date.now().toString(),
      carName: document.getElementById('carName').value,
      maintenanceType: document.getElementById('maintenanceType').value,
      maintenanceDate: document.getElementById('maintenanceDate').value,
      nextMaintenanceDate: document.getElementById('nextMaintenanceDate').value,
      distanceDriven: parseInt(document.getElementById('distanceDriven').value),
      oilChangeDistance: parseInt(document.getElementById('oilChangeDistance').value),
      oilFilter: document.querySelector('input[name="oilFilter"]:checked').value,
      airFilter: document.querySelector('input[name="airFilter"]:checked').value,
      notes: document.getElementById('notes').value
    };
    
    maintenanceRecords.unshift(newRecord);
    localStorage.setItem('maintenanceRecords', JSON.stringify(maintenanceRecords));
    
    form.reset();
    document.getElementById('maintenanceDate').value = today;
    document.getElementById('nextMaintenanceDate').value = nextDateFormatted;
    
    currentPage = 1;
    displayRecords();
  });
  
  // البحث في السجلات
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    if (searchTerm === '') {
      displayRecords();
      return;
    }
    
    const filtered = maintenanceRecords.filter(record => 
      record.carName.toLowerCase().includes(searchTerm) || 
      record.maintenanceType.toLowerCase().includes(searchTerm) ||
      record.notes.toLowerCase().includes(searchTerm)
    );
    
    currentPage = 1;
    displayRecords(filtered);
  });
  
  // التقسيم
  prevPageBtn.addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      displayRecords();
    }
  });
  
  nextPageBtn.addEventListener('click', function() {
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayRecords();
    }
  });
  
  // عرض التفاصيل
  tableBody.addEventListener('click', function(e) {
    if (e.target.closest('.view-details')) {
      const recordId = e.target.closest('.view-details').dataset.id;
      const record = maintenanceRecords.find(r => r.id === recordId);
      
      if (record) {
        currentRecordId = recordId;
        showRecordDetails(record);
      }
    }
  });
  
  // عرض تفاصيل السجل في المودال
  function showRecordDetails(record) {
    const remainingDistance = record.oilChangeDistance - record.distanceDriven;
    const daysLeft = getDaysLeft(record.nextMaintenanceDate);
    
    modalContent.innerHTML = `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="font-medium">اسم السيارة:</span>
        <span>${record.carName}</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="font-medium">نوع الصيانة:</span>
        <span>${record.maintenanceType}</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="font-medium">تاريخ الصيانة:</span>
        <span>${formatDate(record.maintenanceDate)}</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="font-medium">تاريخ الصيانة القادمة:</span>
        <span>${formatDate(record.nextMaintenanceDate)} <small class="text-gray-500">(${daysLeft} يوم)</small></span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="font-medium">المسافة المقطوعة:</span>
        <span>${record.distanceDriven.toLocaleString()} كم</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="font-medium">مسافة تغيير الفيدونج:</span>
        <span>${record.oilChangeDistance.toLocaleString()} كم</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="font-medium">المسافة المتبقية:</span>
        <span>${remainingDistance.toLocaleString()} كم</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="font-medium">فلتر الزيت:</span>
        <span>${record.oilFilter}</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span class="font-medium">فلتر الهواء:</span>
        <span>${record.airFilter}</span>
      </div>
      <div class="p-3 bg-gray-50 rounded-lg">
        <div class="font-medium mb-2">ملاحظات:</div>
        <div>${record.notes || 'لا توجد ملاحظات'}</div>
      </div>
    `;
    
    detailsModal.classList.remove('hidden');
  }
  
  // إغلاق المودال
  closeModalBtn.addEventListener('click', function() {
    detailsModal.classList.add('hidden');
  });
  
  // حذف السجل
  deleteRecordBtn.addEventListener('click', function() {
    if (currentRecordId) {
      maintenanceRecords = maintenanceRecords.filter(record => record.id !== currentRecordId);
      localStorage.setItem('maintenanceRecords', JSON.stringify(maintenanceRecords));
      detailsModal.classList.add('hidden');
      displayRecords();
      currentRecordId = null;
    }
  });
  
  // إغلاق المودال عند النقر خارجها
  detailsModal.addEventListener('click', function(e) {
    if (e.target === detailsModal) {
      detailsModal.classList.add('hidden');
    }
  });
  
  // العرض الأولي
  displayRecords();
});
